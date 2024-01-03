import React, { ChangeEvent, useCallback, useState } from 'react';

import * as ToggleGroup from '@radix-ui/react-toggle-group';

type Props = {
  threshold: number[];
  setThreshold: (v: number[]) => void;
};
const LiquidityThresholdInput = ({ threshold, setThreshold }: Props) => {
  const [type, setType] = useState(threshold[1] === 0 ? 'USD' : 'Options');
  const handleOnChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setThreshold([parseFloat(e.target.value), type === 'USD' ? 0 : 1]);
    },
    [setThreshold, type],
  );

  return (
    <div className="flex flex-col justify-between space-y-[6px]">
      <div className="flex flex-col">
        <p className="text-[12px] font-medium">Liquidity Threshold</p>
        <p className="text-[10px] font-medium text-stieglitz">
          Use a threshold value to filter out strikes based on liquidity
        </p>
      </div>
      <div className="flex items-center space-x-[6px]">
        <ToggleGroup.Root
          type="single"
          value={threshold[1] === 0 ? 'USD' : 'Options'}
          defaultValue={threshold[1] === 0 ? 'USD' : 'Options'}
          onValueChange={(v) => {
            setThreshold([threshold[0], v === 'USD' ? 0 : 1]);
            setType(v);
          }}
          className="p-[4px] space-x-[12px] bg-carbon flex items-center justify-center rounded-md"
        >
          {['USD', 'Options'].map((value) => (
            <ToggleGroup.Item
              className="w-fit h-[16px] text-stieglitz data-[state=on]:text-white rounded-sm"
              value={value}
              key={`bundle-selector-item-${value}`}
            >
              <p className="text-[12px] w-full">
                {value === 'USD' ? 'USD' : 'Options'}
              </p>
            </ToggleGroup.Item>
          ))}
        </ToggleGroup.Root>
        <input
          className="bg-cod-gray rounded-md border-carbon border text-[13px] p-[4px] text-right text-white default-stieglitz placeholder-stieglitz w-fit focus:outline-none"
          type="number"
          onChange={handleOnChange}
          placeholder="0"
          defaultValue={threshold[0] ?? 0}
        />
      </div>
    </div>
  );
};

export default LiquidityThresholdInput;
