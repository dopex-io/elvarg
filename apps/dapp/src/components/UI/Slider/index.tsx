'use client';

import { Range, Root, SliderProps, Thumb, Track } from '@radix-ui/react-slider';

type Props = {
  defaultValue?: number[];
  value: number[];
  max: number;
  min: number;
  step: number;
} & SliderProps;

const Slider = (props: Props) => {
  const { value, defaultValue = [0], max, min, step, ...rest } = props;

  return (
    <Root
      defaultValue={defaultValue}
      value={value}
      max={max}
      min={min}
      step={step}
      className="relative flex items-center w-full h-10"
      {...rest}
    >
      <Track className="relative bg-carbon flex-grow rounded-full h-[3px]">
        <Range className="absolute bg-frost rounded-full h-full" />
      </Track>
      <Thumb className="flex w-[15px] h-[15px] bg-wave-blue rounded-full cursor-grab" />
    </Root>
  );
};

export default Slider;
