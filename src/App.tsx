import { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ApolloProvider } from '@apollo/client';

import { client } from 'graphql/apollo';

import { WalletProvider } from 'contexts/Wallet';
import { AssetsProvider } from 'contexts/Assets';
// import { GeoLocationProvider } from 'contexts/GeoLocation';
import { FarmingProvider } from 'contexts/Farming';

import WrongNetworkModal from 'components/WrongNetworkDialog';
import PageLoader from 'components/PageLoader';

const Farming = lazy(() => import('pages/farming/farms'));
const FarmingStake = lazy(() => import('pages/farming/stake'));
const TokenSale = lazy(() => import('pages/sale'));
const Portfolio = lazy(() => import('pages/portfolio'));
const Options = lazy(() => import('pages/options'));
const Pools = lazy(() => import('pages/pools'));
const PoolsManage = lazy(() => import('pages/pools/manage'));
const PoolsVolume = lazy(() => import('pages/pools/volume'));
const TestnetFaucet = lazy(() => import('pages/testnet-faucet'));
const Swap = lazy(() => import('pages/swap'));
// const SsovTestnetFaucet = lazy(() => import('pages/ssov-faucet'));
// const Vault = lazy(() => import('pages/vault'));
// const VaultManage = lazy(() => import('pages/vault/Manage'));

function AppRoutes() {
  return (
    <BrowserRouter forceRefresh={false}>
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/" component={Options} exact />
          <Route path="/pools" component={Pools} exact />
          <Route path="/pools/manage" component={PoolsManage} exact />
          <Route path="/pools/volume" component={PoolsVolume} exact />
          <Route path="/portfolio" component={Portfolio} exact />
          <Route path="/faucet" component={TestnetFaucet} exact />
          <Route path="/swap" component={Swap} exact />
          <Route path="/sale" component={TokenSale} exact />
          <FarmingProvider>
            <Route path="/farms" component={Farming} exact />
            <Route path="/farms/stake" component={FarmingStake} exact />
            <Route path="/">
              <Redirect to="/farms" />
            </Route>
          </FarmingProvider>
          {/* <Route path="/vault" component={Vault} exact />
          <Route path="/vault/Manage" component={VaultManage} exact />
          <Route path="/faucet" component={SsovTestnetFaucet} exact /> */}
        </Switch>
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
