import Router from 'next/router';

import { Signer, ethers } from 'ethers';

import { providers } from '@0xsequence/multicall';
import { Addresses } from '@dopex-io/sdk';
import { StateCreator } from 'zustand';

import { AssetsSlice } from 'store/Assets';
import { FarmingSlice } from 'store/Farming';

import { CHAINS, PAGE_TO_SUPPORTED_CHAIN_IDS } from 'constants/chains';
import { DEFAULT_CHAIN_ID } from 'constants/env';

export interface WalletSlice {
  updateState: Function;
  accountAddress?: string;
  ensName?: string;
  ensAvatar?: string;
  contractAddresses: { [key: string]: any };
  getContractAddress: Function;
  provider: ethers.providers.Provider;
  signer?: Signer;
  wrongNetwork: boolean;
  chainId: number;
  blockTime?: number;
  epochInitTime?: number;
  supportedChainIds: number[];
  changeNetwork?: 'user' | 'wrong-network' | 'close';
  setChangeNetwork: Function;
  userCompliant: boolean;
  setUserCompliant: Function;
  openComplianceDialog: boolean;
  setOpenComplianceDialog: Function;
}

export const createWalletSlice: StateCreator<
  WalletSlice & AssetsSlice & FarmingSlice,
  [['zustand/devtools', never]],
  [],
  WalletSlice
> = (set, get) => ({
  userCompliant: false,
  setUserCompliant: async (setAs: boolean) => {
    set((prev) => ({
      ...prev,
      userCompliant: setAs,
    }));
  },
  openComplianceDialog: false,
  setOpenComplianceDialog: (setAs: boolean) => {
    set((prev) => ({ ...prev, openComplianceDialog: setAs }));
  },
  wrongNetwork: false,
  updateState: async ({
    signer,
    chainId,
    accountAddress,
  }: {
    signer?: Signer;
    chainId: number;
    accountAddress?: string;
  }) => {
    let router = Router;

    if (
      PAGE_TO_SUPPORTED_CHAIN_IDS[router.asPath] &&
      !PAGE_TO_SUPPORTED_CHAIN_IDS[router.asPath]?.all.includes(chainId) &&
      PAGE_TO_SUPPORTED_CHAIN_IDS[router.asPath]?.all.length !== 0
    ) {
      set((prevState: any) => ({
        ...prevState,
        wrongNetwork: true,
        supportedChainIds: PAGE_TO_SUPPORTED_CHAIN_IDS[router.asPath]?.all ?? [
          DEFAULT_CHAIN_ID,
        ],
      }));
      return;
    } else if (
      !PAGE_TO_SUPPORTED_CHAIN_IDS[router.asPath] &&
      chainId !== DEFAULT_CHAIN_ID
    ) {
      set((prevState: any) => ({
        ...prevState,
        wrongNetwork: true,
        supportedChainIds: [DEFAULT_CHAIN_ID],
      }));
      return;
    }

    const multicallProvider = new providers.MulticallProvider(
      new ethers.providers.StaticJsonRpcProvider(CHAINS[chainId]?.rpc)
    );

    let contractAddresses: any;

    contractAddresses = Addresses[chainId];

    set((prevState: any) => ({
      ...prevState,
      wrongNetwork: false,
      provider: multicallProvider,
      chainId,
      contractAddresses,
      supportedChainIds: PAGE_TO_SUPPORTED_CHAIN_IDS[router.asPath]?.all ?? [
        DEFAULT_CHAIN_ID,
      ],
      signer,
      accountAddress: accountAddress,
    }));
  },
  setChangeNetwork: (networkStatus: 'user' | 'wrong-network' | 'close') => {
    set((prevState: WalletSlice) => ({
      ...prevState,
      changeNetwork: networkStatus,
    }));
  },
  chainId: DEFAULT_CHAIN_ID,
  supportedChainIds: [DEFAULT_CHAIN_ID],
  contractAddresses: Addresses[Number(DEFAULT_CHAIN_ID)],
  provider: new providers.MulticallProvider(
    new ethers.providers.StaticJsonRpcProvider(CHAINS[DEFAULT_CHAIN_ID]?.rpc)
  ),
  getContractAddress: (key: string) => {
    const { contractAddresses } = get();
    if (key.toUpperCase() === 'WSTETH') return contractAddresses['STETH'];
    if (key.toUpperCase() === 'STMATIC') return contractAddresses['STMATIC'];
    return contractAddresses[key.toUpperCase()];
  },
});
