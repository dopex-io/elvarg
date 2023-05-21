import { useEffect /*, useState */ } from 'react';

// import dynamic from 'next/dynamic';
import Head from 'next/head';

// import Script from 'next/script';

// import {
//   ChartingLibraryWidgetOptions,
//   ResolutionString,
// } from 'public/static/charting_library/charting_library';
import { useBoundStore } from 'store';

import { DurationType } from 'store/Vault/vault';

import AppBar from 'components/common/AppBar';
import AsidePanel from 'components/vaults/AsidePanel';
import StrikesChain from 'components/vaults/Tables/StrikesChain';
import TitleBar from 'components/vaults/TitleBar';

// todo replace
// const defaultWidgetProps: Partial<ChartingLibraryWidgetOptions> = {
//   symbol: 'AMZN',
//   interval: '1D' as ResolutionString,
//   library_path: '/static/charting_library/',
//   locale: 'en',
//   charts_storage_url: 'https://saveload.tradingview.com',
//   charts_storage_api_version: '1.1',
//   client_id: 'tradingview.com',
//   user_id: 'public_user_id',
//   fullscreen: false,
//   autosize: true,
// };

// const TVChartContainer = dynamic(
//   () => import('components/common/TVContainer').then((mod) => mod.default),
//   { ssr: false }
// );

const Vaults = () => {
  const {
    provider,
    updateSelectedVaultData,
    updateVaultsBatch,
    vaultsBatch,
    updateFromBatch,
  } = useBoundStore();

  useEffect(() => {
    const cache: {
      state: {
        filter: {
          isPut: {
            isPut: boolean;
          };
          base: string;
          durationType: DurationType;
        };
      };
    } = JSON.parse(localStorage.getItem('app.dopex.io/vaults/cache') || '');
    if (vaultsBatch.length !== 0 || !cache.state.filter) return;

    updateVaultsBatch(cache.state.filter.base);
  }, [
    updateSelectedVaultData,
    provider,
    updateVaultsBatch,
    vaultsBatch.length,
  ]);

  return (
    <div className="bg-black bg-contain min-h-screen">
      <Head>
        <title>Vaults | Dopex</title>
      </Head>
      <AppBar active="Vaults" />
      <div className="py-8 w-full px-[10vw] mx-auto">
        <div className="flex mt-20 space-x-0 lg:space-x-8 flex-col sm:flex-col md:flex-col lg:flex-row">
          <div className="flex flex-col space-y-8 w-full sm:w-full lg:w-3/4 h-full">
            <div>
              <TitleBar />
            </div>
            <div className="w-full space-y-4 flex flex-col">
              {/* <Script
                src="/static/datafeeds/udf/dist/bundle.js"
                strategy="lazyOnload"
                onReady={() => {
                  setIsScriptReady(true);
                }}
              />
              {isScriptReady && (
                <TVChartContainer
                  {...defaultWidgetProps}
                  className="rounded-xl h-[35vh]"
                />
              )} */}
            </div>
            <div className="w-full space-y-4">
              <StrikesChain />
              <div>Bottom Table</div>
            </div>
          </div>
          <div className="flex flex-col w-full sm:w-full lg:w-1/4 h-full mt-4 lg:mt-0">
            <AsidePanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vaults;
