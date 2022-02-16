import {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from 'react';
import { BigNumber } from 'ethers';

import { DiamondPepeNFTs, DiamondPepeNFTs__factory } from '@dopex-io/sdk';

import { WalletContext } from './Wallet';

export interface UserData {
  deposited: BigNumber;
  minted: boolean;
}

export interface Data {
  isDepositPeriod: boolean;
  isFarmingPeriod: boolean;
  maxLpDeposits: BigNumber;
  mintPrice: BigNumber;
  totalDeposits: BigNumber;
}

interface DiamondPepeContextInterface {
  data: Data;
  userData: UserData;
  updateData?: Function;
  updateUserData?: Function;
}

const initialData: DiamondPepeContextInterface = {
  data: {
    isDepositPeriod: false,
    isFarmingPeriod: false,
    maxLpDeposits: BigNumber.from('0'),
    mintPrice: BigNumber.from('0'),
    totalDeposits: BigNumber.from('0'),
  },
  userData: { deposited: BigNumber.from('0'), minted: false },
};

export const DiamondPepeContext =
  createContext<DiamondPepeContextInterface>(initialData);

export const DiamondPepeProvider = (props) => {
  const { accountAddress, contractAddresses, provider, signer } =
    useContext(WalletContext);

  const [data, setData] = useState<Data>(initialData.data);
  const [userData, setUserData] = useState<UserData>(initialData.userData);

  const updateData = useCallback(async () => {
    if (!provider || !contractAddresses || !DiamondPepeNFTs__factory) return;

    const pepeContract = DiamondPepeNFTs__factory.connect(
      '0x3429d0b92e051d3ca10C01Ef8fa4dfEB7ECB5ce3',
      provider
    );
    const isDepositPeriod = await pepeContract.depositPeriod();
    const isFarmingPeriod = await pepeContract.farmingPeriod();
    const maxLpDeposits = await pepeContract.maxLpDeposits();
    const mintPrice = await pepeContract.mintPrice();
    const totalDeposits = await pepeContract.totalDeposits();

    setData({
      isDepositPeriod: isDepositPeriod,
      isFarmingPeriod: isFarmingPeriod,
      maxLpDeposits: maxLpDeposits,
      mintPrice: mintPrice,
      totalDeposits: totalDeposits,
    });
  }, [provider, contractAddresses]);

  const updateUserData = useCallback(async () => {
    if (!provider || !contractAddresses || !DiamondPepeNFTs__factory) return;

    const pepeContract = DiamondPepeNFTs__factory.connect(
      '0x3429d0b92e051d3ca10C01Ef8fa4dfEB7ECB5ce3',
      provider
    );
    const deposits = await pepeContract.usersDeposit(accountAddress);
    const minted = await pepeContract.didUserMint(accountAddress);

    setUserData({ deposited: deposits, minted: minted });
  }, [accountAddress, provider, contractAddresses]);

  useEffect(() => {
    updateData();
  }, [updateData]);

  useEffect(() => {
    updateUserData();
  }, [updateUserData]);

  let contextValue = {
    userData,
    data,
    updateData,
    updateUserData,
  };

  return (
    <DiamondPepeContext.Provider value={contextValue}>
      {props.children}
    </DiamondPepeContext.Provider>
  );
};
