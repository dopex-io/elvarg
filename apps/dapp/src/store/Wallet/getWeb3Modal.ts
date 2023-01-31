import Web3Modal from 'web3modal';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import WalletConnectProvider from '@walletconnect/web3-provider';

import { CHAIN_ID_TO_RPC } from 'constants/index';

export const getWeb3Modal = () => {
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
  return web3Modal;
};
