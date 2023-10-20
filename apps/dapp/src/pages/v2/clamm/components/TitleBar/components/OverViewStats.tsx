import React from 'react';

import useMarkPrice from 'pages/v2/clamm/helpers/useMarkPrice';
import useOverviewStats from 'pages/v2/clamm/helpers/useOverviewStats';

import TitleItem from 'components/ssov-beta/TitleBar/TitleItem';

const OverViewStats = () => {
  const { stats } = useOverviewStats();
  const markPrice = useMarkPrice();

  return (
    <div className="flex space-x-[24px]">
      <div className="flex flex-col">
        <h6 className="text-md font-medium text-white">
          <span className="text-stieglitz">$</span>{' '}
          <span>{markPrice.toFixed(5)}</span>
        </h6>
        <h6 className="text-md font-medium text-stieglitz">Mark Price</h6>
      </div>
      <div className="flex flex-col">
        <h6 className="text-md font-medium text-white">
          <span className="text-stieglitz">$</span>{' '}
          <span>{stats.oi.toFixed(5)}</span>
        </h6>
        <h6 className="text-md font-medium text-stieglitz">Open Interest</h6>
      </div>
      <div className="flex flex-col">
        <h6 className="text-md font-medium text-white">
          <span className="text-stieglitz">$</span>{' '}
          <span>{stats.totalVolume.toFixed(5)}</span>
        </h6>
        <h6 className="text-md font-medium text-stieglitz">Total Volume</h6>
      </div>
      <div className="flex flex-col">
        <h6 className="text-md font-medium text-white">
          <span className="text-stieglitz">$</span>{' '}
          <span>{stats.tvl.toFixed(5)}</span>
        </h6>
        <h6 className="text-md font-medium text-stieglitz">
          Total Value Locked
        </h6>
      </div>
    </div>
  );
};

export default OverViewStats;
