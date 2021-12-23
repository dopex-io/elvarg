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
import { getDocs, collection, addDoc } from 'firebase/firestore';

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
      const users = (await getDocs(collection(db, 'users'))).docs.flatMap(
        (doc) => doc.data()
      );

      setState((prevState) => ({
        ...prevState,
        orders,
        users,
      }));
    };
    getOtcData();
    return;
  }, [provider, accountAddress]);

  // const signIn = useCallback(async () => {
  //   if (!accountAddress) return;

  //   if (!auth.currentUser) {
  //   signInAnonymously(auth)
  //     .then(async (result) => {
  //       setState((prevState) => ({
  //         ...prevState,
  //         auth: auth,
  //         user: auth.currentUser,
  //       }));
  //     })
  //     .catch((e) => console.log(e));
  //   }
  // }, [auth, accountAddress]);

  // Check if current address is already registered and registers them accordingly
  const validateUser = useCallback(async () => {
    if (!accountAddress) return;

    const filteredUsers = state.users.filter(
      (user) => user.accountAddress === accountAddress
    );

    if (filteredUsers.length === 0) {
      // Create a new user in the database
      // await addDoc(collection(db, 'users', auth.currentUser.uid), {
      //   uid: auth.currentUser.uid,
      //   accountAddress,
      // });
      // Sign in
      // await signIn();
      return false; // User does not exist
    } else {
      console.log('Already signed in with user: ', auth.currentUser);
      setState((prevState) => ({ ...prevState, user: filteredUsers[0] }));
      return true;
    }
  }, [accountAddress, auth, /* signIn,*/ state.users]);

  useEffect(() => {
    (async () => {
      await validateUser();
    })();
  }, [validateUser]);

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
