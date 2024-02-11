import React from 'react';

import MarkPrice from './MarkPrice';
import OpenInterest from './OpenInterest';
import Premiums24h from './Premiums24h';
import RewardsApr from './RewardsApr';
import TotalLiquidity from './TotalLiquidity';
import Volume24h from './Volume24h';

const Stats = () => {
  return (
    <div className="flex items-center space-x-[20px] w-[800px]">
      <MarkPrice />
      <OpenInterest />
      <Volume24h />
      <Premiums24h />
      <RewardsApr />
      <TotalLiquidity />
    </div>
  );
};

export default Stats;
