import StylesProvider from '@mui/styles/StylesProvider';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';

import { WalletProvider } from 'contexts/Wallet';
import { AssetsProvider } from 'contexts/Assets';

import ChangeNetworkDialog from 'components/common/ChangeNetworkDialog';
import theme from '../style/muiTheme';

import 'tailwindcss/tailwind.css';
import '../style/index.css';

// @ts-ignore TODO: FIX
function App({ Component, pageProps }) {
  return (
    <StylesProvider injectFirst>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <WalletProvider>
            <AssetsProvider>
              <Component {...pageProps} />
              <ChangeNetworkDialog />
            </AssetsProvider>
          </WalletProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </StylesProvider>
  );
}

export default App;
