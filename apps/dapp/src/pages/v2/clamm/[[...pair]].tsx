import React from 'react';

import PageLayout from 'components/common/PageLayout';

import PositionsTable from './components/PositionsTable';
import PriceChartWithHide from './components/PriceChartWithHide';
import StrikesChain from './components/StrikesChain';
import TitleBar from './components/TitleBar';

const Page = () => {
  return (
    <PageLayout>
      <div className="flex w-[1554px] flex-col p-[12px] space-y-[12px]">
        <TitleBar />
        <PriceChartWithHide />
        <StrikesChain />
        <PositionsTable />
      </div>
    </PageLayout>
  );
};

export default Page;
