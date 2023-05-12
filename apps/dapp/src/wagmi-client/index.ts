import { configureChains, createClient } from 'wagmi';
import { arbitrum, mainnet, polygon } from 'wagmi/chains';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { LedgerConnector } from 'wagmi/connectors/ledger';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { infuraProvider } from 'wagmi/providers/infura';

import { INFURA_PROJECT_ID, WALLETCONNECT_PROJECT_ID } from 'constants/env';

import { BitKeepConnector } from './BitKeepConnector';

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
    new BitKeepConnector({ chains }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),
  ],
});

export default wagmiClient;
