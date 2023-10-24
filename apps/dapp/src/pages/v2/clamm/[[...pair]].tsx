import React, { useEffect } from 'react';

import toast from 'react-hot-toast';
import { useNetwork } from 'wagmi';

import useClammStore from 'hooks/clamm/useClammStore';
import useLoadingStates from 'hooks/clamm/useLoadingStates';

import PageLayout from 'components/common/PageLayout';

import PositionsTable from './components/PositionsTable';
import PriceChartWithHide from './components/PriceChartWithHide';
import StrikesChain from './components/StrikesChain';
import OverViewStats from './components/TitleBar/OverViewStats';
import PairSelector from './components/TitleBar/PairSelector';
import getOptionsPools from './utils/varrock/getOptionsPools';

const Page = () => {
  const { initialize } = useClammStore();
  const { setLoading, isLoading } = useLoadingStates();
  const { chain } = useNetwork();

  useEffect(() => {
    setLoading('initial_pool_load', true);
    getOptionsPools(chain?.id ?? 42161, initialize, (error) => {
      toast.error(error);
    });
    setLoading('initial_pool_load', false);
  }, [initialize, setLoading, isLoading, chain]);

  return (
    <PageLayout>
      <div className="flex max-w-[1554px]  flex-col p-[12px] space-y-[12px]">
        <div className="flex space-x-[24px] items-end justify-start">
          <PairSelector />
          {/* <OverViewStats /> */}
        </div>
        <PriceChartWithHide />
        <StrikesChain />
        {/* <PositionsTable /> */}
      </div>
    </PageLayout>
  );
};

export default Page;
