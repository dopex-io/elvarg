import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import Script from 'next/script';

import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';

import { QueryClientProvider } from '@tanstack/react-query';
import { DefaultSeo } from 'next-seo';
import { Toaster } from 'react-hot-toast';
import { WagmiConfig } from 'wagmi';
import wagmiConfig from 'wagmi-config';

import queryClient from 'queryClient';

import GlobalDialogs from 'components/common/GlobalDialogs';

import seo from 'constants/seo';

import theme from '../style/muiTheme';

import 'tailwindcss/tailwind.css';
import '../style/index.css';
import '../wdyr';

function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    wagmiConfig.autoConnect();
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
            <WagmiConfig config={wagmiConfig}>
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
      <script
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `let dapp_id="098695e3-58b6-41db-a716-945fb1b75bc9"; // replace with dapp_id provided by hashmail
							!function(){window.hashmail||(window.hashmail=[]),window.hashmail.queue=[];let i=["load","identify","track"],t=function(i){return function(){a=Array.prototype.slice.call(arguments),a.unshift(i),window.hashmail.queue.push(a)}};for(var e=0;i.length>e;e++)window.hashmail[i[e]]=t(i[e]);hashmail.methods=i,window.hashmail.load=function(i){window.hashmail.dapp_id=i;var e=document,s=e.getElementsByTagName("script")[0],h=e.createElement("script");h.type="text/javascript",h.async=!0,h.src="https://widget.hashmail.dev/notifier_tracking_script.js",s.parentNode.insertBefore(h,s)},window.hashmail.identify=i=>{window.hashmail.wallet_address=i,localStorage.setItem("hashmail-wallet_address",i)},window.hashmail.load(dapp_id)}();`,
        }}
      />
    </>
  );
}

export default App;
