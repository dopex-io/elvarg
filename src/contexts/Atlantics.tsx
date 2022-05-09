import {
  createContext,
  useEffect,
  useContext,
  useState,
  useCallback,
} from 'react';
import { BigNumber } from 'ethers';
// import axios from 'axios';

import { WalletContext } from './Wallet';

export interface Atlantics {
  token?: string;
  type?: 'CALL' | 'PUT';
}

interface TempArrObjectInterface {
  tempObjString: string;
  tempObjNumber: number;
}

interface TempObjInterface {
  tempBool: boolean;
  tempBN: BigNumber;
  tempString: string;
  tempNumber: number;
}

interface AtlanticsContextInterface {
  atlanticsObject?: TempObjInterface;
  atlanticsArr?: TempArrObjectInterface[];
}

const initialAtlanticsArrData = [
  {
    tempObjString: '',
    tempObjNumber: 0,
  },
];

const initialAtlanticsObjData = {
  tempBool: false,
  tempBN: BigNumber.from(0),
  tempString: '',
  tempNumber: 0,
};

const initialAtlanticsData = {
  atlanticsArr: initialAtlanticsArrData,
  atlanticsObject: initialAtlanticsObjData,
};

export const AtlanticsContext =
  createContext<AtlanticsContextInterface>(initialAtlanticsData);

export const AtlanticsProvider = (props) => {
  const { accountAddress, contractAddresses, provider, signer } =
    useContext(WalletContext);

  // const [selectedEpoch, setSelectedEpoch] = useState<number | null>(null);

  // states
  const [tempObj, setTempObj] = useState<TempObjInterface>();
  const [tempArr, setTempArr] = useState<TempArrObjectInterface[]>();

  // callbacks

  const updateTempObject = useCallback(() => {
    if (!provider || !accountAddress || !contractAddresses) return;
    console.log(tempObj);
  }, [tempObj, accountAddress, contractAddresses, provider]);

  const updateTempArray = useCallback(() => {
    if (!provider || !accountAddress || !contractAddresses) return;
    console.log(tempArr);
  }, [tempArr, accountAddress, contractAddresses, provider]);

  // useEffects

  useEffect(() => {
    updateTempObject();
  }, [updateTempObject]);

  useEffect(() => {
    updateTempArray();
  }, [updateTempArray]);

  const contextValue = {
    atlanticsBool: true,
    atlanticsArr: [],
    atlanticsObj: {},
  };

  return (
    <AtlanticsContext.Provider value={contextValue}>
      {props.children}
    </AtlanticsContext.Provider>
  );
};
