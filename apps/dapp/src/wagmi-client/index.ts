import { createClient, configureChains } from 'wagmi';

import { mainnet, arbitrum, polygon } from 'wagmi/chains';

import { infuraProvider } from 'wagmi/providers/infura';

import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { LedgerConnector } from 'wagmi/connectors/ledger';
import { InjectedConnector } from 'wagmi/connectors/injected';

import { INFURA_PROJECT_ID, WALLETCONNECT_PROJECT_ID } from 'constants/env';

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, arbitrum, polygon],
  [infuraProvider({ apiKey: INFURA_PROJECT_ID || '' })]
);

const wagmiClient = createClient({
  autoConnect: false,
  provider,
  webSocketProvider,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'wagmi',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: WALLETCONNECT_PROJECT_ID || '',
      },
    }),
    new LedgerConnector({ chains }),
    new InjectedConnector({
      chains,
      options: {
        name: 'BitKeep',
        getProvider: () => {
          if (typeof window !== 'undefined') {
            const provider =
              (window as any).bitkeep && (window as any).bitkeep.ethereum;
            if (!provider) {
              return window.open('https://bitkeep.com/en/download?type=2');
            }
            return provider;
          } else {
            return;
          }
        },
      },
    }),
  ],
});

export default wagmiClient;
