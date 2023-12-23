import React from 'react';

import FilterPanel from './components/FilterPanel';
import RangeSelector from './components/FilterSettings/components/RangeSelector';
import FilterSettingsButton from './components/FilterSettingsButton';
import StrikesTable from './components/StrikesTable';

const StrikesChain = () => {
  return (
    <div className="w-full bg-cod-gray flex flex-col rounded-md">
      <div className="flex items-center justify-between px-[12px]">
        <FilterPanel />
        <FilterSettingsButton />
      </div>
      <StrikesTable />
    </div>
  );
};

export default StrikesChain;
