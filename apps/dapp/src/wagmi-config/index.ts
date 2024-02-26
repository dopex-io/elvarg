import { configureChains, createConfig } from 'wagmi';
import { arbitrum, mainnet, polygon } from 'wagmi/chains';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';

import { CHAINS } from 'constants/chains';
import { DRPC_API_KEY, WALLETCONNECT_PROJECT_ID } from 'constants/env';

import { OkxConnector } from './OkxConnector';
import { RabbyConnector } from './RabbyConnector';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [arbitrum, polygon, mainnet],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: `https://lb.drpc.org/ogrpc?network=${CHAINS[
          chain.id
        ].name.toLowerCase()}&dkey=${DRPC_API_KEY}`,
      }),
    }),
    publicProvider(),
  ],
);

const wagmiConfig = createConfig({
  autoConnect: false,
  publicClient,
  webSocketPublicClient,
  connectors: [
    new MetaMaskConnector({ chains }),
    new RabbyConnector({ chains }),
    new OkxConnector({ chains }),
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
    new InjectedConnector({
      chains,
      options: {
        name: 'Other Browser Wallets',
        shimDisconnect: true,
      },
    }),
  ],
});

export default wagmiConfig;
