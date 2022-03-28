import {
  useState,
  useEffect,
  useCallback,
  useContext,
  createContext,
} from 'react';
import { BigNumber } from 'ethers';
import { getDocs, collection, DocumentData } from 'firebase/firestore';
import {
  Addresses,
  ERC20__factory,
  Escrow,
  Escrow__factory,
} from '@dopex-io/sdk';

import { WalletContext } from 'contexts/Wallet';

import { db } from 'utils/firebase/initialize';
import { ethers } from '@0xsequence/multicall/node_modules/ethers';

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
  const [openTradesData, setOpenTradesData] = useState([]);
  const [escrowData, setEscrowData] = useState<any>({});
  const [loaded, setLoaded] = useState(false);

  const loadEscrowData = useCallback(async () => {
    if (
      !provider ||
      !contractAddresses ||
      !accountAddress ||
      !Addresses[chainId]
    )
      return;

    const escrow = Escrow__factory.connect(Addresses[chainId].Escrow, provider);

    let quoteAddresses = ['0xb26411F7515F94EbdB5152e396Fb0Ab8908423eA']; // USDT
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

    let baseAddresses = [
      '0xADCeD0735874eA25e95EC0EAd0E355f8E863Fb44', // MC-CALL-1000
      '0x40279bD5e30041970AA4190C63cDF10942f7684D', // MC-CALL-2000
      '0x47082620D0e262610E37D8De626202E27179d26c', // MP-CALL-2000
      '0xe1e4A58F35feCd9bf3C6b75e993211A8f6FDeCc7', // MP-CALL-1000
    ];
    let baseAssetToSymbolMapping = await Promise.all(
      baseAddresses.map(async (address) => {
        const base = ERC20__factory.connect(address, provider);
        const symbol = await base.symbol();
        const isPut = symbol.toString().indexOf('CALL') === -1;

        return {
          symbol,
          address,
          isPut,
        };
      })
    );

    const escrowAssets: string[] = baseAddresses.concat(quoteAddresses);

    let escrowAssetPairs = escrowAssets.flatMap((v, i) =>
      escrowAssets.slice(i + 1).map((w) => ({ token1: v, token2: w }))
    );

    escrowAssetPairs.push(
      ...escrowAssets.flatMap((v, i) =>
        escrowAssets.slice(i + 1).map((w) => ({ token1: w, token2: v }))
      )
    );

    // Fetch all registered users
    const users: string[] = (
      await getDocs(collection(db, 'users'))
    ).docs.flatMap((doc) => doc.id);

    const userAssetDeposits = (
      await Promise.all(
        escrowAssetPairs.map(async (pair) => {
          return await Promise.all(
            users.map(async (user) => ({
              isBuy: pair.token1 === quoteAddresses[0],
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
              amount: await escrow.balances(
                ethers.utils.solidityKeccak256(
                  ['address', 'address', 'address', 'address'],
                  [pair.token1, pair.token2, accountAddress, user]
                )
              ),
              price: await escrow.pendingBalances(
                ethers.utils.solidityKeccak256(
                  ['address', 'address', 'address', 'address'],
                  [pair.token2, pair.token1, accountAddress, user]
                )
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
      escrowAssetPairs.map(async (pair) => {
        return (
          await Promise.all(
            users.map(async (user) => ({
              isBuy: pair.token1 === quoteAddresses[0],
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
              dealerSendAmount: await escrow.balances(
                ethers.utils.solidityKeccak256(
                  ['address', 'address', 'address', 'address'],
                  [pair.token1, pair.token2, user, accountAddress]
                )
              ),
              dealerReceiveAmount: await escrow.pendingBalances(
                ethers.utils.solidityKeccak256(
                  ['address', 'address', 'address', 'address'],
                  [pair.token2, pair.token1, user, accountAddress]
                )
              ),
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

    setEscrowData({
      escrowAddress: escrow.address,
      quotes: quoteAssetToSymbolMapping,
      bases: baseAssetToSymbolMapping,
    });

    setLoaded(true);

    setState((prevState) => ({
      ...prevState,
      escrow,
      loaded,
    }));
  }, [accountAddress, chainId, contractAddresses, loaded, provider]);

  const setSelectedQuote = useCallback(
    (selectedQuote) => {
      if (!accountAddress || !escrowData) return;

      setState((prevState) => ({ ...prevState, selectedQuote }));
    },
    [accountAddress, escrowData]
  );

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
    loadEscrowData();
  }, [loadEscrowData]);

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
    escrowData,
    setSelectedQuote,
  };
  return (
    <OtcContext.Provider value={contextValue}>
      {props.children}
    </OtcContext.Provider>
  );
};
