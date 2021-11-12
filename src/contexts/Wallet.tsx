import {
  createContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from 'react';
import Web3Modal from 'web3modal';
import { ethers, Signer } from 'ethers';
import { providers } from '@0xsequence/multicall';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { Addresses } from '@dopex-io/sdk';

import { INFURA_PROJECT_ID } from 'constants/index';
import { useLocation } from 'react-router';

interface WalletContextInterface {
  accountAddress?: string;
  contractAddresses?: { [key: string]: any };
  provider?: ethers.providers.Provider;
  signer?: Signer;
  wrongNetwork?: boolean;
  connect?: Function;
  disconnect?: Function;
  changeWallet?: Function;
  chainId?: number;
  blockTime?: number;
  epochInitTime?: number;
  supportedChainIds?: number[];
}

export const WalletContext = createContext<WalletContextInterface>({});

const CHAIN_ID_TO_PROVIDERS = {
  '1': `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
  '42': `https://kovan.infura.io/v3/${INFURA_PROJECT_ID}`,
  '421611': `https://arbitrum-rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
  '42161': `https://arbitrum-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
  '1337': 'http://127.0.0.1:8545',
};

const PAGE_TO_SUPPORTED_CHAIN_IDS = {
  '/': [1, 42161],
  '/farms': [1, 42161],
  '/farms/stake': [1, 42161],
  '/ssov': [42161],
  '/ssov/manage/dpx': [42161],
  '/ssov/manage/rdpx': [42161],
  '/sale': [1],
};

const DEFAULT_CHAIN_ID =
  Number(process.env.REACT_APP_DEFAULT_CHAIN_ID) ?? 421611;

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: CHAIN_ID_TO_PROVIDERS,
    },
  },
};

export const WalletProvider = (props) => {
  const location = useLocation();

  console.log(Addresses[DEFAULT_CHAIN_ID]);

  const [state, setState] = useState<WalletContextInterface>({
    accountAddress: '',
    wrongNetwork: false,
    chainId: DEFAULT_CHAIN_ID,
    contractAddresses: Addresses[DEFAULT_CHAIN_ID],
    // ethers provider
    provider: new providers.MulticallProvider(
      ethers.getDefaultProvider(CHAIN_ID_TO_PROVIDERS[DEFAULT_CHAIN_ID]),
      {
        ...(DEFAULT_CHAIN_ID === 1337 && {
          contract: require('addresses/core.json').MultiCallUtils,
        }),
      }
    ),
    supportedChainIds: [],
  });
  const [blockTime, setBlockTime] = useState(0);

  const web3Modal = useMemo(
    () =>
      new Web3Modal({
        cacheProvider: true,
        theme: 'dark',
        providerOptions,
      }),
    []
  );

  useEffect(() => {
    if (!state.provider) return;
    (async function () {
      setBlockTime(Number((await state.provider.getBlock('latest')).timestamp));
    })();
  }, [state.provider]);

  const updateState = useCallback(
    async ({
      web3Provider,
      ethersProvider,
      isUser,
    }: {
      web3Provider: any;
      ethersProvider?: ethers.providers.Provider;
      isUser: boolean;
    }) => {
      const provider =
        !isUser && ethersProvider
          ? ethersProvider
          : new ethers.providers.Web3Provider(web3Provider, 'any');
      const { chainId } = await provider.getNetwork();

      if (!PAGE_TO_SUPPORTED_CHAIN_IDS[location.pathname].includes(chainId)) {
        setState((prevState) => ({
          ...prevState,
          wrongNetwork: true,
          supportedChainIds: PAGE_TO_SUPPORTED_CHAIN_IDS[location.pathname],
        }));
        return;
      }

      const multicallProvider = new providers.MulticallProvider(provider, {
        ...(DEFAULT_CHAIN_ID === 1337 && {
          contract: require('addresses/core.json').MultiCallUtils,
        }),
      });
      let signer: Signer | undefined;
      let address: string | undefined;

      if (isUser) {
        const web3Provider = provider as ethers.providers.Web3Provider;
        signer = await web3Provider.getUncheckedSigner();
        address = await signer.getAddress();
      }

      let contractAddresses: any;

      if (chainId === 1337) {
        contractAddresses = {
          ...require('addresses/core.json'),
          ...require('addresses/farming.json'),
          ...require('addresses/tokensale.json'),
        };
      } else {
        contractAddresses = Addresses[chainId];
      }

      setState((prevState) => ({
        ...prevState,
        wrongNetwork: false,
        provider: multicallProvider,
        chainId,
        contractAddresses,
        ...(isUser && {
          signer,
          accountAddress: address,
        }),
      }));
    },
    [location.pathname]
  );

  const connect = useCallback(() => {
    web3Modal.connect().then(async (provider) => {
      provider.on('accountsChanged', async () => {
        await updateState({ web3Provider: provider, isUser: true });
      });

      provider.on('chainChanged', async () => {
        await updateState({ web3Provider: provider, isUser: true });
      });
      await updateState({ web3Provider: provider, isUser: true });
    });
  }, [web3Modal, updateState]);

  const disconnect = useCallback(() => {
    web3Modal.clearCachedProvider();
    setState((prevState) => ({
      ...prevState,
      isUser: false,
      accountAddress: '',
      provider: new providers.MulticallProvider(
        ethers.getDefaultProvider(CHAIN_ID_TO_PROVIDERS[DEFAULT_CHAIN_ID])
      ),
    }));
  }, [web3Modal]);

  const changeWallet = useCallback(() => {
    web3Modal.clearCachedProvider();
    web3Modal
      .connect()
      .then(async (provider) => {
        await updateState({ web3Provider: provider, isUser: true });
      })
      .catch(async () => {
        await updateState({
          web3Provider: CHAIN_ID_TO_PROVIDERS[state.chainId],
          ethersProvider: ethers.getDefaultProvider(
            CHAIN_ID_TO_PROVIDERS[state.chainId]
          ),
          isUser: false,
        });
      });
  }, [web3Modal, updateState, state.chainId]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connect();
    }
  }, [connect, web3Modal.cachedProvider]);

  const contextValue = {
    connect,
    disconnect,
    changeWallet,
    blockTime,
    ...state,
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {props.children}
    </WalletContext.Provider>
  );
};
