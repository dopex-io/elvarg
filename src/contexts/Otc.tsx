import {
  useState,
  useEffect,
  useCallback,
  useContext,
  createContext,
} from 'react';
// import { hexZeroPad, id } from 'ethers/lib/utils';
import { getDocs, collection, DocumentData } from 'firebase/firestore';
import range from 'lodash/range';
import {
  ERC20__factory,
  Escrow,
  EscrowFactory,
  EscrowFactory__factory,
  Escrow__factory,
} from '@dopex-io/sdk';

import { WalletContext } from 'contexts/Wallet';

import { db } from 'utils/firebase/initialize';

interface OtcContractsInterface {
  factoryContract: EscrowFactory;
  escrows: Escrow[];
  escrowCount: number;
  selectedEscrowData?: {
    selectedEscrow: string;
    quote: string;
    symbol: string;
    bases: { symbol: string; address: string }[];
  };
  userDepositsForAsset?: any[];
}

interface OtcUserData {
  orders: DocumentData[];
  users: DocumentData[];
  trades: DocumentData[];
  userTrades: DocumentData[];
  user: {
    accountAddress: string;
    username: string;
  };
  validateUser?: Function;
}

const initialState: OtcUserData & OtcContractsInterface = {
  orders: [],
  users: [],
  trades: [],
  userTrades: [],
  user: undefined,
  factoryContract: undefined,
  escrows: [],
  escrowCount: 0,
  selectedEscrowData: {
    selectedEscrow: '',
    quote: '',
    symbol: '',
    bases: [],
  },
  userDepositsForAsset: [],
};

export const OtcContext = createContext<OtcUserData & OtcContractsInterface>(
  initialState
);

export const OtcProvider = (props) => {
  const { provider, accountAddress, contractAddresses } =
    useContext(WalletContext);

  const [state, setState] = useState<OtcUserData & OtcContractsInterface>(
    initialState
  );
  const [userDepositsData, setUserDepositsData] = useState([]);

  const loadContractData = useCallback(async () => {
    if (!provider || !contractAddresses) return;

    const factory: EscrowFactory = EscrowFactory__factory.connect(
      contractAddresses.EscrowFactory,
      provider
    );
    const escrowCount = (await factory.ESCROW_COUNT()).toNumber();
    const escrowAddresses: Promise<string[]> = Promise.all(
      range(escrowCount).map(
        async (_, index) => await factory.escrows(index + 1)
      )
    );

    const escrows: Escrow[] = (await escrowAddresses).map((escrow) =>
      Escrow__factory.connect(escrow, provider)
    );
    const quote = await escrows[
      escrowCount > 0 ? escrowCount - 1 : escrowCount
    ].escrowQuote();

    const symbol = await ERC20__factory.connect(quote, provider).symbol();

    let baseAddresses = await escrows[
      escrowCount > 0 ? escrowCount - 1 : escrowCount
    ].getBaseAddresses();

    let baseAssetToSymbolMapping = await Promise.all(
      baseAddresses.map(async (address) => {
        const base = ERC20__factory.connect(address, provider);
        const symbol = await base.symbol();

        return {
          symbol,
          address,
        };
      })
    );

    const assets: string[] = baseAddresses
      .map((address) => address.toString())
      .concat([quote]);

    let assetPairs = assets?.flatMap((v, i) =>
      assets.slice(i + 1).map((w) => ({ token1: v, token2: w }))
    );
    assetPairs.push(
      ...assets.flatMap((v, i) =>
        assets.slice(i + 1).map((w) => ({ token1: w, token2: v }))
      )
    );

    const userAssetDeposits = await Promise.all(
      assetPairs.map((pair) =>
        escrows[0].balances(pair.token1, pair.token2, accountAddress)
      )
    );

    setUserDepositsData(userAssetDeposits);
    setState((prevState) => ({
      ...prevState,
      factoryContract: factory,
      escrows,
      assetPairs,
      escrowCount,
      selectedEscrowData: {
        selectedEscrow: escrows[escrowCount - 1].address,
        quote,
        symbol,
        bases: baseAssetToSymbolMapping,
      },
    }));
  }, [accountAddress, contractAddresses, provider]);

  // const getDepositEvents = useCallback(async () => {
  //   if (state.escrows === [] || !provider || !accountAddress) return;

  //   const escrowContract = Escrow__factory.connect(
  //     state.selectedEscrowData.selectedEscrow,
  //     provider
  //   );

  // let filter = {
  //   address: accountAddress,
  //   topics: [
  //     id('Deposit(address,address,address,uint256,uint256)'),
  //     hexZeroPad(accountAddress, 32),
  //   ],
  // };

  //   const depositEvents = escrowContract?.filters.Deposit(null);

  //   console.log('pspsps: ', depositEvents);
  // }, [accountAddress, provider, state]);

  useEffect(() => {
    loadContractData();
  }, [loadContractData]);

  // useEffect(() => {
  //   getDepositEvents();
  // }, [getDepositEvents]);

  useEffect(() => {
    const getOtcData = async () => {
      if (!db || !provider || !accountAddress) return;

      const orders: DocumentData[] = (
        await getDocs(collection(db, 'orders'))
      ).docs.flatMap((doc) => doc.data());

      const usersDocs: DocumentData[] = (
        await getDocs(collection(db, 'users'))
      ).docs.flatMap((doc) => doc);

      const userDoc = usersDocs.find((user) => user.id === accountAddress);

      const user = userDoc
        ? {
            accountAddress: userDoc.id,
            username: userDoc.data().username,
          }
        : undefined;

      // TODO: Use in RecentTrades table
      const userTrades: any = (
        await getDocs(collection(db, `users/${accountAddress}/trades`))
      ).docs.flatMap((doc) => doc.data());

      setState((prevState) => ({
        ...prevState,
        orders,
        users: usersDocs.map((user) => user.data()),
        user,
        userTrades,
      }));
    };
    getOtcData();
  }, [provider, accountAddress]);

  const validateUser = useCallback(async () => {
    if (!accountAddress) return;

    if (!state.user) {
      return false; // User does not exist
    } else {
      setState((prevState) => ({ ...prevState, user: state.user }));
      return true;
    }
  }, [accountAddress, state]);

  const contextValue = {
    ...state,
    validateUser,
    userDepositsData,
  };
  return (
    <OtcContext.Provider value={contextValue}>
      {props.children}
    </OtcContext.Provider>
  );
};
