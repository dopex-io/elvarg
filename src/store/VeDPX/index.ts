import { StateCreator } from 'zustand';
import {
  ERC20__factory,
  VeDPXYieldDistributor__factory,
  DPXVotingEscrow__factory,
} from '@dopex-io/sdk';
import { BigNumber } from 'ethers';

import { WalletSlice } from 'store/Wallet';

export const vedpxAddress = '0x80789D252A288E93b01D82373d767D71a75D9F16';

export const vedpxYieldDistributorAddress =
  '0xCBBFB7e0E6782DF0d3e91F8D785A5Bf9E8d9775F';

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

export interface VeDPXSlice {
  vedpxData: vedpxData;
  userVedpxData: userVedpxData;
  updateVedpxData: Function;
  updateUserVedpxData: Function;
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

export const createVedpxSlice: StateCreator<
  VeDPXSlice & WalletSlice,
  [['zustand/devtools', never]],
  [],
  VeDPXSlice
> = (set, get) => ({
  vedpxData: initialData,
  userVedpxData: initialUserData,
  updateVedpxData: async () => {
    const { provider } = get();

    if (!provider) return;
    const dpx = ERC20__factory.connect(
      '0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55',
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

    set((prevState) => ({
      ...prevState,
      vedpxData: {
        ...prevState.vedpxData,
        vedpxTotalSupply,
        dpxLocked,
        totalVeDPXParticipating,
      },
    }));
  },
  updateUserVedpxData: async () => {
    const { accountAddress, provider } = get();

    if (!accountAddress) return;
    const dpx = ERC20__factory.connect(
      '0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55',
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

    set((prevState) => ({
      ...prevState,
      userVedpxData: {
        ...prevState.userVedpxData,
        vedpxBalance,
        dpxBalance,
        dpxEarned,
        userIsInitialized,
        lockedDpxBalance: locked.amount,
        lockEnd: locked.end,
      },
    }));
  },
});
