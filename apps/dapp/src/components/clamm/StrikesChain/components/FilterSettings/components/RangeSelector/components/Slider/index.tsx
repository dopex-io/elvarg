import React from 'react';

import * as Slider from '@radix-ui/react-slider';
import * as Tooltip from '@radix-ui/react-tooltip';

import { formatAmount } from 'utils/general';

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
      className="relative flex items-center select-none touch-none w-[432px] h-5"
      value={value}
      onValueChange={onChange}
      max={max}
    >
      <Slider.Track className="bg-stieglitz relative grow rounded-full h-[3px]">
        <Slider.Range className="absolute bg-wave-blue rounded-full h-full" />
      </Slider.Track>
      <Slider.Thumb className="block w-3 h-3 bg-white rounded-[10px] focus:outline-none group">
        <div className="opacity-0 group-hover:opacity-100 w-[100px] absolute right-[0px] bg-mineshaft p-[2px] rounded-md text-[12px] text-center flex items-center space-x-[4px] justify-center">
          <p className="text-stieglitz">$</p>
          <p>{formatAmount(lowerLimitStrike, 4)}</p>
        </div>
      </Slider.Thumb>
      <Slider.Thumb className="block w-3 h-3 bg-white hover:bg-none rounded-[10px] focus:outline-none group">
        <div className="opacity-0 group-hover:opacity-100 w-[100px] bg-mineshaft p-[2px] rounded-md text-[12px] text-center flex items-center justify-center space-x-[4px]">
          <p className="text-stieglitz">$</p>
          <p>{formatAmount(upperLimitStrike, 4)}</p>
        </div>
      </Slider.Thumb>
    </Slider.Root>
  );
};

export default RangeSelectorSlider;
