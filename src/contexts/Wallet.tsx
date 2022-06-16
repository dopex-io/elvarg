import {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { useRouter } from 'next/router';
import { ethers, Signer } from 'ethers';
import { providers } from '@0xsequence/multicall';
import { Addresses } from '@dopex-io/sdk';
import Web3Modal, { ProviderController } from 'web3modal';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import WalletConnectProvider from '@walletconnect/web3-provider';

import { CHAIN_ID_TO_RPC } from 'constants/index';
import { DEFAULT_CHAIN_ID } from 'constants/env';

interface WalletContextInterface {
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
  setChangeNetwork: Function;
  chainId: number;
  blockTime?: number;
  epochInitTime?: number;
  supportedChainIds: number[];
  changeNetwork?: 'user' | 'wrong-network' | 'close';
}

const defaultContext = {
  wrongNetwork: false,
  connect: () => {},
  disconnect: () => {},
  changeWallet: () => {},
  setChangeNetwork: () => {},
  chainId: DEFAULT_CHAIN_ID,
  supportedChainIds: [DEFAULT_CHAIN_ID],
  contractAddresses: Addresses[Number(DEFAULT_CHAIN_ID)],
  provider: new providers.MulticallProvider(
    new ethers.providers.StaticJsonRpcProvider(
      CHAIN_ID_TO_RPC[DEFAULT_CHAIN_ID]
    )
  ),
};

export const WalletContext =
  createContext<WalletContextInterface>(defaultContext);

const PAGE_TO_SUPPORTED_CHAIN_IDS: {
  [key: string]: { default: number; all: number[] };
} = {
  '/': { default: 42161, all: [1, 42161, 43114, 56] },
  '/farms': { default: 42161, all: [1, 42161] },
  '/farms/manage': { default: 42161, all: [1, 42161] },
  '/ssov': { default: 42161, all: [42161, 56, 43114, 1088] },
  '/ssov/call/BNB': { default: 56, all: [56] },
  '/ssov/call/AVAX': { default: 43114, all: [43114] },
  '/nfts/community': { default: 42161, all: [] },
  '/nfts/diamondpepes2': { default: 42161, all: [1, 42161] },
  '/sale': { default: 1, all: [1] },
  '/oracles': { default: 42161, all: [] },
  '/tzwap': { default: 42161, all: [1, 42161] },
  '/atlantics': { default: 421611, all: [1337, 42161, 421611] },
  '/atlantics/manage/WETH-PUTS-WEEKLY': {
    default: 421611,
    all: [1337, 42161, 421611],
  },
  '/atlantics/manage/WETH-CALLS-WEEKLY': {
    default: 421611,
    all: [1337, 42161, 421611],
  },
  '/ssov-v3/Metis-MONTHLY-CALLS-SSOV-V3': { default: 1088, all: [1088] },
  '/vaults/ir/MIM3CRV': { default: 42161, all: [42161] },
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

export const WalletProvider = (props: { children: ReactNode }) => {
  const router = useRouter();
  const [state, setState] = useState<any>({
    accountAddress: '',
    wrongNetwork: false,
    chainId: DEFAULT_CHAIN_ID,
    contractAddresses: Addresses[DEFAULT_CHAIN_ID],
    provider: null,
    supportedChainIds: [DEFAULT_CHAIN_ID],
  });

  const [ens, setEns] = useState<{
    ensName: string;
    ensAvatar: string;
  }>({ ensName: '', ensAvatar: '' });
  const [blockTime, setBlockTime] = useState(0);
  const [changeNetwork, setChangeNetwork] = useState<
    'user' | 'wrong-network' | 'close'
  >('close');

  useEffect(() => {
    if (!state.provider) return;
    (async function () {
      setBlockTime(Number((await state.provider.getBlock('latest')).timestamp));
    })();
  }, [state.provider]);

  const updateState = useCallback(
    async ({
      provider,
      isUser,
    }: {
      provider: ethers.providers.Provider | ProviderController;
      isUser?: boolean;
    }) => {
      const _provider: any = isUser
        ? new ethers.providers.Web3Provider(provider as any, 'any')
        : (provider as ethers.providers.Provider);
      const { chainId } = await _provider.getNetwork();

      if (
        PAGE_TO_SUPPORTED_CHAIN_IDS[router.asPath] &&
        !PAGE_TO_SUPPORTED_CHAIN_IDS[router.asPath]?.all.includes(chainId) &&
        PAGE_TO_SUPPORTED_CHAIN_IDS[router.asPath]?.all.length !== 0
      ) {
        console.log(
          PAGE_TO_SUPPORTED_CHAIN_IDS[router.asPath],
          !PAGE_TO_SUPPORTED_CHAIN_IDS[router.asPath]?.all.includes(chainId),
          PAGE_TO_SUPPORTED_CHAIN_IDS[router.asPath]?.all.length
        );
        setState((prevState: any) => ({
          ...prevState,
          wrongNetwork: true,
          supportedChainIds: PAGE_TO_SUPPORTED_CHAIN_IDS[router.asPath]
            ?.all ?? [DEFAULT_CHAIN_ID],
        }));
        return;
      } else if (
        !PAGE_TO_SUPPORTED_CHAIN_IDS[router.asPath] &&
        chainId !== DEFAULT_CHAIN_ID
      ) {
        console.log(
          router.asPath,
          PAGE_TO_SUPPORTED_CHAIN_IDS[router.asPath],
          DEFAULT_CHAIN_ID,
          chainId
        );
        setState((prevState: any) => ({
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

      setState((prevState: any) => ({
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
    [router.asPath]
  );

  const connect = useCallback(() => {
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
      .catch(() => {
        if (window.location.pathname !== '/ssov') window.location.replace('/');
      });
  }, [updateState]);

  const disconnect = useCallback(() => {
    if (!web3Modal) return;
    web3Modal.clearCachedProvider();
    setState((prevState: any) => ({
      ...prevState,
      isUser: false,
      accountAddress: '',
      provider: new providers.MulticallProvider(
        new ethers.providers.StaticJsonRpcProvider(
          CHAIN_ID_TO_RPC[DEFAULT_CHAIN_ID]
        )
      ),
    }));
  }, []);

  const changeWallet = useCallback(() => {
    if (!web3Modal) return;
    web3Modal.clearCachedProvider();
    web3Modal
      .connect()
      .then(async (provider) => {
        await updateState({ provider, isUser: true });
      })
      .catch(async () => {
        await updateState({
          provider: new ethers.providers.StaticJsonRpcProvider(
            CHAIN_ID_TO_RPC[state.chainId]
          ),
          isUser: false,
        });
      });
  }, [updateState, state.chainId]);

  useEffect(() => {
    if (web3Modal?.cachedProvider) {
      connect();
    } else {
      updateState({
        provider: new ethers.providers.StaticJsonRpcProvider(
          CHAIN_ID_TO_RPC[
            PAGE_TO_SUPPORTED_CHAIN_IDS[router.asPath]?.default ||
              DEFAULT_CHAIN_ID
          ]
        ),
      });
    }
  }, [connect, updateState, router]);

  useEffect(() => {
    (async () => {
      if (state.accountAddress) {
        const mainnetProvider = new ethers.providers.StaticJsonRpcProvider(
          'https://eth-mainnet.gateway.pokt.network/v1/lb/61ceae3bb86d760039e05c85'
        );
        const ensData = { ensName: '', ensAvatar: '' };
        try {
          ensData.ensName =
            (await mainnetProvider.lookupAddress(state.accountAddress)) ?? '';
          if (ensData.ensName !== '') {
            ensData.ensAvatar =
              (await mainnetProvider.getAvatar(ensData.ensName)) ?? '';
          }
        } catch {}
        setEns(ensData);
      }
    })();
  }, [state.accountAddress]);

  const contextValue = {
    connect,
    disconnect,
    changeWallet,
    blockTime,
    changeNetwork,
    setChangeNetwork,
    ...ens,
    ...state,
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {props.children}
    </WalletContext.Provider>
  );
};
