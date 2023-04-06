import { useEffect } from 'react';
import { WagmiConfig } from 'wagmi';
import StylesProvider from '@mui/styles/StylesProvider';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import type { AppProps } from 'next/app';

import GlobalDialogs from 'components/common/GlobalDialogs';

import wagmiClient from 'wagmi-client';

import theme from '../style/muiTheme';

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
          <WagmiConfig client={wagmiClient}>
            <Toaster position="bottom-right" reverseOrder={true} />
            <GlobalDialogs />
            <Component {...pageProps} />
          </WagmiConfig>
        </ThemeProvider>
      </StyledEngineProvider>
    </StylesProvider>
  );
}

export default App;
