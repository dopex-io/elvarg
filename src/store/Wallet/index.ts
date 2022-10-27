import { StateCreator } from 'zustand';
import Router from 'next/router';
import { ethers, Signer } from 'ethers';
import { providers } from '@0xsequence/multicall';
import { Addresses } from '@dopex-io/sdk';
import { ProviderController } from 'web3modal';

import { AssetsSlice } from 'store/Assets';
import { getWeb3Modal } from 'store/Wallet/getWeb3Modal';

import { CHAIN_ID_TO_RPC, PAGE_TO_SUPPORTED_CHAIN_IDS } from 'constants/index';
// import { DEFAULT_CHAIN_ID } from 'constants/env';
import { FarmingSlice } from 'store/Farming';

const DEFAULT_CHAIN_ID: number = 5;

export interface WalletSlice {
  updateState: Function;
  accountAddress?: string;
  ensName?: string;
  ensAvatar?: string;
  contractAddresses: { [key: string]: any };
  provider: ethers.providers.Provider;
  signer?: Signer;
  wrongNetwork: boolean;
  connect: Function;
  disconnect: Function;
  changeWallet: Function;
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
  connect: () => {
    const { updateState } = get();
    const web3Modal = getWeb3Modal();

    web3Modal
      ?.connect()
      .then(async (provider: ProviderController) => {
        provider.on('accountsChanged', async () => {
          await updateState({ provider, isUser: true });
        });

        provider.on('chainChanged', async () => {
          await updateState({ provider, isUser: true });
        });
        await updateState({ provider, isUser: true });
      })
      .catch((errorMsg) => {
        console.log(errorMsg);
      });
  },
  disconnect: () =>
    set((prevState: WalletSlice) => {
      const web3Modal = getWeb3Modal();
      if (!web3Modal) return prevState;
      web3Modal.clearCachedProvider();
      return {
        ...prevState,
        accountAddress: '',
        provider: new providers.MulticallProvider(
          new ethers.providers.StaticJsonRpcProvider(
            CHAIN_ID_TO_RPC[DEFAULT_CHAIN_ID]
          )
        ),
      };
    }),
  changeWallet: () => {
    const { updateState, chainId } = get();
    const web3Modal = getWeb3Modal();

    if (!web3Modal) return;
    web3Modal.clearCachedProvider();
    web3Modal
      .connect()
      .then(async (provider: any) => {
        await updateState({ provider, isUser: true });
      })
      .catch(async () => {
        await updateState({
          provider: new ethers.providers.StaticJsonRpcProvider(
            CHAIN_ID_TO_RPC[chainId]
          ),
          isUser: false,
        });
      });
  },
  updateState: async ({
    isUser,
    provider,
  }: {
    isUser: string;
    provider: ethers.providers.Provider | ProviderController;
  }) => {
    const _provider: any = isUser
      ? new ethers.providers.Web3Provider(provider as any, 'any')
      : (provider as ethers.providers.Provider);
    const { chainId } = await _provider.getNetwork();

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
      new ethers.providers.StaticJsonRpcProvider(CHAIN_ID_TO_RPC[chainId])
    );
    let signer: Signer | undefined;
    let address: string | undefined;

    if (isUser) {
      signer = await _provider.getUncheckedSigner();
      address = await signer?.getAddress();
    }

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
      ...(isUser && {
        signer,
        accountAddress: address,
      }),
    }));
  },
  setChangeNetwork: (networkStatus: 'user' | 'wrong-network' | 'close') =>
    set((prevState: WalletSlice) => ({
      ...prevState,
      changeNetwork: networkStatus,
    })),
  chainId: DEFAULT_CHAIN_ID,
  supportedChainIds: [DEFAULT_CHAIN_ID],
  contractAddresses: Addresses[Number(DEFAULT_CHAIN_ID)],
  provider: new providers.MulticallProvider(
    new ethers.providers.StaticJsonRpcProvider(
      CHAIN_ID_TO_RPC[DEFAULT_CHAIN_ID]
    )
  ),
});
