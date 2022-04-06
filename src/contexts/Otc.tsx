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
    if (!provider || !contractAddresses || !accountAddress) return;

    console.log('ran');

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
      '0x9ab24e47e95E839A1C132Ec093D59405e9611806',
      // '0xdf7431FE8b68Bf78cd4c70b134d05705F159De09',
      // '0xefe9519b1c6A0bc7962146819d58E875B2745A23',
      // '0xBfd349D9001E9C13C9c144ecE527b7c4757f425e',
      // '0xb88c4F032a0804dbF781aB8269455992B112F7cC',
      // '0x3d7ccDFC35a2ffe9d7281054A23440f77CD16338',
      // '0x3CfD8F0FE3Fa727A12A05fff56366dAff913549d',
      // '0xEc3AaC4e417131d5527f33131D87AC6be693baAa',
      // '0x893D4082349B2Da09923c0342AB1ac0BB61932E2',
      // '0x61a89D52C3b6e72d38804D74bc28F135419b9e54',
      // '0xf7B7A7702773Da25CF133762cCb5C231c8CC24c6',
      // '0x8f21f3d76dD92c78D6310fa7CB1081C515466CCF',
      // '0xECA29E73204b1d99a3D216BE27510102375dd3b4',
      // '0xdb567a22FE971e28CF4605a6B48b459Ab8a90D94',
      // '0x774f91aE44A80c492d6E52fA0E90FD0dcb3d1CCb',
      // '0x6B3dA822a001137f54e30b0D56C0B9Fa67B505De',
      // '0x1480b3Ad833b9c65C3c14F093dc2b62F08Db4466',
      // '0x393bf90c0E1D853eBFd5C131259B740aC4E928F2',
      // '0x2A16687F1779EB2500e6D84e41142Cf1B897e383',
      // '0xfb95b13CDd4B4bfe855Fab1C24B43e0F3a8c8cE9',
      // '0x774f6ecA8A0F25294Cbe20C479E2e83B6b2c5F70',
      // '0xc1bE108b6ccf809098D9Ec755815A09fCc42CAaF',
      // '0xB5c48842Ce873aC8E4D11E050A9059F109cAD727',
      // '0xFEe5F1c41B1cAa23F62d3338e3543f5d1de1F27c',
      // '0x02602Dc6DB4f93188caCE1b5F72A15EE6B37326e',
      // '0x6b49BFa298e3E65aD5A1aBb463dF557225D351d3',
      // '0x956c2e35d80d17A99Dd893fa3BF0e254db436F25',
      // '0xE3C5056A70bEBdB16F065C1d00c94064215e7A76',
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
      loaded: true,
    }));
  }, [accountAddress, contractAddresses, provider]);

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
    escrowData,
    setSelectedQuote,
  };
  return (
    <OtcContext.Provider value={contextValue}>
      {props.children}
    </OtcContext.Provider>
  );
};
