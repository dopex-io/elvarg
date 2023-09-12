import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { NextSeo } from 'next-seo';
import optionAmmInfo from 'public/locales/en/optionAmm.json';

import useVaultStore from 'hooks/option-amm/useVaultStore';

import InfoBox from 'components/common/InfoBox';
import PageLayout from 'components/common/PageLayout';
import PriceChart from 'components/common/PriceChart';
import AsidePanel from 'components/option-amm/AsidePanel';
import PortfolioInfo from 'components/option-amm/PortfolioData';
import Positions from 'components/option-amm/Tables/Positions';
import StrikesChain from 'components/option-amm/Tables/StrikesChain';
import TitleBar from 'components/option-amm/TitleBar';

import findVault from 'utils/optionAmm/findVault';

import { vaultZeroState } from 'constants/optionAmm/markets';
import seo from 'constants/seo';

const DEFAULT_MARKET = 'ARB-USDC';

const OptionsAmm = () => {
  const router = useRouter();

  const update = useVaultStore((store) => store.update);

  const [selectedMarket, setSelectedMarket] = useState<string>(DEFAULT_MARKET);

  const handleSelectMarket = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      router.push(`/v2/option-amm/${e.target.innerText}`);
      setSelectedMarket(e.target.innerText);
    },
    [router],
  );

  useEffect(() => {
    const _vault = findVault(selectedMarket);
    if (!_vault) {
      update({ ...vaultZeroState });
    } else
      update({
        symbol: selectedMarket,
        address: _vault.address,
        duration: 'DAILY',
        underlyingSymbol: _vault.underlyingSymbol,
        underlyingTokenAddress: _vault.underlyingTokenAddress,
        isPut: false,
        lp: _vault.lp,
        collateralTokenAddress: _vault.collateralTokenAddress,
        collateralSymbol: _vault.collateralSymbol,
        portfolioManager: _vault.portfolioManager,
        positionMinter: _vault.positionMinter,
      });
  }, [selectedMarket, update]);

  return (
    <>
      <NextSeo
        title={seo.optionsAmm.title}
        description={seo.optionsAmm.description}
        canonical={seo.optionsAmm.url}
        openGraph={{
          url: seo.optionsAmm.url,
          title: seo.optionsAmm.title,
          description: seo.optionsAmm.description,
          images: [
            {
              url: seo.optionsAmm.banner,
              width: seo.default.width,
              height: seo.default.height,
              alt: seo.optionsAmm.alt,
              type: 'image/png',
            },
          ],
        }}
      />
      <PageLayout>
        <div className="flex md:justify-between flex-wrap my-3 space-y-3 lg:space-y-0">
          <TitleBar
            market={selectedMarket}
            handleSelectMarket={handleSelectMarket}
          />
          <PortfolioInfo />
        </div>
        <div className="flex space-x-0 lg:space-x-3 flex-col sm:flex-col md:flex-col lg:flex-row space-y-3 lg:space-y-0 justify-center">
          <div className="flex flex-col space-y-3 sm:w-full lg:w-3/4 h-full">
            <div className="w-full rounded-lg text-center flex flex-col justify-center text-stieglitz">
              <PriceChart market={selectedMarket.split('-')[0]} />
            </div>
            <div className="space-y-3">
              <StrikesChain market={selectedMarket} />
              <Positions />
            </div>
          </div>
          <div className="flex flex-col w-full lg:w-1/4 h-full space-y-3 sticky top-20">
            <AsidePanel market={selectedMarket} />
            <InfoBox
              title={optionAmmInfo.infoBox.header}
              url={optionAmmInfo.infoBox.url}
              buttonLabel={optionAmmInfo.infoBox.buttonLabel}
              contentBody={optionAmmInfo.infoBox.description}
            />
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export default OptionsAmm;
