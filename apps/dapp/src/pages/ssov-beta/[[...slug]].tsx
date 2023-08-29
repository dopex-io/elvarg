import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { NextSeo } from 'next-seo';

import useVaultStore from 'hooks/ssov/useVaultStore';

import PageLayout from 'components/common/PageLayout';
import PriceChart from 'components/common/PriceChart';
import AsidePanel from 'components/ssov-beta/AsidePanel';
import InfoBox from 'components/ssov-beta/InfoBox';
import Positions from 'components/ssov-beta/Tables/Positions';
import StrikesChain from 'components/ssov-beta/Tables/StrikesChain';
import TitleBar from 'components/ssov-beta/TitleBar';

import findDefaultSsov from 'utils/ssov/findDefaultSsov';

import seo from 'constants/seo';

const DEFAULT_MARKET = 'ARB';

const SsovBetaMarket = () => {
  const router = useRouter();

  const update = useVaultStore((state) => state.update);

  const [selectedMarket, setSelectedMarket] = useState<string>(DEFAULT_MARKET);

  const handleSelectMarket = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      router.push(`/ssov-beta/${e.target.innerText}`);
    },
    [router],
  );

  useEffect(() => {
    let market = router.query?.slug?.[0];

    if (!market) {
      router.replace(router.asPath, `/ssov-beta/${DEFAULT_MARKET}`);
    } else {
      market = market.toUpperCase();

      setSelectedMarket(market);

      const vault = findDefaultSsov(market);

      if (vault) {
        update({
          address: vault.address,
          isPut: vault.isPut,
          underlyingSymbol: vault.underlyingSymbol,
          duration: vault.duration,
          collateralTokenAddress: vault.collateralTokenAddress,
        });
      }
    }
  }, [router, update]);

  return (
    <>
      <NextSeo
        title={seo.ssovBeta.title}
        description={seo.ssovBeta.description}
        canonical={seo.ssovBeta.url}
        openGraph={{
          url: seo.ssovBeta.url,
          title: seo.ssovBeta.title,
          description: seo.ssovBeta.description,
          images: [
            {
              url: seo.ssovBeta.banner,
              width: seo.default.width,
              height: seo.default.height,
              alt: seo.ssovBeta.alt,
              type: 'image/png',
            },
          ],
        }}
      />
      <PageLayout>
        <TitleBar
          market={selectedMarket}
          handleSelectMarket={handleSelectMarket}
        />
        <div className="flex space-x-0 lg:space-x-6 flex-col sm:flex-col md:flex-col lg:flex-row space-y-3 md:space-y-0 justify-center">
          <div className="flex flex-col space-y-3 sm:w-full lg:w-3/4 h-full">
            <PriceChart
              className="rounded-lg text-center flex flex-col justify-center text-stieglitz"
              market={selectedMarket}
            />
            <div className="space-y-4">
              <StrikesChain market={selectedMarket} />
              <Positions />
            </div>
          </div>
          <div className="flex flex-col w-full lg:w-1/4 h-full space-y-4 sticky top-20">
            <AsidePanel market={selectedMarket} />
            <InfoBox />
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export default SsovBetaMarket;
