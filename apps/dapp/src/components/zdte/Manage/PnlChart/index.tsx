import { useMemo } from 'react';

import Box from '@mui/material/Box';
import reverse from 'lodash/reverse';
import {
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { useBoundStore } from 'store';

import { ISpreadPair } from 'store/Vault/zdte';

import { getMaxPayoff } from 'components/zdte/Manage/TradeCard';

interface PnlChartProps {
  premium: number;
  selectedSpreadPair: ISpreadPair;
}

function gradient(
  breakeven: number,
  shortStrike: number,
  premium: number,
  maxPayoff: number
) {
  return (maxPayoff + premium) / (shortStrike - breakeven);
}

function yIntercept(
  breakeven: number,
  shortStrike: number,
  premium: number,
  maxPayoff: number
) {
  return (
    maxPayoff -
    gradient(breakeven, shortStrike, premium, maxPayoff) * shortStrike
  );
}

function getPayoff(
  strike: number,
  breakeven: number,
  shortStrike: number,
  premium: number,
  maxPayoff: number
) {
  if (strike < breakeven) {
    return -premium;
  } else if (strike > shortStrike) {
    return maxPayoff;
  } else {
    return (
      gradient(breakeven, shortStrike, premium, maxPayoff) * strike +
      yIntercept(breakeven, shortStrike, premium, maxPayoff)
    );
  }
}

const PnlChart = (props: PnlChartProps) => {
  const { premium, selectedSpreadPair } = props;
  const { zdteData } = useBoundStore();
  const strikes = reverse(zdteData?.strikes || []);

  const data = useMemo(() => {
    return strikes.map((s) => {
      const payoff = getPayoff(
        s.strike,
        s.breakeven,
        selectedSpreadPair.shortStrike,
        premium,
        getMaxPayoff(selectedSpreadPair, premium)
      );
      console.log('payoff: ', payoff);
      return {
        price: s.strike,
        value: payoff,
      };
    });
  }, [strikes]);

  return (
    <Box className="h-24 mt-1">
      <ResponsiveContainer width="100%" height="100%" className="mb-4">
        <LineChart height={200} data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke="white"
            dot={false}
            strokeWidth={2}
          />
          <ReferenceLine y={0} stroke="#ffffff" strokeWidth={2} />
          <XAxis type="number" dataKey={'price'} domain={['auto', 'auto']} />
          <YAxis padding={{ bottom: 1 }} width={30} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default PnlChart;
