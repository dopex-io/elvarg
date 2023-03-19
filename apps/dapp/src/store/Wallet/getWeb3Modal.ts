import Web3Modal from 'web3modal';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import WalletConnectProvider from '@walletconnect/web3-provider';

import { CHAIN_PUBLIC_RPCS } from 'constants/chains';

export const getWeb3Modal = () => {
  let web3Modal: Web3Modal | undefined;

  if (typeof window !== 'undefined') {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          rpc: CHAIN_PUBLIC_RPCS,
        },
      },
      walletlink: {
        package: CoinbaseWalletSDK,
        options: {
          appName: 'Dopex',
          rpc: CHAIN_PUBLIC_RPCS,
        },
      },
      bitkeep: {
        package: true,
        display: {
          name: 'BitKeep Wallet',
          description: 'Connect to your BitKeep Wallet',
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
    };

    web3Modal = new Web3Modal({
      cacheProvider: true,
      theme: 'dark',
      providerOptions,
    });
  }
  return web3Modal;
};
