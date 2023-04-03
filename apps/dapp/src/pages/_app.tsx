import StylesProvider from '@mui/styles/StylesProvider';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';

import ChangeNetworkDialog from 'components/common/ChangeNetworkDialog';
import Share from 'components/common/Share';

import theme from '../style/muiTheme';

import queryClient from 'queryClient';

import 'tailwindcss/tailwind.css';
import '../style/index.css';

function App({ Component, pageProps }: AppProps) {
  return (
    <StylesProvider injectFirst>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <Toaster position="bottom-right" reverseOrder={true} />
            <Share />
            <Component {...pageProps} />
            <ChangeNetworkDialog />
          </QueryClientProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </StylesProvider>
  );
}

export default App;
