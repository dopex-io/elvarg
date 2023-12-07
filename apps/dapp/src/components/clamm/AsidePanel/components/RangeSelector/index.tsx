import React, { useMemo, useState } from 'react';

import * as Slider from '@radix-ui/react-slider';

import useClammStore from 'hooks/clamm/useClammStore';
import useStrikesChainStore from 'hooks/clamm/useStrikesChainStore';

import generateStrikes from 'utils/clamm/generateStrikes';
import { cn } from 'utils/general';

const RangeSelector = () => {
  const { tick, selectedOptionsPool, markPrice } = useClammStore();
  const { strikesChain } = useStrikesChainStore();
  const [selectedStrikeIndices, setSelectedStrikeIndicies] = useState<number[]>(
    [],
  );

  const strikesBarGroup = useMemo(() => {
    if (!selectedOptionsPool) return [];
    const { callToken, putToken } = selectedOptionsPool;
    if (strikesChain.length === 0) return [];
    const MAX_BAR_HEIGHT = 100;
    const highestLiquidityUsd = strikesChain.reduce((prev, curr) => {
      return Math.max(prev, Number(curr.liquidityUsd));
    }, Number(strikesChain[0].liquidityUsd));

    return generateStrikes(
      tick,
      10 ** callToken.decimals,
      10 ** putToken.decimals,
      false,
      100,
    )
      .sort((a, b) => a.strike - b.strike)
      .map(
        ({
          strike,
          tickLower: generateStrikeTickLower,
          tickUpper: generateStrikeTickUpper,
        }) => {
          const liquidityUsd =
            strikesChain.find(
              ({ meta: { tickLower, tickUpper } }) =>
                tickLower === generateStrikeTickLower &&
                tickUpper === generateStrikeTickUpper,
            )?.liquidityUsd ?? 0;
          return {
            tickLower: generateStrikeTickLower,
            tickUpper: generateStrikeTickUpper,
            strike,
            barHeight:
              (MAX_BAR_HEIGHT * Number(liquidityUsd)) / highestLiquidityUsd,
          };
        },
      );
  }, [strikesChain, tick, selectedOptionsPool]);

  const sliderDefaultValue = useMemo(() => {
    return [strikesBarGroup.length / 4, strikesBarGroup.length / 2];
  }, [strikesBarGroup]);

  return (
    <div className="w-full h-full flex flex-col bg-umbra p-[12px] pb-[16px] space-y-[4px]">
      <div className="flex  w-full h-[120px] bg-umbra relative">
        {strikesBarGroup.map(({ barHeight, strike }, index) => {
          const isWithinLimits =
            index >= selectedStrikeIndices[0] &&
            index <= selectedStrikeIndices[1];
          return (
            <svg
              key={index}
              className={cn(
                'border-wave-blue',
                index === selectedStrikeIndices[0] && 'border-l-2',
                index === selectedStrikeIndices[1] && 'border-r-2',
              )}
            >
              <rect
                width={10}
                x="0"
                y={110 - barHeight}
                height={barHeight}
                className={cn(
                  'fill-frost',
                  'border',
                  !isWithinLimits && 'opacity-50',
                )}
              />
              <rect
                width={10}
                x="0"
                y={110}
                height={10}
                className={cn(
                  markPrice > strike ? 'fill-down-bad' : 'fill-up-only',
                )}
              />
            </svg>
          );
        })}
      </div>
      <div className="h-[20px] w-full bg-umbra flex justify-between items-center font-mono text-stieglitz text-[10px] font-medium">
        {Array.from({ length: 5 }).map((_, index) => (
          <span key={index}>
            {strikesBarGroup[
              Math.floor(strikesBarGroup.length / 6) * (index + 1)
            ]?.strike.toFixed(4)}
          </span>
        ))}
      </div>
      <div className="w-full h-[10px] bg-umbra">
        <Slider.Root
          className="relative flex items-center select-none touch-none w-full h-5"
          defaultValue={sliderDefaultValue}
          onValueChange={(e) => {
            setSelectedStrikeIndicies(e);
          }}
          value={selectedStrikeIndices}
          step={1}
          minStepsBetweenThumbs={1}
          max={strikesBarGroup.length}
          min={0}
        >
          <Slider.Track className="bg-cod-gray relative grow rounded-full h-[3px]">
            <Slider.Range className="absolute bg-wave-blue rounded-full h-full" />
          </Slider.Track>
          <Slider.Thumb className="bg-carbon border-stieglitz py-[2px] px-[10px] rounded-sm flex items-center justify-between text-[10px] cursor-pointer font-mono hover:bg-mineshaft outline-none">
            <span>
              {strikesBarGroup[selectedStrikeIndices[0] ?? 0]?.strike.toFixed(
                4,
              )}
            </span>
          </Slider.Thumb>
          <Slider.Thumb className="bg-carbon border-stieglitz py-[2px] px-[10px] rounded-sm flex items-center justify-between text-[10px] cursor-pointer font-mono hover:bg-mineshaft outline-none">
            <span>
              {strikesBarGroup[selectedStrikeIndices[1] ?? 0]?.strike.toFixed(
                4,
              )}
            </span>
          </Slider.Thumb>
        </Slider.Root>
      </div>
    </div>
  );
};

export default RangeSelector;
