import { useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import Script from 'next/script';

import useVaultState, { Vault } from 'hooks/vaults/state';
import { NextSeo } from 'next-seo';
import {
  ChartingLibraryWidgetOptions,
  ResolutionString,
} from 'public/static/charting_library/charting_library';

import PageLayout from 'components/common/PageLayout';
import AsidePanel from 'components/vaults/AsidePanel';
import Positions from 'components/vaults/Tables/Positions';
import StrikesChain from 'components/vaults/Tables/StrikesChain';
import TitleBar from 'components/vaults/TitleBar';

import seo from 'constants/seo';
import { defaultChartProps } from 'constants/tradingview';

const defaultWidgetProps: Partial<ChartingLibraryWidgetOptions> = {
  theme: defaultChartProps.theme,
  symbol: defaultChartProps.symbol,
  locale: defaultChartProps.locale,
  client_id: 'tradingview.com',
  library_path: defaultChartProps.library_path,
  charts_storage_api_version: defaultChartProps.charts_storage_api_version,
  user_id: defaultChartProps.user_id,
  overrides: {
    'paneProperties.backgroundGradientStartColor': '#020024',
    'paneProperties.backgroundGradientEndColor': '#4f485e',
  },
  charts_storage_url: defaultChartProps.charts_storage_url,
  custom_css_url: defaultChartProps.custom_css_url,
  enabled_features: defaultChartProps.enabled_features,
  disabled_features: defaultChartProps.disabled_features,
  fullscreen: false,
  autosize: true,
  // loading_screen: defaultChartProps.loading_screen,
  interval: '4H' as ResolutionString,
};

const TVChartContainer = dynamic(
  () => import('components/common/TVContainer').then((mod) => mod.default),
  { ssr: false }
);

const Vaults = () => {
  const update = useVaultState((vault) => vault.update);
  const vault = useVaultState((vault) => vault.vault);
  const [selectedToken, setSelectedToken] = useState<string>('ETH');
  const [isScriptReady, setIsScriptReady] = useState(false);
  const [widget, _] =
    useState<Partial<ChartingLibraryWidgetOptions>>(defaultWidgetProps);

  const handleSelectToken = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedToken(e.target.innerText);
      update({
        ...vault,
        base: e.target.innerText,
      } as Vault);
    },
    [update, vault]
  );

  return (
    <>
      <NextSeo
        title={seo.vaults.title}
        description={seo.vaults.description}
        canonical={seo.vaults.url}
        openGraph={{
          url: seo.vaults.url,
          title: seo.vaults.title,
          description: seo.vaults.description,
          images: [
            {
              url: seo.vaults.banner,
              width: seo.default.width,
              height: seo.default.height,
              alt: seo.vaults.alt,
              type: 'image/png',
            },
          ],
        }}
      />
      <PageLayout>
        <TitleBar
          selectedToken={selectedToken}
          handleSelectToken={handleSelectToken}
        />
        <div className="flex space-x-0 lg:space-x-6 flex-col sm:flex-col md:flex-col lg:flex-row space-y-3 md:space-y-0 justify-center">
          <div className="flex flex-col space-y-3 sm:w-full lg:w-3/4 h-full">
            <div className="space-y-4 flex flex-col">
              <div className="h-[420px] bg-carbon rounded-lg text-center flex flex-col justify-center text-stieglitz">
                {
                  <Script
                    src="/static/datafeeds/udf/dist/bundle.js"
                    strategy="lazyOnload"
                    onReady={() => {
                      setIsScriptReady(true);
                    }}
                  />
                }
                {isScriptReady && <TVChartContainer {...widget} />}
              </div>
            </div>
            <div className="space-y-4">
              <StrikesChain selectedToken={selectedToken} />
              <Positions />
            </div>
          </div>
          <div className="flex flex-col w-full lg:w-1/4 h-full">
            <AsidePanel />
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export default Vaults;
