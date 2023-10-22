import React, { useEffect, useState } from 'react';

import ChevronDownIcon from '@heroicons/react/24/solid/ChevronDownIcon';
import ChevronUpIcon from '@heroicons/react/24/solid/ChevronUpIcon';

import TVChart from 'components/common/TVChart';

// @TODO: Put in constants
const HIDE_CHART_LOCAL_STORAGE_KEY = 'hide_clamm_chart';

const PriceChartWithHide = () => {
  const [hideChart, setHideChart] = useState(false);

  useEffect(() => {
    const storedChoice = localStorage.getItem(HIDE_CHART_LOCAL_STORAGE_KEY);
    if (storedChoice) {
      setHideChart(Boolean(Number(storedChoice)));
    }
  }, []);

  const handleToggle = () => {
    setHideChart((prev) => {
      // Save in local storage
      localStorage.setItem(HIDE_CHART_LOCAL_STORAGE_KEY, String(prev ? 0 : 1));
      return !prev;
    });
  };

  return (
    <div className="w-full flex flex-col">
      {!hideChart && <TVChart />}
      <div
        role="button"
        onClick={handleToggle}
        className="w-full h-[42px] text-center text-stieglitz flex items-center justify-center space-x-2 bg-cod-gray rounded-b-md border-t-2 border-t-carbon py-[12px]"
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
