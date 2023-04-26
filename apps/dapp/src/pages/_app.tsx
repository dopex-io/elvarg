import { useEffect } from 'react';
import { WagmiConfig } from 'wagmi';
import StylesProvider from '@mui/styles/StylesProvider';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import { NextSeo } from 'next-seo';

import GlobalDialogs from 'components/common/GlobalDialogs';

import wagmiClient from 'wagmi-client';

import theme from '../style/muiTheme';

import queryClient from 'queryClient';

import 'tailwindcss/tailwind.css';
import '../style/index.css';

function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    wagmiClient.autoConnect();
  }, []);

  return (
    <>
      <NextSeo
        title="SSOV | Dopex"
        description="Dopex Single Staking Option Vaults"
        canonical="https://app.dopex.io/ssov"
        openGraph={{
          url: 'https://app.dopex.io/ssov',
          title: 'SSOV | Dopex',
          description: 'Dopex Single Staking Option Vaults',
          images: [
            {
              url: '/previews/ssov.png',
              width: 800,
              height: 600,
              alt: 'SSOV',
              type: 'image/png',
            },
          ],
        }}
        twitter={{
          handle: '@handle',
          site: '@site',
          cardType: 'summary_large_image',
        }}
      />
      <StylesProvider injectFirst>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
              <WagmiConfig client={wagmiClient}>
                <Toaster position="bottom-right" reverseOrder={true} />
                <GlobalDialogs />
                <Component {...pageProps} />
              </WagmiConfig>
            </QueryClientProvider>
          </ThemeProvider>
        </StyledEngineProvider>
      </StylesProvider>
    </>
  );
}

export default App;
