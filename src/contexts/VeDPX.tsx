import {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import {
  ERC20__factory,
  VeDPXYieldDistributor__factory,
  DPXVotingEscrow__factory,
} from '@dopex-io/sdk';
import { BigNumber } from 'ethers';
import noop from 'lodash/noop';

import { WalletContext } from './Wallet';

export const vedpxAddress = '0xdda230D9C8df41BC43797D5237dead9FAe3647e8';

export const vedpxYieldDistributorAddress =
  '0x06A6137AD9463b9EC55cbC7D7Bb9e33f25b3Cbc8';

interface vedpxData {
  vedpxTotalSupply: BigNumber;
  dpxLocked: BigNumber;
  totalVeDPXParticipating: BigNumber;
}

interface userVedpxData {
  vedpxBalance: BigNumber;
  lockedDpxBalance: BigNumber;
  dpxBalance: BigNumber;
  lockEnd: BigNumber;
  dpxEarned: BigNumber;
  userIsInitialized: boolean;
}

interface VeDPXContextInterface {
  data: vedpxData;
  userData: userVedpxData;
  updateData: Function;
  updateUserData: Function;
}

const initialData = {
  vedpxTotalSupply: BigNumber.from(0),
  dpxLocked: BigNumber.from(0),
  totalVeDPXParticipating: BigNumber.from(0),
};

const initialUserData = {
  vedpxBalance: BigNumber.from(0),
  lockedDpxBalance: BigNumber.from(0),
  dpxBalance: BigNumber.from(0),
  lockEnd: BigNumber.from(0),
  dpxEarned: BigNumber.from(0),
  userIsInitialized: true,
};

export const VeDPXContext = createContext<VeDPXContextInterface>({
  data: initialData,
  userData: initialUserData,
  updateData: noop,
  updateUserData: noop,
});

export const VeDPXProvider = (props: { children: ReactNode }) => {
  const { provider, accountAddress } = useContext(WalletContext);

  const [data, setData] = useState<vedpxData>(initialData);
  const [userData, setUserData] = useState<userVedpxData>(initialUserData);

  const updateData = useCallback(async () => {
    if (!provider) return;
    const dpx = ERC20__factory.connect(
      '0x3330BF0253f841d148F20500464D30cd42beCf6b',
      provider
    );

    const vedpx = DPXVotingEscrow__factory.connect(vedpxAddress, provider);

    const vedpxYieldDistributor = VeDPXYieldDistributor__factory.connect(
      vedpxYieldDistributorAddress,
      provider
    );

    const [vedpxTotalSupply, dpxLocked, totalVeDPXParticipating] =
      await Promise.all([
        vedpx.totalSupply(),
        dpx.balanceOf(vedpx.address),
        vedpxYieldDistributor.totalVeDPXParticipating(),
      ]);

    setData({ vedpxTotalSupply, dpxLocked, totalVeDPXParticipating });
  }, [provider]);

  useEffect(() => {
    updateData();
  }, [updateData]);

  const updateUserData = useCallback(async () => {
    if (!accountAddress) return;
    const dpx = ERC20__factory.connect(
      '0x3330BF0253f841d148F20500464D30cd42beCf6b',
      provider
    );

    const vedpx = DPXVotingEscrow__factory.connect(vedpxAddress, provider);

    const vedpxYieldDistributor = VeDPXYieldDistributor__factory.connect(
      vedpxYieldDistributorAddress,
      provider
    );

    const [vedpxBalance, locked, dpxBalance, dpxEarned, userIsInitialized] =
      await Promise.all([
        vedpx.balanceOf(accountAddress),
        vedpx.locked(accountAddress),
        dpx.balanceOf(accountAddress),
        vedpxYieldDistributor.earned(accountAddress),
        vedpxYieldDistributor.userIsInitialized(accountAddress),
      ]);

    setUserData({
      vedpxBalance,
      dpxBalance,
      dpxEarned,
      userIsInitialized,
      lockedDpxBalance: locked.amount,
      lockEnd: locked.end,
    });
  }, [accountAddress, provider]);

  useEffect(() => {
    updateUserData();
  }, [updateUserData]);

  let contextValue = { userData, data, updateData, updateUserData };

  return (
    <VeDPXContext.Provider value={contextValue}>
      {props.children}
    </VeDPXContext.Provider>
  );
};
