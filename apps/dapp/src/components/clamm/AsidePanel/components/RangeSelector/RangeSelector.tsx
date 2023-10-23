import { useMemo, useRef } from 'react';

import { useBoundStore } from 'store';

import Chart from 'components/clamm/AsidePanel/components/RangeSelector/Chart';

import { PriceInterval } from './types';

const RangeSelector = () => {
  const ref = useRef<HTMLDivElement>(null);

  const { ticksData } = useBoundStore();
  const formattedData: PriceInterval[] = useMemo(() => {
    return ticksData
      .map((d) => ({
        priceRange: [d.tickLowerPrice, d.tickLowerPrice],
        availableAssets: d.liquidityAvailable.token0Amount,
      }))
      .filter((d) => d.availableAssets !== 0n) as PriceInterval[];
  }, [ticksData]);
  return (
    <div className="bg-umbra my-2" ref={ref}>
      <Chart
        data={formattedData}
        height={200}
        width={ref.current?.offsetWidth || 300}
        margin={{
          top: 10,
          left: 10,
          bottom: 10,
          right: 10,
        }}
      />
    </div>
  );
};

export default RangeSelector;
