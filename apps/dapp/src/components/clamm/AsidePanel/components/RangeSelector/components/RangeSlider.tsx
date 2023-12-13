import React from 'react';

import * as Slider from '@radix-ui/react-slider';

type Props = {
  setStrikeIndicies: (value: number[]) => void;
  strikeIndicies: number[];
  setUpperLimitStrike: (value: string) => void;
  setLowerLimitStrike: (value: string) => void;
  strikes: {
    meta: {
      tickLower: number;
      tickUpper: number;
    };
    strike: number;
    type: string;
    barHeight: number;
  }[];
};

const RangeSlider = ({
  setStrikeIndicies,
  setLowerLimitStrike,
  setUpperLimitStrike,
  strikeIndicies,
  strikes,
}: Props) => {
  return (
    <div className="w-full h-[10px] bg-umbra">
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        onValueChange={(e: number[]) => {
          setStrikeIndicies(e);
          setUpperLimitStrike(
            (strikes[e[1]] ?? { strike: 0 }).strike.toFixed(4),
          );
          setLowerLimitStrike(
            (strikes[e[0]] ?? { strike: 0 }).strike.toFixed(4),
          );
        }}
        value={strikeIndicies}
        step={1}
        minStepsBetweenThumbs={1}
        max={strikes.length - 1}
        min={0}
      >
        <Slider.Track className="bg-cod-gray relative grow rounded-full h-[3px]">
          <Slider.Range className="absolute bg-wave-blue rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb className=" border-stieglitz flex items-center justify-between text-[10px] font-mono outline-none cursor-pointer transition-all duration-500 w-[17px] h-[17px] rounded-2xl bg-white group z-1">
          <span className="hidden transition-flex duration-300 group-hover:flex bg-carbon px-2 h-[17px] rounded-sm">
            {(strikes[strikeIndicies[0]] ?? { strike: 0 }).strike.toFixed(4)}
          </span>
        </Slider.Thumb>
        <Slider.Thumb className=" border-stieglitz flex items-center justify-between text-[10px] font-mono outline-none cursor-pointer transition-all duration-500 w-[17px] h-[17px] rounded-2xl bg-white group z-1">
          <span className="hidden transition-flex duration-300 group-hover:flex bg-carbon px-2 h-[17px] rounded-sm r-[20px] absolute">
            {(strikes[strikeIndicies[1]] ?? { strike: 0 }).strike.toFixed(4)}
          </span>
        </Slider.Thumb>
      </Slider.Root>
    </div>
  );
};

export default RangeSlider;
