// import App from 'next/app'
import '../style/index.css';
import 'tailwindcss/tailwind.css';
import StylesProvider from '@mui/styles/StylesProvider';
import {
  ThemeProvider,
  Theme,
  StyledEngineProvider,
} from '@mui/material/styles';

declare module '@mui/styles/defaultTheme' {
  interface DefaultTheme extends Theme {}
}
import theme from '../style/muiTheme';
import { WalletProvider } from 'contexts/Wallet';
import { AssetsProvider } from 'contexts/Assets';
import ChangeNetworkDialog from 'components/ChangeNetworkDialog';

function MyApp({ Component, pageProps }) {
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

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default MyApp;
