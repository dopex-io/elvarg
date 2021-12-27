import {
  useState,
  useEffect,
  useCallback,
  useContext,
  createContext,
} from 'react';
import { getDocs, collection, DocumentData } from 'firebase/firestore';

import { WalletContext } from './Wallet';

import { db } from 'utils/firebase/initialize';

interface OtcContextInterface {
  orders: DocumentData[];
  users: DocumentData[];
  trades: DocumentData[];
  userTrades: DocumentData[];
  token: string;
  user: {
    accountAddress: string;
    username: string;
  };
  validateUser?: Function;
}

const initialState: OtcContextInterface = {
  orders: [],
  users: [],
  trades: [],
  userTrades: [],
  token: 'DPX',
  user: undefined,
};

export const OtcContext = createContext<OtcContextInterface>(initialState);

export const OtcProvider = (props) => {
  const { provider, accountAddress, connect } = useContext(WalletContext);

  const [state, setState] = useState<OtcContextInterface>(initialState);

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
  };
  return (
    <OtcContext.Provider value={contextValue}>
      {props.children}
    </OtcContext.Provider>
  );
};
