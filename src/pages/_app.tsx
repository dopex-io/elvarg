// import App from 'next/app'
import '../style/index.css';
import 'tailwindcss/tailwind.css';
import { StylesProvider, ThemeProvider } from '@mui/styles';
import { StyledEngineProvider } from '@mui/material';
import Script from 'next/script';
import { Toaster } from 'react-hot-toast';

import theme from 'style/muiTheme';

function MyApp({ Component, pageProps }) {
  <StylesProvider injectFirst>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Script src="/js/bitkeep.js"></Script>
        <Toaster position="bottom-right" reverseOrder={true} />
        <Component {...pageProps} />;{/* <AppRoutes /> */}
      </ThemeProvider>
    </StyledEngineProvider>
  </StylesProvider>;
  return;
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
