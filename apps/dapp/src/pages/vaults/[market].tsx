import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { NextSeo } from 'next-seo';

import useVaultStore from 'hooks/ssov/useVaultStore';

import PageLayout from 'components/common/PageLayout';
import AsidePanel from 'components/ssov-new/AsidePanel';
import InfoBox from 'components/ssov-new/InfoBox';
import PriceChart from 'components/ssov-new/PriceChart';
import Positions from 'components/ssov-new/Tables/Positions';
import StrikesChain from 'components/ssov-new/Tables/StrikesChain';
import TitleBar from 'components/ssov-new/TitleBar';

import findDefaultSsov from 'utils/ssov/findDefaultSsov';

import seo from 'constants/seo';

const Vaults = () => {
  const router = useRouter();

  const update = useVaultStore((state) => state.update);

  const [selectedMarket, setSelectedMarket] = useState<string>('ARB');

  const handleSelectMarket = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      router.push(`/vaults/${e.target.innerText}`);
    },
    [router]
  );

  useEffect(() => {
    let market = router.query['market'] as string;

    if (!market) return;

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
  }, [router, update]);

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
          market={selectedMarket}
          handleSelectMarket={handleSelectMarket}
        />
        <div className="flex space-x-0 lg:space-x-6 flex-col sm:flex-col md:flex-col lg:flex-row space-y-3 md:space-y-0 justify-center">
          <div className="flex flex-col space-y-3 sm:w-full lg:w-3/4 h-full">
            <div className="h-[520px] rounded-lg text-center flex flex-col justify-center text-stieglitz">
              <PriceChart market={selectedMarket} />
            </div>
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

export default Vaults;
