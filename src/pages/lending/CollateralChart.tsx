import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  Line,
  Bar,
  BarChart,
  Tooltip as RechartsTooltip,
  Cell,
} from 'recharts';
import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

interface CollateralData {
  earn_apr: number;
  collateral: number;
  datetime: string;
}

interface CollateralChartProps {
  data: CollateralData[];
  totalCollateral: number;
}

const CustomizedTooltip = ({ active, payload }: any) => {
  return active && payload && payload.length ? (
    <>
      <Box className="flex flex-col items-center">
        <Typography variant="h6" className="-mt-1">
          ${payload[0].payload.collateral} Collateral
        </Typography>
        <Typography variant="h6" className="mt-3">
          {payload[0].payload.datetime}{' '}
        </Typography>
      </Box>
    </>
  ) : null;
};

export const CollateralChart = (props: CollateralChartProps) => {
  const { data, totalCollateral } = props;

  const [focusBar, setFocusBar] = useState<number>(-1);
  const [toolTipYPosition, setToolTipYPosition] = useState<number>(0);

  useEffect(() => {
    const barCharts = document.querySelectorAll('.recharts-bar-rectangle');
    if (!barCharts || !focusBar) return;
    const barChart = barCharts[focusBar]!;
    setToolTipYPosition(barChart?.getBoundingClientRect().height);
  }, [focusBar]);

  return (
    <div className="flex flex-row justify-between mt-5 flex-wrap">
      <Box>
        <Typography variant="h5" color="primary">
          Total Collateral
        </Typography>
        <Typography variant="h1" className="mb-5">
          ${totalCollateral}
        </Typography>

        <ResponsiveContainer aspect={2.5} width={450}>
          <BarChart
            barCategoryGap={1}
            data={data}
            margin={{
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
            }}
            onMouseMove={(state) => {
              if (state.isTooltipActive) {
                setFocusBar(state.activeTooltipIndex!);
              } else {
                setFocusBar(-1);
              }
            }}
            onMouseLeave={() => setFocusBar(-1)}
          >
            <RechartsTooltip
              cursor={false}
              position={{
                y: 170 - toolTipYPosition,
              }}
              offset={-100}
              content={<CustomizedTooltip payload={data} />}
              wrapperStyle={{ outline: 'none' }}
              allowEscapeViewBox={{ x: true }}
            />
            <Bar dataKey="collateral" radius={[4, 4, 0, 0]}>
              {[...Array(data.length).keys()].map((index) => (
                <>
                  <Cell
                    key={`cell-${index}`}
                    fill={focusBar === index ? '#002EFF' : '#3E3E3E'}
                  />
                </>
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </div>
  );
};
