import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import Script from 'next/script';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { QueryClientProvider } from '@tanstack/react-query';
import { DefaultSeo } from 'next-seo';
import queryClient from 'queryClient';
import { Toaster } from 'react-hot-toast';
import { WagmiConfig } from 'wagmi';
import wagmiClient from 'wagmi-client';

import GlobalDialogs from 'components/common/GlobalDialogs';

import seo from 'constants/seo';

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
        title={seo.default.title}
        description={seo.default.description}
        canonical={seo.default.url}
        openGraph={{
          url: seo.default.url,
          title: seo.default.title,
          description: seo.default.description,
          images: [
            {
              url: seo.default.banner,
              width: seo.default.width,
              height: seo.default.height,
              alt: seo.default.alt,
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
