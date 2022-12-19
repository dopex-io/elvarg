import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  Line,
  Bar,
  ComposedChart,
  Tooltip as RechartsTooltip,
  Cell,
} from 'recharts';
import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

interface BorrowingData {
  borrow_apr: number;
  borrowing: number;
  datetime: string;
}

interface BorrowingChartProps {
  data: BorrowingData[];
  totalBorrowing: number;
}

const CustomizedTooltip = ({ active, payload }: any) => {
  return active && payload && payload.length ? (
    <>
      <Box className="flex flex-col items-center border-transparent">
        <Typography variant="h6" color="white">
          {payload[0].payload.borrow_apr / 100}% Borrow APR
        </Typography>
        <Typography variant="h6" className="-mt-1">
          ${payload[0].payload.borrowing} Borrowing
        </Typography>
        <Typography variant="h6" className="mt-5">
          {payload[0].payload.datetime}{' '}
        </Typography>
      </Box>
    </>
  ) : null;
};

export const BorrowingChart = (props: BorrowingChartProps) => {
  const { data, totalBorrowing } = props;

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
        <Typography variant="h5" color="wave-blue">
          Total Borrowing
        </Typography>
        <Typography variant="h1" className="mb-5">
          ${totalBorrowing}
        </Typography>

        <ResponsiveContainer aspect={2.5} width={450}>
          <ComposedChart
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
            <Bar dataKey="borrowing" radius={[4, 4, 0, 0]}>
              {[...Array(data.length).keys()].map((index) => (
                <>
                  <Cell
                    key={`cell-${index}`}
                    fill={focusBar === index ? '#22E1FF' : '#3E3E3E'}
                  />
                </>
              ))}
            </Bar>
            <Line
              dataKey="borrow_apr"
              strokeWidth={3}
              stroke="#22E1FF"
              yAxisId="right"
              type="monotone"
              legendType="rect"
              dot={false}
              activeDot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
    </div>
  );
};
