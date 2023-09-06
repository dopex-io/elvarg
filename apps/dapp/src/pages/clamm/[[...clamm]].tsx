import { useCallback, useEffect, useMemo } from 'react';

import { NextSeo } from 'next-seo';
import { useAccount } from 'wagmi';

import { useBoundStore } from 'store';

import AsidePanel from 'components/clamm/AsidePanel';
import InfoBox from 'components/clamm/InfoBox';
import Positions from 'components/clamm/Tables/Positions';
import StrikesChain from 'components/clamm/Tables/StrikesChain';
import { TitleBar } from 'components/clamm/TitleBar';
import AppBar from 'components/common/AppBar';
import PageLayout from 'components/common/PageLayout';
import PriceChart from 'components/common/PriceChart';

import seo from 'constants/seo';

const ClammPage = () => {
  const { provider, updateClammData, updateUserAddress } = useBoundStore();
  const { address: userAddress } = useAccount();

  const updateAll = useCallback(async () => {
    if (!provider) return;
    updateClammData();
  }, [provider, updateClammData]);

  useEffect(() => {
    updateAll();
    updateUserAddress(userAddress);
  }, [updateAll, updateUserAddress, userAddress]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     updateAll();
  //   }, 60000);
  //   return () => clearInterval(interval);
  // }, [updateAll]);

  return (
    <div className="overflow-x-hidden bg-black h-screen">
      <NextSeo
        title={`${seo.clamm.title}`}
        description={seo.clamm.description}
        canonical={seo.clamm.url}
        openGraph={{
          url: seo.clamm.url,
          title: seo.clamm.title,
          description: seo.clamm.description,
          images: [
            {
              url: seo.clamm.banner,
              width: seo.default.width,
              height: seo.default.height,
              alt: seo.clamm.alt,
              type: 'image/png',
            },
          ],
        }}
      />
      <AppBar />
      <PageLayout>
        <TitleBar />
        <div className="flex space-x-0 lg:space-x-6 flex-col sm:flex-col md:flex-col lg:flex-row space-y-3 md:space-y-0 justify-center">
          <div className="flex flex-col space-y-3 sm:w-full lg:w-3/4 h-full">
            {/* <PriceChartRangeSelectorWrapper /> */}
            <PriceChart market="ARB" />
            <div className="space-y-4">
              <StrikesChain />
              <Positions />
            </div>
          </div>
          <div className="flex flex-col w-full lg:w-1/3 h-full space-y-4 sticky top-20">
            <AsidePanel />
            <InfoBox />
          </div>
        </div>
      </PageLayout>
    </div>
  );
};

export default ClammPage;
