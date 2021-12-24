import {
  useState,
  useEffect,
  useCallback,
  useContext,
  createContext,
  useMemo,
} from 'react';
import {
  getAuth,
  signInAnonymously,
  // GoogleAuthProvider,
  // signOut,
  Auth,
} from 'firebase/auth';
import { doc, getDoc, getDocs, collection, addDoc } from 'firebase/firestore';

import { WalletContext } from './Wallet';

import { db } from 'utils/firebase/initialize';

interface OtcContextInterface {
  orders: any[];
  users: any[];
  trades: any[];
  token: string;
  user: any;
  auth: any;
  validateUser?: Function;
}

const initialState: OtcContextInterface = {
  orders: [],
  users: [],
  trades: [],
  token: 'DPX',
  user: '',
  auth: undefined,
};

export const OtcContext = createContext<OtcContextInterface>(initialState);

export const OtcProvider = (props) => {
  const { provider, accountAddress, connect } = useContext(WalletContext);

  const [state, setState] = useState<OtcContextInterface>(initialState);

  const auth = getAuth();

  useEffect(() => {
    const getOtcData = async () => {
      if (!db || !provider) return;

      const orders = (await getDocs(collection(db, 'orders'))).docs.flatMap(
        (doc) => doc.data()
      );
      const usersDocs = (await getDocs(collection(db, 'users'))).docs.flatMap(
        (doc) => doc
      );

      const userDoc = usersDocs.find((user) => user.id === accountAddress);

      const user = userDoc
        ? {
            accountAddress: userDoc.id,
            username: userDoc.data().username,
          }
        : undefined;

      setState((prevState) => ({
        ...prevState,
        orders,
        users: usersDocs.map((user) => user.data()),
        user,
      }));
    };
    getOtcData();
    return;
  }, [provider, accountAddress]);

  // Check if current address is already registered and registers them accordingly
  const validateUser = useCallback(async () => {
    if (!accountAddress) return;

    if (!state.user) {
      return false; // User does not exist
    } else {
      setState((prevState) => ({ ...prevState, user: state.user }));
      return true;
    }
  }, [accountAddress /*auth, signIn,*/, , state]);

  // useEffect(() => {
  //   (async () => {
  //     await validateUser();
  //   })();
  // }, [validateUser]);

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
