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
  signInWithPopup,
  GoogleAuthProvider,
  // signOut,
  Auth,
} from 'firebase/auth';
import { doc, setDoc, getDocs, collection, getDoc } from 'firebase/firestore';

import { WalletContext } from './Wallet';

import { db } from 'utils/firebase/initialize';

interface OtcContextInterface {
  orders: any[];
  users: any[];
  trades: any[];
  token: String;
  user: any;
  validateUser?: Function;
  auth: Auth;
}

const initialState: OtcContextInterface = {
  orders: [],
  users: [],
  trades: [],
  token: 'DPX',
  user: undefined,
  auth: undefined,
};

export const OtcContext = createContext<OtcContextInterface>(initialState);

export const OtcProvider = (props) => {
  const { provider, accountAddress, connect } = useContext(WalletContext);

  const [state, setState] = useState<OtcContextInterface>(initialState);

  const auth = getAuth();

  const googleProvider = useMemo(() => {
    return new GoogleAuthProvider();
  }, []);
  googleProvider.addScope('https://www.googleapis.com/auth/contacts.readonly');

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

  const signIn = useCallback(async () => {
    if (!auth.currentUser) {
      signInWithPopup(auth, googleProvider)
        .then(async (result) => {
          setState((prevState) => ({ ...prevState, user: result.user }));
          const usersRef = doc(db, 'users', result.user.uid);
          const snapShot = await getDoc(usersRef);
          if (snapShot.exists) return;
          await setDoc(doc(db, 'user', result.user.uid), {
            accountAddress: accountAddress,
            email: result.user.email,
            uid: result.user.uid,
          });
        })
        .catch((e) => console.log(GoogleAuthProvider.credentialFromError(e)));
    }
  }, [auth, googleProvider, accountAddress]);

  const validateUser = useCallback(async () => {
    if (!accountAddress) return;

    if (!auth.currentUser) await signIn();
    else console.log('Already signed in with user: ', auth.currentUser);
  }, [accountAddress, auth.currentUser, signIn]);

  useEffect(() => {
    setState((prevState) => ({ ...prevState, user: auth.currentUser }));
  }, [auth.currentUser, auth, accountAddress]);

  const contextValue = {
    ...state,
    auth,
    validateUser,
  };
  return (
    <OtcContext.Provider value={contextValue}>
      {props.children}
    </OtcContext.Provider>
  );
};
