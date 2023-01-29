import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  Bar,
  BarChart,
  Tooltip as RechartsTooltip,
  Cell,
} from 'recharts';
import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

const loanTypeToColor: Record<string, string> = {
  Borrowing: '#22E1FF',
  Collateral: '#002EFF',
};

interface LoanData {
  loanAmount: number;
  datetime: string;
}

interface ChartProps {
  loanType: 'Borrowing' | 'Collateral';
  data: LoanData[];
  totalLoan: number;
}

const CustomizedTooltip = ({ active, payload }: any) => {
  return active && payload && payload.length ? (
    <>
      <Box className="flex flex-col items-center border-transparent">
        <Typography variant="h5" className="-mt-1">
          ${payload[0].payload.loanAmount}
        </Typography>
        <Typography variant="h5" className="-mt-1">
          {payload[0].payload.datetime}
        </Typography>
      </Box>
    </>
  ) : null;
};

export const Chart = (props: ChartProps) => {
  const { loanType, data, totalLoan } = props;

  const [focusBar, setFocusBar] = useState<number>(-1);
  const [toolTipYPosition, setToolTipYPosition] = useState<number>(0);
  const [toolTipXPosition, setToolTipXPosition] = useState<number>(0);

  useEffect(() => {
    const barCharts = document.querySelectorAll('.recharts-bar-rectangle');
    if (!barCharts || !focusBar) return;
    const barChart = barCharts[focusBar]!;
    setToolTipYPosition(barChart?.getBoundingClientRect().height);
    setToolTipXPosition(barChart?.getBoundingClientRect().width);
  }, [focusBar]);

  return (
    <Box key={`${loanType}-box`}>
      <Typography
        key={`${loanType}-text`}
        variant="h5"
        color={loanType === 'Collateral' ? 'primary' : 'wave-blue'}
      >
        Total {loanType}
      </Typography>
      <Typography key={`${loanType}-amount`} variant="h1" className="mb-5">
        ${totalLoan}
      </Typography>

      <ResponsiveContainer aspect={2.5} width={480}>
        <BarChart
          key={loanType}
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
            key={loanType}
            cursor={false}
            position={{
              y: toolTipYPosition,
              x: focusBar * toolTipXPosition,
            }}
            offset={-100}
            content={<CustomizedTooltip payload={data} />}
            wrapperStyle={{ outline: 'none' }}
            allowEscapeViewBox={{ x: true }}
          />
          <Bar dataKey="loanAmount" radius={[2, 2, 0, 0]}>
            {[...Array(data.length).keys()].map((index) => (
              <>
                <Cell
                  key={`cell-${loanType}-${index}`}
                  fill={
                    focusBar === index ? loanTypeToColor[loanType] : '#3E3E3E'
                  }
                />
              </>
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};
