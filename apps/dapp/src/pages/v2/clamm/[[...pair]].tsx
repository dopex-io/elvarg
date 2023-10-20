import React from 'react';

import PageLayout from 'components/common/PageLayout';

import PriceChartWithHide from './components/PriceChartWithHide';
import TitleBar from './components/TitleBar';

const Page = () => {
  return (
    <PageLayout>
      <div className="flex w-[1554px] flex-col">
        <TitleBar />
        <PriceChartWithHide />
      </div>
    </PageLayout>
  );
};

export default Page;
