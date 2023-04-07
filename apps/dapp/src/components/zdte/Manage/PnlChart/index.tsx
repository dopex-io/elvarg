import { useCallback, useEffect, useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import {
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CategoricalChartFunc } from 'recharts/types/chart/generateCategoricalChart';
import { useBoundStore } from 'store';

import { ISpreadPair } from 'store/Vault/zdte';

import ContentRow from 'components/atlantics/InsuredPerps/ManageCard/ManagePosition/ContentRow';
import {
  getMaxPayoff,
  roundToTwoDecimals,
} from 'components/zdte/Manage/TradeCard';

import { formatAmount } from 'utils/general';

const CustomTooltip = () => {
  return null;
};
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

const DATAPOINT_INTERVAL: number = 10;
const STRIKE_INTERVAL: number = 50;

const PnlChart = (props: PnlChartProps) => {
  const { premium, selectedSpreadPair } = props;
  const { zdteData } = useBoundStore();
  const breakeven = selectedSpreadPair?.longStrike + premium;
  const maxPayoff = getMaxPayoff(selectedSpreadPair, premium);
  const price: number = zdteData?.tokenPrice || 0;
  const [state, setState] = useState<{ price: number; pnl: number }>({
    price,
    pnl: 0,
  });

  const data = useMemo(() => {
    let strikes = [...zdteData?.strikes.map((s) => s.strike)!];
    const upper = strikes[0] || 0 + STRIKE_INTERVAL;
    const lower = strikes[strikes.length - 1] || 0 - STRIKE_INTERVAL;
    strikes = Array.from(
      { length: Math.ceil((upper - lower) / DATAPOINT_INTERVAL) + 1 },
      (_, i) => lower + i * DATAPOINT_INTERVAL
    );
    return strikes.map((s) => {
      const payoff = getPayoff(
        s,
        breakeven,
        selectedSpreadPair?.shortStrike || 0,
        premium,
        maxPayoff
      );
      return {
        strike: s,
        value: roundToTwoDecimals(payoff),
      };
    });
  }, [zdteData, selectedSpreadPair]);

  const pnl = getPayoff(
    price,
    breakeven,
    selectedSpreadPair?.shortStrike || 0,
    premium,
    maxPayoff
  );

  const handleMouseLeave = useCallback(
    () => setState({ price, pnl }),
    [price, pnl]
  );

  const handleOnMouseMove: CategoricalChartFunc = useCallback(
    ({ activePayload }) => {
      if (!activePayload?.length) return;
      const { payload } = activePayload[0];
      setState({
        price: payload.strike,
        pnl: payload.value,
      });
    },
    []
  );

  useEffect(() => {
    setState({ price, pnl });
  }, [price, pnl]);

  return (
    <Box className="mt-1">
      <ResponsiveContainer width="100%" height="100%" aspect={2}>
        <LineChart
          height={300}
          data={data}
          onMouseMove={handleOnMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <Tooltip content={<CustomTooltip />} />

          <Line
            type="monotone"
            dataKey="value"
            stroke="white"
            dot={false}
            strokeWidth={2}
          />
          <ReferenceLine y={0} stroke="#22E1FF" strokeWidth={2} />
          <XAxis
            type="number"
            dataKey={'strike'}
            domain={['dataMin', 'dataMax']}
          />
          <YAxis
            padding={{ bottom: 1 }}
            domain={['dataMin', 'dataMax']}
            width={35}
            interval="preserveStartEnd"
            type="number"
            tickCount={10}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="space-y-1">
        <ContentRow
          title="Price"
          content={`$${formatAmount(state.price, 2)}`}
        />
        <ContentRow
          title="Est. PnL"
          content={`${formatAmount(state.pnl || 0, 2)}`}
          highlightPnl
        />
        <ContentRow
          title="Breakeven"
          content={`$${formatAmount(breakeven || 0, 2)}`}
        />
        <ContentRow
          title="Max payoff"
          content={`$${roundToTwoDecimals(
            getMaxPayoff(selectedSpreadPair, premium)
          )}`}
        />
      </div>
    </Box>
  );
};

export default PnlChart;
