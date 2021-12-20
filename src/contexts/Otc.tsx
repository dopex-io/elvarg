import {
  useState,
  useEffect,
  useCallback,
  useContext,
  createContext,
} from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getDocs, collection, onSnapshot } from 'firebase/firestore';

import { WalletContext } from './Wallet';

import { db } from 'utils/firebase/initialize';

interface OtcContextInterface {
  orders: any[];
  users: any[];
  trades: any[];
  token: String;
  user: any;
  validateUser?: Function;
}

const initialState: OtcContextInterface = {
  orders: [],
  users: [],
  trades: [],
  token: 'DPX',
  user: undefined,
};

export const OtcContext = createContext<OtcContextInterface>(initialState);

export const OtcProvider = (props) => {
  const { provider, accountAddress } = useContext(WalletContext);

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

  const validateUser = useCallback(async () => {
    const googleProvider = new GoogleAuthProvider();
    googleProvider.addScope(
      'https://www.googleapis.com/auth/contacts.readonly'
    );

    if (!state.user || !accountAddress)
      await signInWithPopup(auth, googleProvider)
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          const user = result.user;

          setState((prevState) => ({ ...prevState, user: user }));
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          console.error('Error Code: ', errorCode);
          console.error('Error Message: ', errorMessage);
          console.error('Email: ', email);
          console.error('Credential: ', credential);
        });
  }, [accountAddress, auth, state.user]);

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
