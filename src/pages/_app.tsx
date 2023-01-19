import { useEffect, useState } from 'react';
import StylesProvider from '@mui/styles/StylesProvider';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import axios from 'axios';
import type { AppProps } from 'next/app';

import { BLOCKED_COUNTRIES_ALPHA_2_CODES } from 'constants/index';

import ChangeNetworkDialog from 'components/common/ChangeNetworkDialog';
import theme from '../style/muiTheme';

import 'tailwindcss/tailwind.css';
import '../style/index.css';

function App({ Component, pageProps }: AppProps) {
  const [state, setState] = useState({ isOfac: false });

  useEffect(() => {
    async function checkLocation() {
      try {
        const { data } = await axios.get(
          'https://www.cloudflare.com/cdn-cgi/trace'
        );
        const countryAlpha2Code = data.split('loc=')[1].substring(0, 2);
        if (BLOCKED_COUNTRIES_ALPHA_2_CODES.includes(countryAlpha2Code)) {
          setState({ isOfac: true });
        } else {
          setState({ isOfac: true });
        }
      } catch {
        setState({ isOfac: false });
      }
    }

    console.log(navigator.geolocation);

    checkLocation();
  }, []);

  console.log(state);

  if (state.isOfac) {
    return (
      <div>
        You are connected from a restricted country due to regulations and are
        not permitted to use the platform.
      </div>
    );
  }

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
