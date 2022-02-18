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
import { NftsProvider } from 'contexts/Nfts';

// import { BUILD } from 'constants/index';

import ChangeNetworkDialog from 'components/ChangeNetworkDialog';
import PageLoader from 'components/PageLoader';

const Farming = lazy(() => import('craPages/farming/farms'));
const FarmingManage = lazy(() => import('craPages/farming/manage'));
const TokenSale = lazy(() => import('craPages/sale'));
const Ssov = lazy(() => import('craPages/ssov'));
const SsovManage = lazy(() => import('craPages/ssov/Manage'));
// const SsovPutsManage = lazy(() => import('craPages/ssov/Manage/Puts'));
const Nfts = lazy(() => import('craPages/nfts'));
const CommunityNfts = lazy(() => import('craPages/nfts/community'));
const DiamondPepesNfts = lazy(() => import('craPages/nfts/diamondpepes'));
const Oracles = lazy(() => import('craPages/oracles'));
// const Portfolio = lazy(() => import('pages/portfolio'));
// const Options = lazy(() => import('pages/options'));
// const Pools = lazy(() => import('pages/pools'));
// const PoolsMargin = lazy(() => import('craPages/pools/margin'));
// const PoolsManage = lazy(() => import('pages/pools/manage'));
// const PoolsVolume = lazy(() => import('pages/pools/volume'));
// const TestnetFaucet = lazy(() => import('pages/testnet-faucet'));
// const Swap = lazy(() => import('pages/swap'));

const FarmRoutes = () => {
  return (
    <FarmingProvider>
      <Routes>
        <Route path="*" element={<Farming />} />
        <Route path="manage" element={<FarmingManage />} />
      </Routes>
    </FarmingProvider>
  );
};

const SsovRoutes = () => {
  return (
    <SsovProvider>
      <Routes>
        <Route path="*" element={<Ssov />} />
        <Route path=":type/:asset" element={<SsovManage />} />
      </Routes>
    </SsovProvider>
  );
};

const NftsRoutes = () => {
  return (
    <NftsProvider>
      <Routes>
        <Route path="*" element={<Nfts />} />
        <Route path="community" element={<CommunityNfts />} />
        <Route path="diamondpepes" element={<DiamondPepesNfts />} />
      </Routes>
    </NftsProvider>
  );
};
function AppRoutes() {
  // if (BUILD === 'testnet') {
  //   return (
  //     <BrowserRouter forceRefresh={false}>
  //       <Suspense fallback={<PageLoader />}>
  //         <Route path="/" element={<Options />} />
  //         <Route path="/pools" element={<Pools />} />
  //         <Route path="/pools/manage" element={<PoolsManage />} />
  //         <Route path="/pools/volume" element={<PoolsVolume />} />
  //         <Route path="/pools/margin" element={<PoolsMargin />} />
  //         <Route path="/portfolio" element={<Portfolio />} />
  //         <Route path="/faucet" element={<TestnetFaucet />} />
  //         <Route path="/swap" element={<Swap />} />
  //         <Route path="ssov/*" element={<SsovRoutes />} />
  //         <Route path="*" element={<Error statusCode={404} />} />
  //       </Suspense>
  //     </BrowserRouter>
  //   );
  // }
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
              <Route path="nfts/*" element={<NftsRoutes />} />
              <Route path="oracles" element={<Oracles />} />
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
