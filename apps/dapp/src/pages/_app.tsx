import StylesProvider from '@mui/styles/StylesProvider';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import type { AppProps } from 'next/app';

import ChangeNetworkDialog from 'components/common/ChangeNetworkDialog';
import theme from '../style/muiTheme';

import 'tailwindcss/tailwind.css';
import '../style/index.css';

function App({ Component, pageProps }: AppProps) {
  return (
    <StylesProvider injectFirst>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Toaster position="bottom-right" reverseOrder={true} />
          <Component {...pageProps} />
          <ChangeNetworkDialog />
        </ThemeProvider>
      </StyledEngineProvider>
    </StylesProvider>
  );
}

export default App;
