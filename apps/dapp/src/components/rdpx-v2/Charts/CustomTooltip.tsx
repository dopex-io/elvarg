import { useEffect, useState } from 'react';
import { TooltipProps } from 'recharts';

import GridItem from 'components/atlantics/Charts/LiquidityBarGraph/CustomTooltipContent/GridItem';

interface Props extends TooltipProps<number, string> {
  title?: string;
  isPriceChart: boolean;
}

const CustomTooltip = (props: Props) => {
  const { payload, title, isPriceChart } = props;

  const [formattedPayload, setFormattedPayload] =
    useState<Record<string, number>>();

  useEffect(() => {
    if (!payload || !payload[0] || !payload[0].payload) return;

    const { price, time, totalSupply } = payload[0].payload;

    setFormattedPayload({
      time,
      [isPriceChart ? 'price' : 'totalSupply']: isPriceChart
        ? price
        : totalSupply,
    });
  }, [payload]);

  return (
    <div className="space-y-2 bg-umbra rounded-xl border border-carbon divide-y divide-carbon bg-opacity-50 backdrop-blur-sm">
      {title ? <h6 className="text-sm text-center mt-2">{title}</h6> : null}
      <div className="rounded-b-xl grid grid-cols-1 grid-rows-auto divide-y divide-carbon w-[16rem] h-fit">
        <div className="flex divide-x divide-carbon">
          <GridItem label="Date" value={formattedPayload?.['time']} />
          <GridItem
            label={isPriceChart ? 'Price' : 'Supply'}
            value={formattedPayload?.[isPriceChart ? 'price' : 'totalSupply']}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomTooltip;
