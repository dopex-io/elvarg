import React from 'react';

import * as Slider from '@radix-ui/react-slider';

type Props = {
  min: number;
  max: number;
  value: number[];
  onChange: (v: number[]) => void;
  steps: number;
  labels: (number | string)[];
};

const ScaledSlider = ({ min, value, max, onChange, steps, labels }: Props) => {
  return (
    <Slider.Root
      className="relative flex items-center select-none touch-none w-[120px] h-8"
      value={value}
      min={min}
      onValueChange={onChange}
      step={steps}
      max={max}
    >
      <Slider.Track className="bg-stieglitz relative grow rounded-full h-[3px] flex flex-col space-y-[8px]">
        <Slider.Range className="absolute bg-wave-blue rounded-full h-full" />
        <div className="flex items-center text-[10px] text-stieglitz justify-between">
          {labels.map((v, i) => (
            <span key={i}>{v}</span>
          ))}
        </div>
      </Slider.Track>
      <Slider.Thumb className="block w-3 h-3 bg-white hover:bg-none focus:outline-none rounded-lg"></Slider.Thumb>
    </Slider.Root>
  );
};

export default ScaledSlider;
