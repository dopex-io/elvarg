import React, { useEffect, useState } from 'react';

import ChevronDownIcon from '@heroicons/react/24/solid/ChevronDownIcon';
import ChevronUpIcon from '@heroicons/react/24/solid/ChevronUpIcon';

import PriceChart from 'components/common/PriceChart';

// @TODO: Put in constants
const HIDE_CHART_LOCAL_STORAGE_KEY = 'hide_clamm_chart';

const PriceChartWithHide = () => {
  const [hideChart, setHideChart] = useState(false);

  useEffect(() => {
    // get saved from local storage
    setHideChart(Boolean(localStorage.getItem(HIDE_CHART_LOCAL_STORAGE_KEY)));
  }, []);

  const handleToggle = () => {
    setHideChart((prev) => {
      // Save in local storage
      localStorage.setItem(HIDE_CHART_LOCAL_STORAGE_KEY, String(prev ? 1 : 0));
      return !prev;
    });
  };

  return (
    <div className="w-full flex flex-col m-[12px]">
      {!hideChart && (
        <PriceChart
          className="rounded-lg text-center flex flex-col justify-center text-stieglitz"
          market={'ARB'}
        />
      )}
      <div
        role="button"
        onClick={handleToggle}
        className="w-full h-[42px] text-center text-stieglitz flex items-center justify-center space-x-2 bg-umbra rounded-b-md border-t-2 border-t-carbon py-[12px]"
      >
        <span className="text-[14px]">
          {!hideChart ? 'Hide Chart' : 'Show Chart'}
        </span>
        {!hideChart ? (
          <ChevronUpIcon className="w-[18px] h-w-[18px] fill-current text-stieglitz hover:text-white" />
        ) : (
          <ChevronDownIcon className="w-[18px] h-w-[18px] fill-current text-stieglitz hover:text-white" />
        )}
      </div>
    </div>
  );
};

export default PriceChartWithHide;
