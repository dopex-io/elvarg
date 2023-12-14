import React from 'react';

import { cn } from 'utils/general';

type Props = {
  strikes: {
    meta: {
      tickLower: number;
      tickUpper: number;
    };
    strike: number;
    type: string;
    barHeight: number;
  }[];
  strikeIndices: number[];
  markPrice: number;
};
const RangeGraph = ({ markPrice, strikes, strikeIndices }: Props) => {
  return (
    <>
      <div className="flex  w-full h-[120px] bg-umbra relative p-[4px]">
        {strikes.map(({ barHeight, strike }, index) => {
          const isWithinLimits =
            index >= strikeIndices[0] && index <= strikeIndices[1];
          return (
            <svg
              key={index}
              className={cn(
                'border-wave-blue',
                index === strikeIndices[0] && 'border-l-2',
                index === strikeIndices[1] && 'border-r-2',
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
            {strikes[
              Math.floor(strikes.length / 6) * (index + 1)
            ]?.strike.toFixed(4)}
          </span>
        ))}
      </div>
    </>
  );
};

export default RangeGraph;
