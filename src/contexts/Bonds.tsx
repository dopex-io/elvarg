// @ts-nocheck TODO: FIX
import {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
  useMemo,
} from 'react';

import abi from '../pages/Bonds/abi.json';
import { BigNumber, ethers } from 'ethers';
import { WalletContext } from './Wallet';

interface DpxBondsData {
  epochNumber: number;
  epochExpiry: number;
  depositPerNft: number;
  epochStartTime: number;
}

interface DpxBondsContextInterface extends DpxBondsData {}

const initialData = {
  epochNumber: '3',
  epochExpiry: null,
  depositPerNft: '',
  epochStartTime: null,
};

export const DpxBondsContext =
  createContext<DpxBondsContextInterface>(initialData);

export const DpxBondsProvider = (props) => {
  const [state, setState] = useState(initialData);

  const { accountAddress, contractAddresses, provider, signer } =
    useContext(WalletContext);

  const bondsContract = useMemo(() => {
    return new ethers.Contract(
      '0xdA0Fb91C9b6eD017c9e2C21dA8133bf79B73B178',
      abi,
      signer
    );
  }, [signer]);

  const getEpochData = async () => {
    let epochNumber = parseInt(await bondsContract.epochNumber());
    let epochStartTime = new Date(await bondsContract.startTime());
    let epochExpiry = new Date(await bondsContract.epochExpiry(epochNumber));
    setState((prevState: any) => ({
      ...prevState,
      epochNumber: epochNumber,
      epochExpiry: epochExpiry,
      epochStartTime: epochStartTime,
    }));
  };

  useEffect(() => {
    signer && getEpochData();
  }, [signer]);

  return (
    <DpxBondsContext.Provider value={state}>
      {props.children}
    </DpxBondsContext.Provider>
  );
};
