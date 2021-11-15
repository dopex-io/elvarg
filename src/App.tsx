import { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider, StylesProvider } from '@material-ui/core/styles';
import Error from 'next/error';

import theme from './style/muiTheme';

import { client } from 'graphql/apollo';

import { WalletProvider } from 'contexts/Wallet';
import { AssetsProvider } from 'contexts/Assets';
import { FarmingProvider } from 'contexts/Farming';
import { SsovProvider } from 'contexts/Ssov';

import { BUILD } from 'constants/index';

import ChangeNetworkDialog from 'components/ChangeNetworkDialog';
import PageLoader from 'components/PageLoader';

const Farming = lazy(() => import('craPages/farming/farms'));
const FarmingStake = lazy(() => import('craPages/farming/stake'));
const TokenSale = lazy(() => import('craPages/sale'));
const Ssov = lazy(() => import('craPages/ssov'));
const SsovManage = lazy(() => import('craPages/ssov/Manage'));
const Portfolio = lazy(() => import('craPages/portfolio'));
const Options = lazy(() => import('craPages/options'));
const Pools = lazy(() => import('craPages/pools'));
const PoolsManage = lazy(() => import('craPages/pools/manage'));
const PoolsVolume = lazy(() => import('craPages/pools/volume'));
const PoolsMargin = lazy(() => import('craPages/pools/margin'));
const TestnetFaucet = lazy(() => import('craPages/testnet-faucet'));
const Swap = lazy(() => import('craPages/swap'));

const FarmRoutes = () => {
  return (
    <FarmingProvider>
      <Routes>
        <Route path="*" element={<Farming />} />
        <Route path="stake" element={<FarmingStake />} />
      </Routes>
    </FarmingProvider>
  );
};

const SsovRoutes = () => {
  return (
    <SsovProvider>
      <Routes>
        <Route path="*" element={<Ssov />} />
        <Route path="manage/:asset" element={<SsovManage />} />
      </Routes>
    </SsovProvider>
  );
};

function AppRoutes() {
  if (BUILD === 'testnet') {
    return (
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <WalletProvider>
            <AssetsProvider>
              <Routes>
                <Route path="/" element={<Options />} />
                <Route path="/pools" element={<Pools />} />
                <Route path="/pools/manage" element={<PoolsManage />} />
                <Route path="/pools/volume" element={<PoolsVolume />} />
                <Route path="/pools/margin" element={<PoolsMargin />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/faucet" element={<TestnetFaucet />} />
                <Route path="/swap" element={<Swap />} />
                <Route path="ssov/*" element={<SsovRoutes />} />
                <Route path="*" element={<Error statusCode={404} />} />
              </Routes>
            </AssetsProvider>
          </WalletProvider>
        </Suspense>
      </BrowserRouter>
    );
  }
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <WalletProvider>
          <AssetsProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/ssov" />} />
              <Route path="sale" element={<TokenSale />} />
              <Route path="ssov/*" element={<SsovRoutes />} />
              <Route path="farms/*" element={<FarmRoutes />} />
              <Route path="*" element={<Error statusCode={404} />} />
            </Routes>
            <ChangeNetworkDialog />
          </AssetsProvider>
        </WalletProvider>
      </Suspense>
    </BrowserRouter>
  );
}

const App = () => {
  return (
    <StylesProvider injectFirst>
      <ThemeProvider theme={theme}>
        <ApolloProvider client={client}>
          <Toaster position="bottom-right" reverseOrder={true} />
          <AppRoutes />
        </ApolloProvider>
      </ThemeProvider>
    </StylesProvider>
  );
};

export default App;
