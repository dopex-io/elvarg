import { useMemo } from 'react';

import { cn } from 'utils/general';

import { MARKETS } from 'constants/ssov/markets';

import FilterPanel from './FilterPanel';
import StrikesTable from './StrikeTable';

const StrikesChain = ({ market }: { market: string }) => {
  const disabled = useMemo(() => {
    return MARKETS[market].disabled;
  }, [market]);

  return (
    <div className={cn('bg-cod-gray rounded-lg relative', !disabled && 'p-3')}>
      {disabled ? (
        <div className="w-full h-full backdrop-blur-sm absolute bg-carbon z-50 bg-opacity-10 border-yellow-300 border-2 rounded-lg font-bold">
          <div className="w-full h-full flex items-center justify-center">
            ⚠️ Market is disabled
          </div>
        </div>
      ) : null}
      <div className="relative h-12">
        <FilterPanel market={market} />
      </div>
      <StrikesTable market={market} />
    </div>
  );
};

export default StrikesChain;
