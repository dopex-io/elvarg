import React, { useEffect } from 'react';

import { NextSeo } from 'next-seo';
import { useNetwork } from 'wagmi';

import useClammStore from 'hooks/clamm/useClammStore';
import useTradingViewChartStore from 'hooks/tradingViewChart/useTradingViewChartStore';

import AsidePanel from 'components/clamm/AsidePanel';
import PositionsTable from 'components/clamm/PositionsTable';
import PriceChart from 'components/clamm/PriceChart';
import StrikesChain from 'components/clamm/StrikesChain';
import TitleBar from 'components/clamm/TitleBar';
import PageLayout from 'components/common/PageLayout';

import getAddresses from 'utils/clamm/varrock/getAddresses';
import getOptionsPools from 'utils/clamm/varrock/getOptionsPools';

import { DEFAULT_CHAIN_ID } from 'constants/env';
import seo from 'constants/seo';

const Page = () => {
  const { initialize, selectedOptionsPool, setAddresses } = useClammStore();
  const { setSelectedTicker } = useTradingViewChartStore();
  const { chain } = useNetwork();

  useEffect(() => {
    const chainId = chain?.id ?? DEFAULT_CHAIN_ID;
    getOptionsPools(
      chainId,
      (data) => {
        initialize(data, chainId);
      },
      (error: string) => {
        console.error(error);
      },
    );
  }, [chain, initialize]);

  useEffect(() => {
    getAddresses().then((data) => setAddresses(data));
  }, [setAddresses]);

  useEffect(() => {
    if (!selectedOptionsPool) return;
    // @ts-ignore
    setSelectedTicker(selectedOptionsPool.pairTicker);
  }, [selectedOptionsPool, setSelectedTicker]);

  return (
    <PageLayout>
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
      <div className="flex flex-col w-full p-[12px] space-y-[12px] md:pb-[50px]">
        <div className="flex flex-col md:flex-row md:items-center justify-start h-fit space-y-[24px] md:space-y-[0px] md:space-x-[24px]">
          <TitleBar />
        </div>
        <div className="w-full flex flex-col xl:flex-row xl:space-x-[12px] xl:space-y-[0px] space-y-[12px]">
          <div className="max-w-[1530px] sm:min-w-[590px] h-fit sm:w-full w-[96vw] space-y-[12px]">
            {/* <PriceChart /> */}
            <StrikesChain />
            {/* <PositionsTable /> */}
          </div>
          <div className="xl:max-w-[366px] relative sm:w-full w-[96vw]">
            {/* <AsidePanel /> */}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Page;
