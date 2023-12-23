import React, {
  FunctionComponent,
  PureComponent,
  ReactElement,
  useMemo,
} from 'react';

import {
  Bar,
  BarChart,
  BarProps,
  CartesianGrid,
  Cell,
  Customized,
  CustomizedProps,
  Rectangle,
  ResponsiveContainer,
} from 'recharts';

import useClammStore from 'hooks/clamm/useClammStore';
import useStrikesChainStore from 'hooks/clamm/useStrikesChainStore';

import { cn } from 'utils/general';

type StrikeData = {
  strike: number;
  putLiquidity: number;
  callLiquidity: number;
};

const RangeSelector = () => {
  const { markPrice } = useClammStore();
  const { strikesChain } = useStrikesChainStore();
  const putStrikes = useMemo(() => {
    return strikesChain
      .sort((a, b) => a.strike - b.strike)
      .map(({ liquidityAvailableUsd, type, strike }) => ({
        strike,
        putLiquidity: type === 'put' ? Number(liquidityAvailableUsd) : 0,
        callLiquidity: 0,
      }))
      .filter(({ putLiquidity }) => putLiquidity !== 0);
  }, [strikesChain]);

  const strikes = useMemo(() => {
    const highestLiquidity = Math.max(
      strikesChain.map(({ liquidityAvailableUsd }) =>
        Number(liquidityAvailableUsd),
      ),
    );

    return strikesChain
      .sort((a, b) => a.strike - b.strike)
      .map(({ liquidityAvailableUsd, strike }) => {
        return {
          strike,
          liquidity: Number(liquidityAvailableUsd),
          height: Math.round(
            (Number(liquidityAvailableUsd) / Number(highestLiquidity)) * 100,
          ),
        };
      });
  }, [strikesChain]);

  return (
    <div className="w-full h-full flex items-center">
      <ResponsiveContainer width="100%" height="100%" className="p-0 m-0">
        <BarChart width={300} height={40} data={strikes}>
          <Bar dataKey="height" shape={<Rectangle />}>
            {strikes.map(({ strike }, index) => {
              const isCall = strike > markPrice;
              console.log(strike, markPrice, isCall);
              return (
                <Cell
                  key={`cell-${index}`}
                  className={cn(isCall ? 'fill-up-only' : 'fill-down-bad')}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RangeSelector;
