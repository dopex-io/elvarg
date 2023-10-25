import React, { useEffect } from 'react';

import { Button } from '@dopex-io/ui';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useNetwork } from 'wagmi';

import useClammStore from 'hooks/clamm/useClammStore';
import useLoadingStates from 'hooks/clamm/useLoadingStates';
import useWindowSize from 'hooks/useWindowSize';

import PageLayout from 'components/common/PageLayout';

import AsidePanel from './components/AsidePanel';
import LearningResources from './components/LearningResources';
import PositionsTable from './components/PositionsTable';
import PriceChartWithHide from './components/PriceChartWithHide';
import StrikesChain from './components/StrikesChain';
import OverViewStats from './components/TitleBar/OverViewStats';
import PairSelector from './components/TitleBar/PairSelector';
import { VARROACK_BASE_API_URL } from './constants';

const MAX_AFK_LIMIT = 60000;

const Page = () => {
  const { initialize } = useClammStore();
  const { chain } = useNetwork();

  const { data, refetch, dataUpdatedAt } = useQuery({
    queryKey: ['clamm-pools-' + chain?.id],
    initialData: [],
    staleTime: 0,
    queryFn: () => {
      const queryUrl = new URL(`${VARROACK_BASE_API_URL}/clamm/pools`);
      queryUrl.searchParams.set('chainId', chain?.id.toString() ?? '42161');
      return fetch(queryUrl).then((res) => res.json());
    },
  });

  useEffect(() => {
    if (data.error) {
      toast.error('Failed to load pools from API.');
      return;
    }
    initialize(data);
  }, [data, initialize]);

  // useEffect(() => {
  //   window.addEventListener('visibilitychange', () => {
  //     if (dataUpdatedAt + MAX_AFK_LIMIT < new Date().getTime()) {
  //       refetch();
  //     }
  //   });
  //   return () => window.removeEventListener('visibilitychange', () => {});
  // });

  return (
    <PageLayout>
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
        <div className="xl:w-[366px] w-[90vw] xl:block xl:sticky xl:top-[15rem] 2xl:top-[11rem] hidden">
          <AsidePanel />
        </div>
      </div>
    </PageLayout>
  );
};

export default Page;
