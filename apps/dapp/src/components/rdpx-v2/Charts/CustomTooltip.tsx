import { useEffect, useState } from 'react';
import { TooltipProps } from 'recharts';

import GridItem from 'components/atlantics/Charts/LiquidityBarGraph/CustomTooltipContent/GridItem';

interface Props extends TooltipProps<number, string> {
  title?: string;
  datapointKeys: string[];
  isTypePrice?: boolean;
}

const TITLE_LABELS: Record<string, string> = {
  rdpxPrices: 'RDPX Price',
  dscPrices: 'DPXETH Price',
  dscTotalSupplies: 'DPXETH Supply',
  rdpxTotalSupplies: 'RDPX Supply',
};

const CustomTooltip = (props: Props) => {
  const { payload, title, datapointKeys, isTypePrice } = props;

  const [formattedPayload, setFormattedPayload] =
    useState<Record<string, number>>();

  useEffect(() => {
    if (
      !payload ||
      !payload[0] ||
      !payload[0].payload ||
      datapointKeys.length === 0
    )
      return;

    let _formattedPayload: Record<string, string | number> = {};
    datapointKeys.map((key: string) => {
      const dataPoint: number = payload[0]?.payload[key];
      _formattedPayload[key] = dataPoint;
    });

    const time = payload[0]?.payload['time'];

    setFormattedPayload({ ..._formattedPayload, time });
  }, [payload, datapointKeys]);

  return (
    <div className="space-y-2 bg-umbra rounded-xl border border-carbon divide-y divide-carbon bg-opacity-50 backdrop-blur-sm">
      {title ? <h6 className="text-sm text-center mt-2">{title}</h6> : null}
      <div className="rounded-b-xl grid grid-cols-1 grid-rows-auto divide-y divide-carbon w-[16rem] h-fit">
        <div className="flex divide-x divide-carbon">
          <GridItem label="Date" value={formattedPayload?.['time']} />
        </div>
        <div className="flex divide-x divide-carbon">
          {datapointKeys.map((key) => {
            return (
              <GridItem
                label={TITLE_LABELS[key] ?? ''}
                value={`${
                  isTypePrice
                    ? new Intl.NumberFormat('en-US', {
                        currency: 'USD',
                        style: 'currency',
                      }).format(formattedPayload?.[key] || 0)
                    : formattedPayload?.[key]
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CustomTooltip;
