// @ts-nocheck TODO: FIX
import {
  useState,
  useEffect,
  useCallback,
  useContext,
  createContext,
} from 'react';
import { BigNumber, utils as ethersUtils } from 'ethers';
import { getDocs, collection, DocumentData } from 'firebase/firestore';
import {
  Addresses,
  ERC20__factory,
  Escrow,
  Escrow__factory,
} from '@dopex-io/sdk';

import { WalletContext } from 'contexts/Wallet';

import { db } from 'utils/firebase/initialize';
import sanitizeOptionSymbol from 'utils/general/sanitizeOptionSymbol';

import { otcGraphClient } from 'graphql/apollo';

import {
  GetUserOpenOrdersDocument,
  GetUserOpenOrdersQuery,
  GetEscrowTransactionsDocument,
  GetEscrowTransactionsQuery,
  GetPendingOrdersAgainstUserDocument,
  GetPendingOrdersAgainstUserQuery,
} from 'graphql/generated/otc';

import { ApolloQueryResult } from '@apollo/client';

// contracts
interface OtcContractsInterface {
  escrow: Escrow;
  escrowData?: {
    escrowAddress: string;
    quotes: { symbol: string; address: string }[];
    bases: { symbol: string; address: string; isPut: boolean }[];
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
  tradeHistoryData?: {
    dealer: string;
    counterParty: string;
    quote: string;
    base: string;
    sendAmount: string;
    receiveAmount: string;
    timestamp: number;
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
  selectedQuote?: {
    address: string;
    symbol: string;
  };
  setSelectedQuote?: Function;
}

const initialState: OtcContractsInterface & OtcUserData = {
  escrow: undefined,
  escrowData: {
    quotes: [],
    escrowAddress: '',
    bases: [],
  },
  userDepositsData: [],
  openTradesData: [],
  tradeHistoryData: [],
  orders: [],
  users: [],
  trades: [],
  userTrades: [],
  user: undefined,
  loaded: false,
  selectedQuote: {
    address: '',
    symbol: '',
  },
  setSelectedQuote: () => {},
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
  const [tradeHistoryData, setTradeHistoryData] = useState([]);
  const [openTradesData, setOpenTradesData] = useState([]);
  const [escrowData, setEscrowData] = useState<any>({});
  const [loaded, setLoaded] = useState(false);

  const loadEscrowData = useCallback(async () => {
    if (!provider || !contractAddresses || !accountAddress) return;

    const escrow = Escrow__factory.connect(contractAddresses.Escrow, provider);

    let quoteAddresses = ['0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8']; // USDC
    let quoteAssetToSymbolMapping = await Promise.all(
      quoteAddresses.map(async (address) => {
        const quote = ERC20__factory.connect(address, provider);
        const symbol = await quote.symbol();
        return {
          symbol,
          address,
        };
      })
    );

    // ERC20 Option contracts
    let baseAddresses = [
      '0x7Af6399E4dd8C1D5B7C53dc2c6Ad04b39049c83E',
      '0x8D66b80E03fCeff5d825B77433B62400C00dB22D',
      '0x3f0A22f98Df015FDD9B7eAAd29531956632d775a',
      '0xDb62c01C23E247cea558E90814dBeB215b92C81F',
      '0xE1ACc3254bE1CcED13c8760A34E6D672021D0e02',
      '0x411982342c0D41cEBB1706eD80ef32d48F3fEf3B',
      '0x459819C34266Dd9154172D373AC559Ce27f5F273',
      '0xedA8F8D555a89d1ce5c631027ab89fD761D614F7',
      '0xB5Acc94D901eAB4206b49652bBf80E14ed8a79a0',
      '0x7904eA09B0ce9A98Af8F4A2eD2f060364fB65042',
      '0x4D7d6100122c92DDad3b57E472b00979e45a2326',
      '0x7e00Ab584c3dcaB784FE8A04C471088C34386415',
      // '0x5bE3c77ED3Cd42fc2c702C9fcd665f515862B0AE', GMX SSOV V2
    ];

    let baseAssetToSymbolMapping = await Promise.all(
      baseAddresses.map(async (address) => {
        const base = ERC20__factory.connect(address, provider);
        const symbol = await base.symbol();
        const isPut = symbol.toString().indexOf('CALL') === -1;

        return {
          symbol: sanitizeOptionSymbol(symbol),
          address,
          isPut,
        };
      })
    );

    const escrowAssets: string[] = baseAddresses.concat(quoteAddresses);

    let escrowAssetPairsV1 = escrowAssets.flatMap((v, i) =>
      escrowAssets.slice(i + 1).map((w) => ({ token1: v, token2: w }))
    );

    escrowAssetPairsV1.push(
      ...escrowAssets.flatMap((v, i) =>
        escrowAssets.slice(i + 1).map((w) => ({ token1: w, token2: v }))
      )
    );

    const escrowAssetPairs = quoteAddresses
      .map((quote: string) => {
        return baseAddresses.map((base: string) => {
          return {
            token1: quote,
            token2: base,
          };
        });
      })
      .flat()
      .concat(
        baseAddresses
          .map((base) => {
            return quoteAddresses.map((quote) => {
              return {
                token1: base,
                token2: quote,
              };
            });
          })
          .flat()
      );

    let assetToSymbolMapping = quoteAssetToSymbolMapping.concat(
      baseAssetToSymbolMapping
    );

    setEscrowData({
      escrowAddress: escrow.address,
      quotes: quoteAssetToSymbolMapping,
      bases: baseAssetToSymbolMapping,
    });

    setLoaded(true);

    setState((prevState) => ({
      ...prevState,
      escrow,
      loaded: true,
    }));
  }, [accountAddress, contractAddresses, provider]);

  const getTradeHistoryData = useCallback(async () => {
    const queryResult: ApolloQueryResult<GetEscrowTransactionsQuery> =
      await otcGraphClient.query({
        query: GetEscrowTransactionsDocument,
        fetchPolicy: 'no-cache',
      });

    const { data } = queryResult;

    const tradeHistory = data.orders.map((op) => {
      const dealer = op.dealer.id;
      const counterParty = op.counterParty.id;
      const quote = op.quote;
      const base = op.base;
      const sendAmount = op.sendAmount;
      const receiveAmount = op.receiveAmount;
      const timestamp = Number(op.transaction.timestamp);

      return {
        dealer,
        counterParty,
        quote,
        base,
        sendAmount,
        receiveAmount,
        timestamp,
      };
    });

    setTradeHistoryData(tradeHistory);
  }, []);

  const getUserDepositData = useCallback(async () => {
    if (!accountAddress || !provider || !state.escrow) return;

    const queryResult: ApolloQueryResult<GetUserOpenOrdersQuery> =
      await otcGraphClient.query({
        query: GetUserOpenOrdersDocument,
        variables: { user: accountAddress.toLowerCase() },
        fetchPolicy: 'no-cache',
      });

    const { data }: any = queryResult;

    const userDeposits = data.users.map(async (item: any) => {
      return await Promise.all(
        item.ordersOpened.map(async (order) => {
          const isBuy = order.quote === state.escrow.quoteAddresses[0];

          const quoteSymbol = sanitizeOptionSymbol(
            await ERC20__factory.connect(order.quote, provider).symbol()
          );

          const baseSymbol = sanitizeOptionSymbol(
            await ERC20__factory.connect(order.base, provider).symbol()
          );

          return {
            isBuy,
            dealer: order.dealer.id,
            counterParty: order.counterParty.id,
            quote: {
              address: order.quote,
              symbol: quoteSymbol,
            },
            base: {
              address: order.base,
              symbol: baseSymbol,
            },
            amount: order.sendAmount,
            price: order.receiveAmount,
          };
        })
      );
    });
    setUserDepositsData((await Promise.all(userDeposits)).flat());
  }, [accountAddress, provider, state]);

  const getUserPendingTrades = useCallback(async () => {
    if (!accountAddress || !provider || !state.escrow) return;

    const queryResult: ApolloQueryResult<GetPendingOrdersAgainstUserQuery> =
      await otcGraphClient.query({
        query: GetPendingOrdersAgainstUserDocument,
        variables: { user: accountAddress.toLowerCase() },
        fetchPolicy: 'no-cache',
      });

    const { data }: any = queryResult;

    const ordersOpened = data.users.map(async (item: any) => {
      return await Promise.all(
        item.ordersOpened.map(async (order) => {
          const isBuy = order.quote === state.escrow.quoteAddresses[0];

          const quoteSymbol = sanitizeOptionSymbol(
            await ERC20__factory.connect(order.quote, provider).symbol()
          );

          const baseSymbol = sanitizeOptionSymbol(
            await ERC20__factory.connect(order.base, provider).symbol()
          );

          return {
            isBuy,
            dealer: order.dealer.id,
            counterParty: order.counterParty.id,
            dealerQuote: {
              address: order.quote,
              symbol: quoteSymbol,
            },
            dealerBase: {
              address: order.base,
              symbol: baseSymbol,
            },
            dealerSendAmount: order.sendAmount,
            dealerReceiveAmount: order.receiveAmount,
          };
        })
      );
    });
    setOpenTradesData((await Promise.all(ordersOpened)).flat());
  }, [accountAddress, provider, state]);

  const setSelectedQuote = useCallback(
    (selectedQuote) => {
      if (!accountAddress || !escrowData) return;

      setState((prevState) => ({ ...prevState, selectedQuote }));
    },
    [accountAddress, escrowData]
  );

  const getOtcData = useCallback(async () => {
    if (!db || !provider || !accountAddress) return;

    const orders: any = (await getDocs(collection(db, 'orders'))).docs
      .flatMap((doc) => ({ id: doc.id, data: doc.data() }))
      .sort((a, b) =>
        a.data.timestamp.seconds < b.data.timestamp.seconds
          ? 1
          : a.data.timestamp.seconds < b.data.timestamp.seconds
          ? 0
          : -1
      ); // Sorted orders by rfq open time

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
    loadEscrowData();
  }, [loadEscrowData]);

  useEffect(() => {
    getOtcData();
  }, [getOtcData]);

  useEffect(() => {
    getTradeHistoryData();
  }, [getTradeHistoryData]);

  useEffect(() => {
    getUserDepositData();
  }, [getUserDepositData]);

  useEffect(() => {
    getUserPendingTrades();
  }, [getUserPendingTrades]);

  const validateUser = useCallback(async () => {
    if (!accountAddress) return;

    if (!state.user) {
      return false; // User does not exist
    } else {
      return true;
    }
  }, [accountAddress, state]);

  const contextValue = {
    ...state,
    validateUser,
    userDepositsData,
    openTradesData,
    tradeHistoryData,
    escrowData,
    setSelectedQuote,
  };
  return (
    <OtcContext.Provider value={contextValue}>
      {props.children}
    </OtcContext.Provider>
  );
};
