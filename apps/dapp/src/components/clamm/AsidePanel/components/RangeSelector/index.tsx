import React, { useCallback, useEffect, useMemo, useState } from 'react';

import * as Slider from '@radix-ui/react-slider';
import { debounce } from 'lodash';

import useClammStore from 'hooks/clamm/useClammStore';
import useStrikesChainStore from 'hooks/clamm/useStrikesChainStore';

import generateStrikes from 'utils/clamm/generateStrikes';
import { cn } from 'utils/general';

const RangeSelector = () => {
  const { tick, selectedOptionsPool, markPrice, isTrade } = useClammStore();
  const { strikesChain, selectStrike, deselectStrike, selectedStrikes } =
    useStrikesChainStore();
  const [selectedStrikeIndices, setSelectedStrikeIndicies] = useState<number[]>(
    [],
  );

  const tokenInfo = useMemo(() => {
    if (!selectedOptionsPool)
      return {
        callTokenDecimals: 18,
        putTokenDecimals: 18,
        callTokenSymbol: '-',
        putTokenSymbol: '-',
      };

    const { callToken, putToken } = selectedOptionsPool;

    return {
      callTokenDecimals: callToken.decimals,
      putTokenDecimals: putToken.decimals,
      callTokenSymbol: callToken.symbol,
      putTokenSymbol: putToken.symbol,
    };
  }, [selectedOptionsPool]);

  const strikesBarGroup = useMemo(() => {
    if (!selectedOptionsPool) return [];
    const { callToken, putToken } = selectedOptionsPool;
    if (strikesChain.length === 0) return [];
    const MAX_BAR_HEIGHT = 300;
    const highestLiquidityUsd = strikesChain.reduce((prev, curr) => {
      return Math.max(prev, Number(curr.liquidityUsd));
    }, Number(strikesChain[0].liquidityUsd));

    return generateStrikes(
      tick,
      10 ** callToken.decimals,
      10 ** putToken.decimals,
      false,
      10,
    )
      .sort((a, b) => a.strike - b.strike)
      .map(({ strike, meta, type }) => {
        const liquidityUsd =
          strikesChain.find(
            ({ meta: { tickLower, tickUpper } }) =>
              tickLower === meta.tickLower && tickUpper === meta.tickUpper,
          )?.liquidityUsd ?? 0;
        return {
          meta,
          strike,
          type,
          barHeight:
            (MAX_BAR_HEIGHT * Number(liquidityUsd)) / highestLiquidityUsd,
        };
      });
  }, [strikesChain, tick, selectedOptionsPool]);

  const updateStrikesSelection = useCallback(() => {
    const selectedStrikes = strikesBarGroup.filter((_, index) => {
      return (
        index >= selectedStrikeIndices[0] && index <= selectedStrikeIndices[1]
      );
    });
    const unSelectedStrikes = strikesBarGroup.filter((_, index) => {
      return (
        index < selectedStrikeIndices[0] && index > selectedStrikeIndices[1]
      );
    });

    console.log(unSelectedStrikes);

    unSelectedStrikes.forEach(({ strike }) => {
      deselectStrike(strike);
    });

    selectedStrikes.forEach((strike) => {
      const isCall = strike.type === 'call';
      selectStrike(strike.strike, {
        amount0: 0,
        amount1: '0',
        isCall: isCall,
        strike: strike.strike,
        tokenDecimals: isCall
          ? tokenInfo.callTokenDecimals
          : tokenInfo.putTokenDecimals,
        tokenSymbol: isCall
          ? tokenInfo.callTokenSymbol
          : tokenInfo.putTokenSymbol,
        ttl: '24h',
        meta: {
          tickLower: Number(strike.meta.tickLower),
          tickUpper: Number(strike.meta.tickUpper),
          amount0: 0n,
          amount1: 0n,
        },
      });
    });
  }, [
    deselectStrike,
    selectedStrikeIndices,
    strikesBarGroup,
    selectStrike,
    tokenInfo.callTokenDecimals,
    tokenInfo.callTokenSymbol,
    tokenInfo.putTokenDecimals,
    tokenInfo.putTokenSymbol,
  ]);

  const sliderDefaultValue = useMemo(() => {
    return [strikesBarGroup.length / 4, strikesBarGroup.length / 2];
  }, [strikesBarGroup]);

  useEffect(() => {
    updateStrikesSelection();
  }, [updateStrikesSelection]);

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
