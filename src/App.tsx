import { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ApolloProvider } from '@apollo/client';

import { client } from 'graphql/apollo';

import { WalletProvider } from 'contexts/Wallet';
import { AssetsProvider } from 'contexts/Assets';
import { FarmingProvider } from 'contexts/Farming';
import { SsovProvider } from 'contexts/Ssov';
// import { GeoLocationProvider } from 'contexts/GeoLocation';

// import { BUILD } from 'constants/index';

import WrongNetworkModal from 'components/WrongNetworkDialog';
import PageLoader from 'components/PageLoader';

const Farming = lazy(() => import('pages/farming/farms'));
const FarmingStake = lazy(() => import('pages/farming/stake'));
const TokenSale = lazy(() => import('pages/sale'));
const Ssov = lazy(() => import('pages/ssov'));
const SsovManage = lazy(() => import('pages/ssov/Manage'));
// const Portfolio = lazy(() => import('pages/portfolio'));
// const Options = lazy(() => import('pages/options'));
// const Pools = lazy(() => import('pages/pools'));
// const PoolsManage = lazy(() => import('pages/pools/manage'));
// const PoolsVolume = lazy(() => import('pages/pools/volume'));
// const TestnetFaucet = lazy(() => import('pages/testnet-faucet'));
// const Swap = lazy(() => import('pages/swap'));

function AppRoutes() {
  // if (BUILD === 'testnet') {
  //   return (
  //     <BrowserRouter forceRefresh={false}>
  //       <Suspense fallback={<PageLoader />}>
  //         <Switch>
  //           <Route path="/" component={Options} exact />
  //           <Route path="/pools" component={Pools} exact />
  //           <Route path="/pools/manage" component={PoolsManage} exact />
  //           <Route path="/pools/volume" component={PoolsVolume} exact />
  //           <Route path="/portfolio" component={Portfolio} exact />
  //           <Route path="/faucet" component={TestnetFaucet} exact />
  //           <Route path="/swap" component={Swap} exact />
  //           <SsovProvider>
  //             <Route path="/ssov" component={Ssov} exact />
  //             <Route path="/ssov/manage" component={SsovManage} exact />
  //           </SsovProvider>
  //         </Switch>
  //       </Suspense>
  //     </BrowserRouter>
  //   );
  // }
  return (
    <BrowserRouter forceRefresh={false}>
      <Suspense fallback={<PageLoader />}>
        <FarmingProvider>
          <SsovProvider>
            <Switch>
              <Route path="/" exact>
                <Redirect to="/ssov" />
              </Route>
              <Route path="/sale" component={TokenSale} exact />
              <Route path="/ssov" component={Ssov} exact />
              <Route path="/ssov/manage/:asset" component={SsovManage} exact />
              <Route path="/farms" component={Farming} exact />
              <Route path="/farms/stake" component={FarmingStake} exact />
            </Switch>
          </SsovProvider>
        </FarmingProvider>
      </Suspense>
    </BrowserRouter>
  );
}

const App = () => {
  return (
    <ApolloProvider client={client}>
      <WalletProvider>
        {/* <GeoLocationProvider> */}
        <AssetsProvider>
          <Toaster position="bottom-right" reverseOrder={true} />
          <WrongNetworkModal />
          <AppRoutes />
        </AssetsProvider>
        {/* </GeoLocationProvider> */}
      </WalletProvider>
    </ApolloProvider>
  );
};

export default App;
