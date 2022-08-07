import create from 'zustand';
import Router from 'next/router';
import { ethers, Signer } from 'ethers';
import { providers } from '@0xsequence/multicall';
import { Addresses } from '@dopex-io/sdk';
import Web3Modal, { ProviderController } from 'web3modal';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import WalletConnectProvider from '@walletconnect/web3-provider';

import { CHAIN_ID_TO_RPC } from 'constants/index';
import { DEFAULT_CHAIN_ID } from 'constants/env';

interface WalletState {
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
}

const PAGE_TO_SUPPORTED_CHAIN_IDS: {
  [key: string]: { default: number; all: number[] };
} = {
  '/': { default: 42161, all: [1, 42161, 43114, 56] },
  '/governance/vedpx': { default: 42161, all: [42161] },
  '/farms': { default: 42161, all: [1, 42161] },
  '/ssov': { default: 42161, all: [42161, 56, 43114, 1088] },
  '/ssov/call/BNB': { default: 56, all: [56] },
  '/ssov/call/AVAX': { default: 43114, all: [43114] },
  '/nfts/community': { default: 42161, all: [] },
  '/nfts/diamondpepes2': { default: 42161, all: [1, 42161] },
  '/sale': { default: 1, all: [1] },
  '/oracles': { default: 42161, all: [] },
  '/tzwap': { default: 42161, all: [1, 42161] },
  '/ssov-v3/Metis-MONTHLY-CALLS-SSOV-V3': { default: 1088, all: [1088] },
  '/vaults/ir/pool/MIM3CRV-1': { default: 42161, all: [42161] },
  '/vaults/ir/pool/MIM3CRV-2': { default: 42161, all: [42161] },
  '/vaults/ir/pool/PUSD3CRV': { default: 42161, all: [42161] },
  '/vaults/ir': { default: 42161, all: [42161] },
};

let web3Modal: Web3Modal | undefined;

if (typeof window !== 'undefined') {
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: CHAIN_ID_TO_RPC,
      },
    },
    walletlink: {
      package: CoinbaseWalletSDK,
      options: {
        appName: 'Dopex',
        rpc: CHAIN_ID_TO_RPC,
      },
    },
    ...((window as any).clover && {
      injected: {
        display: {
          logo: '/wallets/Clover.png',
          name: 'Clover Wallet',
          description: 'Connect to your Clover Wallet',
        },
        package: null,
      },
    }),
    ...(window.ethereum?.isCoin98 && {
      injected: {
        display: {
          logo: '/wallets/Coin98.png',
          name: 'Coin98',
          description: 'Connect to your Coin98 Wallet',
        },
        package: null,
      },
    }),
    ...(window.ethereum?.isBitKeep && {
      injected: {
        display: {
          logo: '/wallets/Bitkeep.png',
          name: 'Bitkeep',
          description: 'Connect to your Bitkeep Wallet',
        },
        package: null,
      },
    }),
  };

  web3Modal = new Web3Modal({
    cacheProvider: true,
    theme: 'dark',
    providerOptions,
  });
}

export const useWalletStore = create<WalletState>()((set, get) => ({
  wrongNetwork: false,
  connect: () => {
    web3Modal
      ?.connect()
      .then(async (provider: ProviderController) => {
        provider.on('accountsChanged', async () => {
          await get().updateState({ provider, isUser: true });
        });

        provider.on('chainChanged', async () => {
          await get().updateState({ provider, isUser: true });
        });
        await get().updateState({ provider, isUser: true });
      })
      .catch(() => {
        if (window.location.pathname !== '/ssov') window.location.replace('/');
      });
  },
  disconnect: () =>
    set((prevState: WalletState) => {
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
    if (!web3Modal) return;
    web3Modal.clearCachedProvider();
    web3Modal
      .connect()
      .then(async (provider) => {
        await get().updateState({ provider, isUser: true });
      })
      .catch(async () => {
        await get().updateState({
          provider: new ethers.providers.StaticJsonRpcProvider(
            CHAIN_ID_TO_RPC[get().chainId]
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
    set((prevState: WalletState) => ({
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
}));
