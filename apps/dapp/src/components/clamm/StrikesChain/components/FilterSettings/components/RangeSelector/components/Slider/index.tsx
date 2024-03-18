import React from 'react';

import { Bars3Icon } from '@heroicons/react/24/solid';
import * as Slider from '@radix-ui/react-slider';

type Props = {
  value: number[];
  max: number;
  onChange: (value: number[]) => void;
  lowerLimitStrike: number;
  upperLimitStrike: number;
};
const RangeSelectorSlider = ({
  value,
  onChange,
  max,
  upperLimitStrike,
  lowerLimitStrike,
}: Props) => {
  return (
    <Slider.Root
      className="relative flex items-center select-none touch-none w-full h-5"
      value={value}
      onValueChange={onChange}
      max={max}
    >
      <Slider.Track className="bg-stieglitz relative grow rounded-full h-[3px]">
        <Slider.Range className="absolute bg-wave-blue rounded-full h-full" />
      </Slider.Track>
      <Slider.Thumb className="absolute w-[3px] h-20 bottom-[-2px] right-[1px] bg-white hover:bg-none focus:outline-none group cursor-pointer">
        <div className="bg-white p-[2px] absolute right-[1px] bottom-[62px] rounded-l-md text-[12px] text-center flex items-center justify-center space-x-[4px]">
          <Bars3Icon className="rotate-90 text-carbon" height={14} width={14} />
        </div>
      </Slider.Thumb>
      <Slider.Thumb className="absolute w-[3px] h-20 bottom-[-2px] bg-white hover:bg-none  focus:outline-none group cursor-pointer">
        <div className="bg-white p-[2px] absolute left-[1px] bottom-[62px] rounded-r-md text-[12px] text-center flex items-center justify-center space-x-[4px]">
          <Bars3Icon className="rotate-90 text-carbon" height={14} width={14} />
        </div>
      </Slider.Thumb>
    </Slider.Root>
  );
};

export default RangeSelectorSlider;
