import { useEffect } from 'react';

import type { AppProps } from 'next/app';
import Script from 'next/script';

import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import StylesProvider from '@mui/styles/StylesProvider';
import { QueryClientProvider } from '@tanstack/react-query';
import { DefaultSeo } from 'next-seo';
import queryClient from 'queryClient';
import { Toaster } from 'react-hot-toast';
import { WagmiConfig } from 'wagmi';
import wagmiClient from 'wagmi-client';

import GlobalDialogs from 'components/common/GlobalDialogs';

import { HOST_URL } from 'constants/env';

import theme from '../style/muiTheme';

import 'tailwindcss/tailwind.css';
import '../style/index.css';

function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    wagmiClient.autoConnect();
  }, []);

  return (
    <>
      <DefaultSeo
        title="Dopex"
        description="Dopex is a maximum liquidity and minimal exposure options protocol"
        canonical={HOST_URL || 'https://app.dopex.io'}
        openGraph={{
          url: HOST_URL || 'https://app.dopex.io',
          title: 'Dopex',
          description:
            'Dopex is a maximum liquidity and minimal exposure options protocol',
          images: [
            {
              url: 'https://res.cloudinary.com/dxitdndu3/image/upload/v1682556687/dopex_images/preview_images/default_kayszw.png',
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
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-QLYLX4HN05"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-QLYLX4HN05');
        `}
      </Script>
    </>
  );
}

export default App;
