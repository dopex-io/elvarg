import { useEffect, useState } from 'react';
import { TooltipProps } from 'recharts';
import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';
import GridItem from 'components/atlantics/Charts/LiquidityBarGraph/CustomTooltipContent/GridItem';

interface Props extends TooltipProps<number, string> {
  title?: string;
}

const CustomTooltipContent = (props: Props) => {
  const { payload, title } = props;

  const [formattedPayload, setFormattedPayload] =
    useState<Record<string, number>>();

  useEffect(() => {
    if (!payload || !payload[0] || !payload[0].payload) return;

    const { strike, availableCollateral, unlocked, activeCollateral } =
      payload[0].payload;

    setFormattedPayload({
      activeCollateral,
      strike,
      availableCollateral,
      unlocked,
    });
  }, [payload]);

  return (
    <Box className="space-y-2 bg-umbra rounded-xl border border-carbon divide-y divide-carbon bg-opacity-50 backdrop-blur-sm">
      {title ? (
        <Typography variant="h6" className="text-center mt-2">
          {title}
        </Typography>
      ) : null}
      <Box className="rounded-b-xl grid grid-cols-1 grid-rows-2 divide-y divide-carbon w-[16rem]">
        <Box className="flex divide-x divide-carbon">
          <GridItem label="Strike" value={formattedPayload?.['strike']} />
          <GridItem
            label="Available"
            value={formattedPayload?.['availableCollateral']}
          />
        </Box>
        <Box className="flex divide-x divide-carbon">
          <GridItem label="Unlocked" value={formattedPayload?.['unlocked']} />
          <GridItem
            label="Active"
            value={formattedPayload?.['activeCollateral']}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CustomTooltipContent;
