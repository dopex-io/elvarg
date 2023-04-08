import { useCallback, useEffect, useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import cx from 'classnames';
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

interface PnlChartProps {
  premium: number;
  amount: number;
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
  selectedSpreadPair: ISpreadPair,
  premium: number,
  maxPayoff: number
) {
  if (strike > breakeven) {
    return selectedSpreadPair.longStrike > selectedSpreadPair.shortStrike
      ? -premium
      : maxPayoff;
  } else if (strike <= selectedSpreadPair.shortStrike) {
    return selectedSpreadPair.longStrike > selectedSpreadPair.shortStrike
      ? maxPayoff
      : -premium;
  } else {
    return (
      gradient(breakeven, selectedSpreadPair.shortStrike, premium, maxPayoff) *
        strike +
      yIntercept(breakeven, selectedSpreadPair.shortStrike, premium, maxPayoff)
    );
  }
}

function roundToNearest(num: number): number {
  if (num >= 10) {
    return Math.round(num);
  }
  return num;
}

const DATAPOINT_INTERVAL: number = 10;
const BREAKEVEN_INTERVAL: number = 100;

const PnlChart = (props: PnlChartProps) => {
  const {
    premium: actualPremium,
    amount,
    selectedSpreadPair: actualSpreadPair,
  } = props;
  const { zdteData } = useBoundStore();
  const useFake =
    actualSpreadPair === undefined ||
    actualSpreadPair.shortStrike === undefined;
  const spreadPair = useFake
    ? ({
        shortStrike: zdteData?.nearestStrike! + 2 * zdteData?.step!,
        longStrike: zdteData?.nearestStrike! + zdteData?.step!,
      } as ISpreadPair)
    : actualSpreadPair;
  const premium = actualPremium || 0;
  const breakeven = roundToTwoDecimals(spreadPair.shortStrike + premium);
  const maxPayoff = getMaxPayoff(spreadPair, premium);
  const price: number = zdteData?.tokenPrice || 0;
  const [state, setState] = useState<{ price: number; pnl: number }>({
    price,
    pnl: 0,
  });

  const data = useMemo(() => {
    const lower = roundToNearest(breakeven - BREAKEVEN_INTERVAL);
    const upper = roundToNearest(breakeven + BREAKEVEN_INTERVAL);
    const strikes = Array.from(
      { length: Math.ceil((upper - lower) / DATAPOINT_INTERVAL) + 1 },
      (_, i) => lower + i * DATAPOINT_INTERVAL
    );
    return strikes.map((s) => {
      const payoff = getPayoff(s, breakeven, spreadPair, premium, maxPayoff);
      return {
        strike: s,
        value: roundToTwoDecimals(payoff),
      };
    });
  }, [zdteData, spreadPair, breakeven, maxPayoff]);

  const pnl = getPayoff(price, breakeven, spreadPair, premium, maxPayoff);

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
      <div
        className={cx(
          'rounded-lg mb-2 pb-0 p-2 -ml-2',
          useFake ? 'blur-sm' : ''
        )}
      >
        <ResponsiveContainer width="100%" height="100%" aspect={2}>
          <LineChart
            height={300}
            data={data}
            onMouseMove={useFake ? undefined : handleOnMouseMove}
            onMouseLeave={useFake ? undefined : handleMouseLeave}
          >
            <Tooltip content={() => null} cursor={!useFake} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="white"
              dot={false}
              strokeWidth={2}
              activeDot={!useFake}
            />
            <ReferenceLine y={0} stroke="#22E1FF" strokeWidth={2} />
            <XAxis
              type="number"
              dataKey={'strike'}
              domain={['dataMin', 'dataMax']}
              fontSize={14}
            />
            <YAxis
              padding={{ bottom: 1 }}
              domain={['dataMin', 'dataMax']}
              width={45}
              interval="preserveStartEnd"
              type="number"
              tickCount={10}
              fontSize={14}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-1">
        <ContentRow
          title="Price"
          content={`$${formatAmount(state.price, 2)}`}
        />
        <ContentRow
          title="Est. PnL"
          content={`${useFake ? 0 : roundToTwoDecimals(state.pnl * amount)}`}
          highlightPnl
          comma
        />
        <ContentRow
          title="Breakeven"
          content={`$${formatAmount(useFake ? 0 : breakeven, 2)}`}
        />
        <ContentRow
          title="Max payoff"
          content={`${
            useFake
              ? 0
              : roundToTwoDecimals(
                  getMaxPayoff(spreadPair, premium) * Math.max(1, amount)
                )
          }`}
          highlightPnl
          comma
        />
      </div>
    </Box>
  );
};

export default PnlChart;
