import React, { useEffect } from 'react';

import { Button } from '@dopex-io/ui';
import { NextSeo } from 'next-seo';
import toast from 'react-hot-toast';
import { useNetwork } from 'wagmi';

import useClammStore from 'hooks/clamm/useClammStore';
import useTradingViewChartStore from 'hooks/tradingViewChart/useTradingViewChartStore';

import AsidePanel from 'components/clamm/AsidePanel';
import PositionsTable from 'components/clamm/PositionsTable';
import PriceChartWithHide from 'components/clamm/PriceChartWithHide';
import StrikesChain from 'components/clamm/StrikesChain';
import OverViewStats from 'components/clamm/TitleBar/OverViewStats';
import PairSelector from 'components/clamm/TitleBar/PairSelector';
import PageLayout from 'components/common/PageLayout';

import getOptionsPools from 'utils/clamm/varrock/getOptionsPools';

import { DEFAULT_CHAIN_ID } from 'constants/env';
import seo from 'constants/seo';

const Page = () => {
  const { initialize, selectedOptionsPool } = useClammStore();
  const { setSelectedTicker } = useTradingViewChartStore();
  const { chain } = useNetwork();

  useEffect(() => {
    getOptionsPools(
      chain?.id ?? DEFAULT_CHAIN_ID,
      initialize,
      (error: string) => {
        toast.error(error);
      },
    );
  }, [chain?.id, initialize]);

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
      <div className="flex flex-col xl:flex-row w-full xl:items-start items-center justify-center 2xl:space-x-[12px] xl:space-x-[12px] space-y-[12px] 2xl:space-y-[0px] lg:mb-4">
        <div
          className={`flex flex-col 2xl:w-[1314px] xl:w-[900px] w-[90vw] space-y-[12px] h-full`}
        >
          <div className="flex flex-col md:flex-row w-full md:items-end h-full space-y-[24px] md:space-y-[0px] md:space-x-[24px]">
            <PairSelector />
            <OverViewStats />
          </div>
          <PriceChartWithHide />
          <StrikesChain />
          <PositionsTable />
        </div>
        {/* convert to dialog */}
        <div className="xl:hidden sticky bottom-0 w-full z-10 bg-cod-gray flex px-[24px] justify-around space-x-4 py-5 rounded-lg">
          <Button className="flex-1">Trade</Button>
          <Button className="flex-1">Liquidity Provision</Button>
        </div>
        {/*  */}
        <div className="xl:w-[366px] w-[90vw] xl:block xl:sticky xl:top-[10rem] 2xl:top-[11rem] hidden">
          <AsidePanel />
        </div>
      </div>
    </PageLayout>
  );
};

export default Page;
