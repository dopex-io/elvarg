'use client';

import * as React from 'react';

import {
  connectorsForWallets,
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
  argentWallet,
  ledgerWallet,
  trustWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { QueryClientProvider } from '@tanstack/react-query';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { arbitrum, mainnet, polygon } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

import queryClient from 'queryClient';

import { WALLETCONNECT_PROJECT_ID } from 'constants/env';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, polygon, arbitrum],
  [publicProvider()],
);

const projectId = WALLETCONNECT_PROJECT_ID || '';

const { wallets } = getDefaultWallets({
  appName: 'RainbowKit demo',
  projectId,
  chains,
});

const dopexAppInfo = {
  appName: 'Dopex dApp',
};

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: 'Other',
    wallets: [
      argentWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
      ledgerWallet({ projectId, chains }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider
          chains={chains}
          appInfo={dopexAppInfo}
          theme={darkTheme()}
        >
          {mounted && children}
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}
