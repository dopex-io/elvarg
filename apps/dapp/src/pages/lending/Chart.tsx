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
import { LendingStats } from 'store/Vault/lending';
import { format } from 'date-fns';
import { formatAmount } from 'utils/general';

const loanTypeToColor: Record<string, string> = {
  Borrowing: '#22E1FF',
  Collateral: '#002EFF',
};

interface ChartProps {
  loanType: 'Borrowing' | 'Collateral';
  stats: Partial<LendingStats>[];
  totalLoan: number;
}

const CustomizedTooltip = ({ active, payload }: any) => {
  return active && payload && payload.length ? (
    <>
      <Box className="flex flex-col items-center border-transparent">
        <Typography variant="h5" className="-mt-1">
          ${formatAmount(payload[0].payload.loanAmount, 0, true)}
        </Typography>
        <Typography variant="h5" className="-mt-1">
          {format(new Date(payload[0].payload.timestamp * 1000), 'LLL d')}
        </Typography>
      </Box>
    </>
  ) : null;
};

export const Chart = (props: ChartProps) => {
  const { loanType, stats, totalLoan } = props;

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
        variant="h3"
        color={loanType === 'Collateral' ? 'primary' : 'wave-blue'}
      >
        Total {loanType}
      </Typography>
      <Typography key={`${loanType}-amount`} variant="h1" className="mb-5">
        ${formatAmount(totalLoan, 2, true)}
      </Typography>

      <ResponsiveContainer aspect={2.5} width={480}>
        <BarChart
          barCategoryGap={1}
          data={stats}
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
              y: toolTipYPosition,
              x: focusBar * toolTipXPosition,
            }}
            offset={-100}
            content={<CustomizedTooltip payload={stats} />}
            wrapperStyle={{ outline: 'none' }}
            allowEscapeViewBox={{ x: true }}
          />
          <Bar dataKey="loanAmount" radius={[2, 2, 0, 0]}>
            {[...Array(stats.length).keys()].map((index) => (
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
