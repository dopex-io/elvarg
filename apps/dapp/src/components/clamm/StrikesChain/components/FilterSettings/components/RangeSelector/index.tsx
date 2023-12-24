import React, { useEffect, useMemo, useState } from 'react';

import { Bar, BarChart, Cell, Rectangle, Tooltip } from 'recharts';

import useClammStore from 'hooks/clamm/useClammStore';
import useStrikesChainStore from 'hooks/clamm/useStrikesChainStore';

import { cn, formatAmount } from 'utils/general';

import RangeSelectorSlider from './components/Slider';

const RangeSelector = () => {
  const { markPrice } = useClammStore();
  const { strikesChain } = useStrikesChainStore();
  const [selectedStikes, setSelectedStrikes] = useState<number[]>([]);

  const strikes = useMemo(() => {
    return strikesChain
      .sort((a, b) => a.strike - b.strike)
      .map(({ liquidityAvailableUsd, liquidityUsd, strike }) => {
        return {
          strike,
          liquidity: Number(liquidityUsd),
          availableLiquidity: Number(liquidityAvailableUsd),
          availableLiquidityBarHeight: Number(liquidityAvailableUsd),
          liquidityBarHeight:
            Number(liquidityUsd) - Number(liquidityAvailableUsd),
        };
      })
      .filter(({ liquidity }) => liquidity > 500);
  }, [strikesChain]);

  useEffect(() => {
    if (selectedStikes.length === 0 && strikes.length > 1) {
      setSelectedStrikes([0, strikes.length - 1]);
    }
  }, [selectedStikes, strikes]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const strike = payload[0].payload.strike;
      const totalLiquidity = payload[0].payload.liquidity;
      const availableLiquidity = payload[1].payload.availableLiquidity;
      return (
        <div className="custom-tooltip flex flex-col text-[10px] border border-carbon w-full h-full bg-umbra p-[4px]">
          <p className="flex items-center space-x-[4px]">
            <span className="text-stieglitz">Strike:</span>
            <span>{formatAmount(strike, 4)}</span>
          </p>
          <p className="flex items-center space-x-[4px]">
            <span className="text-stieglitz">Total Liquidity:</span>
            <span>{formatAmount(totalLiquidity, 4)}</span>
          </p>
          <p className="flex items-center space-x-[4px]">
            <span className="text-stieglitz">Available Liquidity:</span>
            <span>{formatAmount(availableLiquidity, 4)}</span>
          </p>
        </div>
      );
    }

    return null;
  };

  const highestStrike = useMemo(() => {
    if (!selectedStikes[1]) return Infinity;
    return strikes[selectedStikes[1]].strike;
  }, [selectedStikes, strikes]);

  const lowestStrike = useMemo(() => {
    if (!selectedStikes[0]) return 0;
    return strikes[selectedStikes[0]].strike;
  }, [selectedStikes, strikes]);

  return (
    <div className=" flex items-center flex-col">
      {strikes.length < 2 ? (
        <div className="w-full h-[100px] flex items-center justify-center text-[12px]">
          <p className="text-stieglitz">Not enough strikes</p>
        </div>
      ) : (
        <>
          <BarChart width={438} height={100} data={strikes}>
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="availableLiquidityBarHeight"
              stackId={'a'}
              shape={<Rectangle />}
            >
              {strikes.map(({ strike }, index) => {
                const isCall = strike > markPrice;
                const isOutOfRange =
                  strike < lowestStrike || strike > highestStrike;
                return (
                  <Cell
                    width={2}
                    key={`cell-${index}`}
                    className={cn(
                      isCall ? 'fill-up-only' : 'fill-down-bad',
                      isOutOfRange && 'fill-mineshaft',
                    )}
                  />
                );
              })}
            </Bar>
            <Bar
              dataKey="liquidityBarHeight"
              stackId={'a'}
              shape={<Rectangle />}
            >
              {strikes.map(({ strike }, index) => {
                const isCall = strike > markPrice;
                const isOutOfRange =
                  strike < lowestStrike || strike > highestStrike;
                return (
                  <Cell
                    width={2}
                    key={`cell-${index}`}
                    className={cn(
                      'opacity-30',
                      isCall ? 'fill-up-only' : 'fill-down-bad',
                      isOutOfRange && 'fill-mineshaft',
                    )}
                  />
                );
              })}
            </Bar>
          </BarChart>
          <RangeSelectorSlider
            max={strikes.length - 1}
            onChange={(value) => setSelectedStrikes(value)}
            lowerLimitStrike={lowestStrike}
            upperLimitStrike={highestStrike}
            value={selectedStikes}
          />
        </>
      )}
    </div>
  );
};

export default RangeSelector;
