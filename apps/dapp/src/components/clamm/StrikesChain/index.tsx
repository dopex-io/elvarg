import React from 'react';

import FilterPanel from './components/FilterPanel';
import StrikesTable from './components/StrikesTable';

const StrikesChain = () => {
  return (
    <div className="w-full bg-cod-gray flex flex-col rounded-md">
      <FilterPanel />
      <StrikesTable />
    </div>
  );
};

export default StrikesChain;
