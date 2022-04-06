import { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ApolloProvider } from '@apollo/client';
import {
  ThemeProvider,
  Theme,
  StyledEngineProvider,
} from '@mui/material/styles';
import StylesProvider from '@mui/styles/StylesProvider';
import Error from 'next/error';
import Script from 'next/script';

import theme from './style/muiTheme';

import { otcGraphClient } from 'graphql/apollo';

import { WalletProvider } from 'contexts/Wallet';
import { AssetsProvider } from 'contexts/Assets';
import { FarmingProvider } from 'contexts/Farming';
import { OtcProvider } from 'contexts/Otc';
import { BnbConversionProvider } from 'contexts/BnbConversion';
import { NftsProvider } from 'contexts/Nfts';

// import { BUILD } from 'constants/index';

import ChangeNetworkDialog from 'components/ChangeNetworkDialog';
import PageLoader from 'components/PageLoader';

declare module '@mui/styles/defaultTheme' {
  interface DefaultTheme extends Theme {}
}

const Farming = lazy(() => import('craPages/farming/farms'));
const FarmingManage = lazy(() => import('craPages/farming/manage'));
const TokenSale = lazy(() => import('craPages/sale'));
const Ssov = lazy(() => import('craPages/ssov'));
const SsovManage = lazy(() => import('craPages/ssov/Manage'));
const OtcPortal = lazy(() => import('craPages/otc'));
const OtcChatroom = lazy(() => import('craPages/otc/chatroom'));
// const SsovPutsManage = lazy(() => import('craPages/ssov/Manage/Puts'));
const Nfts = lazy(() => import('craPages/nfts'));
const CommunityNfts = lazy(() => import('craPages/nfts/community'));
const DiamondPepesNfts = lazy(() => import('craPages/nfts/diamondpepes'));
const PledgeDiamondPepesNfts = lazy(
  () => import('craPages/nfts/diamondpepes/pledge')
);
const PledgeTwoDiamondPepesNfts = lazy(
  () => import('craPages/nfts/diamondpepes/pledge2')
);
const Oracles = lazy(() => import('craPages/oracles'));
const Tzwap = lazy(() => import('craPages/tzwap'));
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
    <BnbConversionProvider>
      <Routes>
        <Route path="*" element={<Ssov />} />
        <Route path=":type/:asset" element={<SsovManage />} />
      </Routes>
    </BnbConversionProvider>
  );
};

const OtcRoutes = () => {
  return (
    <ApolloProvider client={otcGraphClient}>
      <OtcProvider>
        <Routes>
          <Route path="*" element={<OtcPortal />} />
          <Route path="chat/:id" element={<OtcChatroom />} />
        </Routes>
      </OtcProvider>
    </ApolloProvider>
  );
};

const NftsRoutes = () => {
  return (
    <NftsProvider>
      <Routes>
        <Route path="*" element={<Nfts />} />
        <Route path="community" element={<CommunityNfts />} />
        <Route path="diamondpepes" element={<DiamondPepesNfts />} />
        <Route
          path="diamondpepes/pledge"
          element={<PledgeDiamondPepesNfts />}
        />
        <Route
          path="diamondpepes/pledge2"
          element={<PledgeTwoDiamondPepesNfts />}
        />
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
              <Route path="tzwap" element={<Tzwap />} />
              <Route path="/otc/*" element={<OtcRoutes />} />
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
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Script src="/js/bitkeep.js"></Script>
          <Toaster position="bottom-right" reverseOrder={true} />
          <AppRoutes />
        </ThemeProvider>
      </StyledEngineProvider>
    </StylesProvider>
  );
};

export default App;
