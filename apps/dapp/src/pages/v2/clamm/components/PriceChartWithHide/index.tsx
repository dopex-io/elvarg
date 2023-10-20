import React from 'react';

import ChevronUpIcon from '@heroicons/react/24/solid/ChevronUpIcon';

import PriceChart from 'components/common/PriceChart';

const PriceChartWithHide = () => {
  return (
    <div className="w-full flex flex-col ">
      <PriceChart
        className="rounded-lg text-center flex flex-col justify-center text-stieglitz"
        market={'ARB'}
      />
      <div className="w-full h-[42px] text-center text-stieglitz flex items-center justify-center space-x-2">
        <span>Hide Chart</span>
        <ChevronUpIcon className="w-6 h-6 fill-current text-stieglitz hover:text-white" />
      </div>
    </div>
  );
};

export default PriceChartWithHide;
