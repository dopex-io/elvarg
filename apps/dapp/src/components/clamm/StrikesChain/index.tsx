import React, { useState } from 'react';

import {
  DEFAULT_STRIKES_CHAIN_FILTER_SETTINGS,
  FilterSettingsType,
} from 'constants/clamm';

import FilterPanel from './components/FilterPanel';
import FilterSettingsButton from './components/FilterSettingsButton';
import StrikesTable from './components/StrikesTable';

const StrikesChain = () => {
  const [filterSettings, setFilterSettings] = useState<FilterSettingsType>(
    DEFAULT_STRIKES_CHAIN_FILTER_SETTINGS,
  );

  return (
    <div className="w-full bg-cod-gray flex flex-col rounded-md">
      <div className="flex items-center justify-between p-[12px]">
        <FilterPanel />
        <FilterSettingsButton
          filterSettings={filterSettings}
          setFilterSettings={setFilterSettings}
        />
      </div>
      <StrikesTable filterSettings={filterSettings} />
    </div>
  );
};

export default StrikesChain;
