import {
  useState,
  useEffect,
  useCallback,
  useContext,
  createContext,
} from 'react';
import { BigNumber } from 'ethers';
import { getDocs, collection, DocumentData } from 'firebase/firestore';
import range from 'lodash/range';
import {
  Addresses,
  ERC20__factory,
  Escrow,
  EscrowFactory,
  EscrowFactory__factory,
  Escrow__factory,
} from '@dopex-io/sdk';

import { WalletContext } from 'contexts/Wallet';

import { db } from 'utils/firebase/initialize';

// contracts
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
  userDepositsData?: {
    isBuy: boolean;
    quote: {
      address: string;
      symbol: string;
    };
    base: {
      address: string;
      symbol: string;
    };
    amount: BigNumber;
    price: BigNumber;
    dealer: string;
    counterParty: string;
  }[];
  openTradesData?: {
    isBuy: boolean;
    dealerQuote: {
      address: string;
      symbol: string;
    };
    dealerBase: {
      address: string;
      symbol: string;
    };
    dealerReceiveAmount: BigNumber;
    dealerSendAmount: BigNumber;
    dealer: string;
    counterParty: string;
  }[];
}

// db
interface OtcUserData {
  orders: any;
  users: DocumentData[];
  trades: DocumentData[];
  userTrades: DocumentData[];
  user: {
    accountAddress: string;
    username: string;
  };
  validateUser?: Function;
  loaded?: boolean;
}

const initialState: OtcContractsInterface & OtcUserData = {
  factoryContract: undefined,
  escrows: [],
  escrowCount: 0,
  selectedEscrowData: {
    selectedEscrow: '',
    quote: '',
    symbol: '',
    bases: [],
  },
  userDepositsData: [],
  openTradesData: [],
  orders: [],
  users: [],
  trades: [],
  userTrades: [],
  user: undefined,
  loaded: false,
};

export const OtcContext = createContext<OtcUserData & OtcContractsInterface>(
  initialState
);

export const OtcProvider = (props) => {
  const { provider, accountAddress, contractAddresses, chainId } =
    useContext(WalletContext);

  const [state, setState] = useState<OtcUserData & OtcContractsInterface>(
    initialState
  );
  const [userDepositsData, setUserDepositsData] = useState([]);
  const [openTradesData, setOpenTradesData] = useState([]);
  const [selectedEscrowData, setSelectedEscrowData] = useState<any>({});
  const [loaded, setLoaded] = useState(false);

  const loadContractData = useCallback(async () => {
    if (!provider || !contractAddresses || !accountAddress) return;

    const factory = EscrowFactory__factory.connect(
      Addresses[chainId].EscrowFactory,
      provider
    );

    const escrowCount = (await factory.ESCROW_COUNT()).toNumber();

    const currentEscrowIndex = 0;
    const escrowAddresses: Promise<string[]> = Promise.all(
      range(escrowCount).map(
        async (_, index) => await factory.escrows(index + 1)
      )
    );

    const escrows = (await escrowAddresses).map((escrow) =>
      Escrow__factory.connect(escrow, provider)
    );

    const quote = await escrows[currentEscrowIndex].quoteAsset(); // USDT
    const symbol = await ERC20__factory.connect(quote, provider).symbol();

    let baseAddresses = [
      '0xADCeD0735874eA25e95EC0EAd0E355f8E863Fb44', // MC-CALL-1000
      '0x40279bD5e30041970AA4190C63cDF10942f7684D', // MC-CALL-2000
    ];
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

    // Fetch all registered users
    const users: string[] = (
      await getDocs(collection(db, 'users'))
    ).docs.flatMap((doc) => doc.id);

    const userAssetDeposits = (
      await Promise.all(
        assetPairs.map(async (pair) => {
          return await Promise.all(
            users.map(async (user) => ({
              isBuy: pair.token1 === quote,
              quote: {
                address: pair.token1,
                symbol: await ERC20__factory.connect(
                  pair.token1,
                  provider
                ).symbol(),
              },
              base: {
                address: pair.token2,
                symbol: await ERC20__factory.connect(
                  pair.token2,
                  provider
                ).symbol(),
              },
              price: await escrows[currentEscrowIndex].balances(
                pair.token1,
                pair.token2,
                accountAddress,
                user
              ),
              amount: await escrows[currentEscrowIndex].pendingBalances(
                pair.token2,
                pair.token1,
                accountAddress,
                user
              ),
              dealer: accountAddress,
              counterParty: user,
            }))
          );
        })
      )
    )
      .flat()
      .filter(
        (result: any) =>
          result.amount.gt(BigNumber.from(0)) ||
          result.price.gt(BigNumber.from(0))
      );

    setUserDepositsData(userAssetDeposits);

    const openTrades = await Promise.all(
      assetPairs.map(async (pair) => {
        return (
          await Promise.all(
            users.map(async (user) => ({
              isBuy: pair.token1 === quote,
              dealerQuote: {
                address: pair.token1,
                symbol: await ERC20__factory.connect(
                  pair.token1,
                  provider
                ).symbol(),
              },
              dealerBase: {
                address: pair.token2,
                symbol: await ERC20__factory.connect(
                  pair.token2,
                  provider
                ).symbol(),
              },
              dealerSendAmount: await escrows[currentEscrowIndex].balances(
                pair.token1,
                pair.token2,
                user,
                accountAddress
              ),
              dealerReceiveAmount: await escrows[
                currentEscrowIndex
              ].pendingBalances(pair.token2, pair.token1, user, accountAddress),
              dealer: user,
              counterParty: accountAddress,
            }))
          )
        )
          .flat()
          .filter(
            (trade) =>
              trade.dealerReceiveAmount.gt(0) || trade.dealerSendAmount.gt(0)
          );
      })
    );

    setOpenTradesData(openTrades.flat());

    setSelectedEscrowData({
      selectedEscrow: escrows[currentEscrowIndex].address,
      quote,
      symbol,
      bases: baseAssetToSymbolMapping,
    });

    setLoaded(true);

    setState((prevState) => ({
      ...prevState,
      factoryContract: factory,
      escrows,
      escrowCount,
      loaded,
    }));
  }, [accountAddress, chainId, contractAddresses, loaded, provider]);

  const getOtcData = useCallback(async () => {
    if (!db || !provider || !accountAddress) return;

    const orders: any = (await getDocs(collection(db, 'orders'))).docs.flatMap(
      (doc) => ({ id: doc.id, data: doc.data() })
    );

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
  }, [accountAddress, provider]);

  useEffect(() => {
    loadContractData();
  }, [loadContractData]);

  useEffect(() => {
    getOtcData();
  }, [getOtcData]);

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
    openTradesData,
    selectedEscrowData,
  };
  return (
    <OtcContext.Provider value={contextValue}>
      {props.children}
    </OtcContext.Provider>
  );
};

// const filter = {
//   address: escrow.address,
//   fromBlock: 0,
//   toBlock: 10000,
//   topics: [escrow.interface.events],
// };

// (await escrow.queryFilter(escrow.filters.Settle(), 9936231, 10000000)).map(
//   (event, index) => console.log(event.args.dealer)
// );

// console.log(
//   'Topics: ',
//   escrow.filters.Settle(accountAddress)
// );

// console.log(await provider.getLogs(filter));

// const settleEvents = escrow.on(
//   'Settle',
//   async (quote, base, dealer, settleAmount, depositAmount) =>
//     dealer === accountAddress
// );

// console.log(settleEvents);
