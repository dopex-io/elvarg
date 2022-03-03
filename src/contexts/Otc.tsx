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
  }[]; // todo: add counter party to a deposit in the contract
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
  }[]; // todo: add counter party to a deposit in the contract
}

// db
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
  const [openTradesData, setOpenTradesData] = useState([]);
  const [selectedEscrowData, setSelectedEscrowData] = useState<any>({});

  const loadContractData = useCallback(async () => {
    if (!provider || !contractAddresses || !accountAddress) return;

    const factory: EscrowFactory = EscrowFactory__factory.connect(
      contractAddresses.EscrowFactory,
      provider
    );

    const escrowCount = (await factory.ESCROW_COUNT()).toNumber();

    const currentEscrowIndex = escrowCount > 0 ? escrowCount - 1 : escrowCount;
    const escrowAddresses: Promise<string[]> = Promise.all(
      range(escrowCount).map(async (_, index) => await factory.escrows(index))
    );

    const escrows: Escrow[] = (await escrowAddresses).map((escrow) =>
      Escrow__factory.connect(escrow, provider)
    );
    const quote = await escrows[currentEscrowIndex].escrowQuote();

    const symbol = await ERC20__factory.connect(quote, provider).symbol();

    let baseAddresses = await escrows[currentEscrowIndex].getBaseAddresses();

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

    const userAssetDeposits = (
      await Promise.all(
        assetPairs.map(async (pair) => ({
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
            accountAddress
          ),
          amount: await escrows[currentEscrowIndex].pendingBalances(
            pair.token2,
            pair.token1,
            accountAddress
          ),
          dealer: accountAddress,
        }))
      )
    ).filter(
      (result: any) =>
        result.amount.gt(BigNumber.from(0)) ||
        result.price.gt(BigNumber.from(0))
    );

    setUserDepositsData(userAssetDeposits);

    // Fetch all registered users
    const users: string[] = (
      await getDocs(collection(db, 'users'))
    ).docs.flatMap((doc) => doc.id);

    let openTrades = [];

    // Get all open orders, filter them for each user registered in the db (expensive)
    for (let i = 0; i < users.length; i++) {
      openTrades.push(
        (
          await Promise.all(
            assetPairs.map(async (pair) => ({
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
              dealerReceiveAmount: await escrows[
                currentEscrowIndex
              ].pendingBalances(pair.token2, pair.token1, users[i]),
              dealerSendAmount: await escrows[currentEscrowIndex].balances(
                pair.token1,
                pair.token2,
                users[i]
              ),
              dealer: users[i],
            }))
          )
        ).filter(
          (result: any) =>
            result.dealerReceiveAmount.gt(BigNumber.from(0)) ||
            result.dealerSendAmount.gt(BigNumber.from(0))
        )
      );
    }

    openTrades = openTrades
      .flat()
      .filter((item) => item.dealer != accountAddress);

    setOpenTradesData(openTrades);

    setSelectedEscrowData({
      selectedEscrow: escrows[escrowCount - 1].address,
      quote,
      symbol,
      bases: baseAssetToSymbolMapping,
    });

    // const filter = {
    //   address: escrows[currentEscrowIndex].address,
    //   fromBlock: 0,
    //   toBlock: 10000,
    //   topics: [escrows[currentEscrowIndex].interface.events.Settle.topic],
    // };

    // console.log(await provider.getLogs(filter));

    // const settleEvents = escrows[currentEscrowIndex].on(
    //   'Settle',
    //   async (quote, base, dealer, settleAmount, depositAmount) =>
    //     dealer === accountAddress
    // );

    // console.log(settleEvents);

    setState((prevState) => ({
      ...prevState,
      factoryContract: factory,
      escrows,
      escrowCount,
    }));
  }, [accountAddress, contractAddresses, provider]);

  useEffect(() => {
    loadContractData();
  }, [loadContractData]);

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
    openTradesData,
    selectedEscrowData,
  };
  return (
    <OtcContext.Provider value={contextValue}>
      {props.children}
    </OtcContext.Provider>
  );
};
