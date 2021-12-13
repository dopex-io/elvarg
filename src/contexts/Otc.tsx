import {
  useState,
  useEffect,
  useCallback,
  useContext,
  createContext,
} from 'react';
import { getDocs, collection } from 'firebase/firestore';

import { WalletContext } from './Wallet';
// import { PortfolioContext } from './Portfolio';
import { AssetsContext } from './Assets';
import { SsovContext } from './Ssov';

import { db } from 'utils/firebase/initialize';

interface OtcContextInterface {
  orders: Object[];
  users: Object[];
  trades: Object[];
  token: String;
  user: String;
  validateUser?: Function;
}

const initialState: OtcContextInterface = {
  orders: [],
  users: [],
  trades: [],
  token: 'DPX',
  user: '',
};

export const OtcContext = createContext<OtcContextInterface>(initialState);

export const OtcProvider = (props) => {
  const { provider, accountAddress } = useContext(WalletContext);
  const { userAssetBalances } = useContext(AssetsContext);
  const context = useContext(SsovContext);

  const [state, setState] = useState<OtcContextInterface>(initialState);

  // const {
  //   selectedEpoch,
  //   ssovData: { epochTimes, epochStrikes },
  //   userSsovData: { epochStrikeTokens },
  //   tokenPrice,
  // } = context[state.token.toLocaleLowerCase()];

  useEffect(() => {
    const getOtcData = async () => {
      if (!db || !provider) return;

      const orders = (await getDocs(collection(db, 'orders'))).docs.flatMap(
        (doc) => doc.data()
      );
      const users = (await getDocs(collection(db, 'users'))).docs.flatMap(
        (doc) => doc.data()
      );
      const user = users.filter(
        (data) => data.accountAddress === accountAddress
      );

      setState((prevState) => ({
        ...prevState,
        orders,
        users,
        user: user[0]?.userId,
      }));
    };
    getOtcData();
    return;
  }, [provider, accountAddress]);

  const validateUser = useCallback(() => {
    if (!accountAddress) return;

    return state.user ? true : false;
  }, [accountAddress, state.user]);

  useEffect(() => {
    validateUser();
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
