import { useCallback, useEffect, useMemo, useState } from 'react';

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
  getMaxPayoffPerOption,
  roundToTwoDecimals,
} from 'components/zdte/Manage/TradeCard';
import { FormatPercentColor } from 'components/zdte/OptionsTable/OptionsTableRow';

import { formatAmount } from 'utils/general';
import formatAmountWithNegative from 'utils/general/formatAmountWithNegative';
import getPercentageDifference from 'utils/math/getPercentageDifference';

interface PnlChartProps {
  cost: number;
  amount: number;
  selectedSpreadPair: ISpreadPair;
}

function roundToNearest(num: number): number {
  if (num >= 10) {
    return Math.round(num);
  }
  return num;
}

function getInterval(number: number): number {
  if (number >= 100) {
    return 10;
  } else if (number > 10 && number <= 100) {
    return 5;
  } else {
    return 0.05;
  }
}

function CustomYAxisTick(props: any) {
  const { x, y, payload } = props;
  let res = '';
  if (payload.value > 1000) {
    res = formatAmount(payload.value, 0, true);
  } else if (payload.value > 10) {
    res = payload.value.toString();
  } else if (payload.value < 0) {
    res = formatAmountWithNegative(payload.value, 0, true);
  } else if (payload.value > 0.01) {
    res = payload.value.toFixed(2).toString();
  } else {
    res = '0';
  }
  return (
    <text x={x} y={y} textAnchor="end" fill="#666" fontSize={14}>
      {res}
    </text>
  );
}

function getPutPayoff(spreadPair: ISpreadPair, strike: number, cost: number) {
  return (
    Math.max(spreadPair.longStrike - strike, 0) -
    Math.max(spreadPair.shortStrike - strike, 0) -
    cost
  );
}

function getCallPayoff(spreadPair: ISpreadPair, strike: number, cost: number) {
  return (
    Math.max(strike - spreadPair.longStrike, 0) -
    Math.max(strike - spreadPair.shortStrike, 0) -
    cost
  );
}

function getPutBreakEven(spreadPair: ISpreadPair, cost: number) {
  return spreadPair.longStrike - cost;
}

function getCallBreakEven(spreadPair: ISpreadPair, cost: number) {
  return spreadPair.longStrike + cost;
}

const PnlChart = (props: PnlChartProps) => {
  const {
    cost: actualCost,
    amount,
    selectedSpreadPair: actualSpreadPair,
  } = props;
  const { zdteData } = useBoundStore();
  const step = zdteData?.step || 0;
  const useFake =
    actualSpreadPair === undefined ||
    actualSpreadPair.shortStrike === undefined;
  const spreadPair = useMemo(() => {
    return useFake
      ? ({
          shortStrike: zdteData?.nearestStrike! + 2 * step,
          longStrike: zdteData?.nearestStrike! + step,
        } as ISpreadPair)
      : actualSpreadPair;
  }, [actualSpreadPair, useFake, step, zdteData?.nearestStrike]);

  const cost = actualCost || 0;
  const isPut = spreadPair.longStrike > spreadPair.shortStrike;
  const staticBreakeven = isPut
    ? getPutBreakEven(spreadPair, cost)
    : getCallBreakEven(spreadPair, cost);
  const price: number = zdteData?.tokenPrice || 0;
  const [state, setState] = useState<{ price: number; pnl: number }>({
    price,
    pnl: 0,
  });

  const data = useMemo(() => {
    const lower = roundToNearest(
      (isPut ? spreadPair.shortStrike : spreadPair.longStrike) - step
    );
    const upper = roundToNearest(
      (isPut ? spreadPair.longStrike : spreadPair.shortStrike) + step
    );
    const strikes = Array.from(
      { length: Math.ceil((upper - lower) / getInterval(price)) + 1 },
      (_, i) => lower + i * getInterval(price)
    );
    console.log('strikes: ', strikes);
    return strikes.map((s) => {
      const payoff = isPut
        ? getPutPayoff(spreadPair, s, cost) * amount
        : getCallPayoff(spreadPair, s, cost) * amount;
      return {
        strike: s,
        value: roundToTwoDecimals(payoff),
      };
    });
  }, [spreadPair, price, amount, cost, isPut, step]);

  const pnl = isPut
    ? getPutPayoff(spreadPair, price, cost) * amount
    : getCallPayoff(spreadPair, price, cost) * amount;

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
    <div className="mt-1">
      <div
        className={cx(
          'rounded-lg mb-2 pb-0 p-2 -ml-1',
          useFake ? 'blur-sm' : ''
        )}
      >
        <ResponsiveContainer width="100%" height="100%" aspect={2}>
          <LineChart
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
              tick={<CustomYAxisTick />}
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
          content={`${useFake ? 0 : roundToTwoDecimals(state.pnl)}`}
          highlightPnl
          comma
        />
        <ContentRow
          title="Breakeven"
          content={`$${formatAmount(useFake ? 0 : staticBreakeven, 2)}`}
        />
        <ContentRow
          title="% to Breakeven"
          content={
            !useFake && zdteData?.tokenPrice !== undefined ? (
              <FormatPercentColor
                value={
                  Math.round(
                    getPercentageDifference(
                      staticBreakeven,
                      zdteData?.tokenPrice
                    ) * 100
                  ) / 100
                }
              />
            ) : (
              '0%'
            )
          }
        />
        <ContentRow
          title="Max Payoff"
          content={`${
            useFake
              ? 0
              : roundToTwoDecimals(
                  getMaxPayoffPerOption(spreadPair, cost) * amount
                )
          }`}
          highlightPnl
          comma
        />
      </div>
    </div>
  );
};

export default PnlChart;
