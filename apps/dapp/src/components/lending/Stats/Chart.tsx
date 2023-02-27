import React from 'react';

import Box from '@mui/material/Box';
import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis } from 'recharts';

import { LendingStats } from 'store/Vault/lending';

import Typography from 'components/UI/Typography';

import { getReadableTime } from 'utils/contracts';
import { formatAmount } from 'utils/general';

// TODO: remove
const fakeData = [
  { loanAmount: 1000000, timestamp: 1675175442 },
  { loanAmount: 2000000, timestamp: 1675175442 },
  { loanAmount: 3000000, timestamp: 1675175442 },
  { loanAmount: 4000000, timestamp: 1675175442 },
  { loanAmount: 5000000, timestamp: 1675175442 },
  { loanAmount: 6000000, timestamp: 1675175442 },
  { loanAmount: 7000000, timestamp: 1675175442 },
  { loanAmount: 6000000, timestamp: 1675175442 },
  { loanAmount: 5000000, timestamp: 1675175442 },
  { loanAmount: 6000000, timestamp: 1675175442 },
  { loanAmount: 7000000, timestamp: 1675175442 },
  { loanAmount: 8000000, timestamp: 1675175442 },
  { loanAmount: 9000000, timestamp: 1675175442 },
  { loanAmount: 7000000, timestamp: 1675175442 },
  { loanAmount: 5000000, timestamp: 1675175442 },
  { loanAmount: 6000000, timestamp: 1675175442 },
  9,
];

interface ChartProps {
  loanType: 'Borrowing' | 'Collateral';
  stats: Partial<LendingStats>[];
  totalLoan: number;
}

const CustomizedTooltip = ({ active, payload }: any) => {
  return active && payload && payload.length ? (
    <Box className="flex flex-col border border-cod-gray p-3 rounded-lg bg-cod-gray w-36 bg-opacity-50">
      <Typography variant="h4" color="stieglitz">
        {/* {format(new Date(payload[0].payload.timestamp * 1000), 'LLL d')} */}
        {getReadableTime(payload[0].payload.timestamp)}
      </Typography>
      <div className="flex justify-between">
        <Typography variant="h4" color="stieglitz">
          TVL
        </Typography>
        <Typography variant="h4">
          ${formatAmount(payload[0].payload.loanAmount, 0, true)}
        </Typography>
      </div>
    </Box>
  ) : null;
};

const Chart = (props: ChartProps) => {
  const { loanType, totalLoan } = props;

  return (
    <Box key={`${loanType}-box`}>
      <Typography key={`${loanType}-amount`} variant="h4">
        $ {formatAmount(totalLoan, 2, true)}
      </Typography>
      <Typography key={`${loanType}-text`} variant="h4" color="stieglitz">
        Total {loanType}
      </Typography>
      <ResponsiveContainer width={600} height="60%" className="my-3">
        <AreaChart data={fakeData}>
          <Tooltip
            cursor={false}
            wrapperStyle={{ outline: 'none' }}
            content={<CustomizedTooltip payload={fakeData} />}
          />
          <YAxis type="number" domain={['dataMin', 'dataMax']} hide />
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0.5%" stopColor="#002eff" stopOpacity={0.8} />
              <stop offset="99.5%" stopColor="#22e1ff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            className="blur-[2px]"
            type="monotone"
            dataKey="loanAmount"
            stroke="#22e1ff"
            fill="url(#colorUv)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default Chart;
