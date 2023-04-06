import { useEffect } from 'react';
import { WagmiConfig } from 'wagmi';
import StylesProvider from '@mui/styles/StylesProvider';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';

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
  );
}

export default App;
