import { useEffect, useState } from 'react';
import { TooltipProps } from 'recharts';

import GridItem from 'components/atlantics/Charts/LiquidityBarGraph/CustomTooltipContent/GridItem';

interface Props extends TooltipProps<number, string> {
  title?: string;
  datapointKey: string;
  isTypePrice?: boolean;
}

const TITLE_LABELS: Record<string, string> = {
  rdpxPrices: 'RDPX Price',
  dscPrices: 'DPXETH Price',
  dscTotalSupplies: 'DPXETH Supply',
  rdpxTotalSupplies: 'RDPX Supply',
};

const CustomTooltip = (props: Props) => {
  const { payload, title, datapointKey, isTypePrice } = props;

  const [formattedPayload, setFormattedPayload] =
    useState<Record<string, number>>();

  useEffect(() => {
    if (!payload || !payload[0] || !payload[0].payload || !datapointKey) return;

    const dataPoint: number = payload[0].payload[datapointKey];
    const time = payload[0].payload['time'];

    setFormattedPayload({
      time,
      [datapointKey]: dataPoint,
    });
  }, [payload, datapointKey]);

  return (
    <div className="space-y-2 bg-umbra rounded-xl border border-carbon divide-y divide-carbon bg-opacity-50 backdrop-blur-sm">
      {title ? <h6 className="text-sm text-center mt-2">{title}</h6> : null}
      <div className="rounded-b-xl grid grid-cols-1 grid-rows-auto divide-y divide-carbon w-[16rem] h-fit">
        <div className="flex divide-x divide-carbon">
          <GridItem label="Date" value={formattedPayload?.['time']} />
        </div>
        <div className="flex divide-x divide-carbon">
          <GridItem
            label={TITLE_LABELS[datapointKey] ?? ''}
            value={`${isTypePrice ? '$' : ''}${
              formattedPayload?.[datapointKey]
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomTooltip;
