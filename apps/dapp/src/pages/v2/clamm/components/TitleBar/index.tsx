import React from 'react';

import OverViewStats from './components/OverViewStats';
import PairSelector from './components/PairSelector';

const TitleBar = () => {
  return (
    <div className="flex space-x-[24px] items-end justify-start px-[12px]">
      <PairSelector />
      <OverViewStats />
    </div>
  );
};

export default TitleBar;
