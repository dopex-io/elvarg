import React from 'react';

import { cn } from 'utils/general';

type Props = {
  selectedIndex: number;
  buyPositionsLength: number;
  lpPositionsLength: number;
  setSelectedIndex: (index: number) => void;
  resetPositions: () => void;
};

const PositionsTypeSelector = (props: Props) => {
  const {
    buyPositionsLength,
    lpPositionsLength,
    setSelectedIndex,
    selectedIndex,
    resetPositions,
  } = props;
  return (
    <div className="w-full flex space-x-[12px] items-center justify-start">
      <div
        role="button"
        onClick={() => {
          setSelectedIndex(0);
          resetPositions();
        }}
        className="flex space-x-[4px] items-center justify-center"
      >
        <span
          className={cn(
            'font-medium text-[12px]',
            selectedIndex === 0 ? 'text-white' : 'text-stieglitz',
          )}
        >
          Buy Positions
        </span>
        <span
          className={cn(
            'bg-cod-gray rounded-3xl text-[12px] px-[6px]',
            selectedIndex === 0 ? 'text-white' : 'text-stieglitz',
          )}
        >
          {buyPositionsLength}
        </span>
      </div>
      <div
        role="button"
        onClick={() => {
          setSelectedIndex(1);
          resetPositions();
        }}
        className="flex space-x-[4px] items-center justify-center"
      >
        <span
          className={cn(
            'font-medium text-[12px]',
            selectedIndex === 1 ? 'text-white' : 'text-stieglitz',
          )}
        >
          LP Positions
        </span>
        <span
          className={cn(
            'bg-cod-gray rounded-3xl text-[12px] px-[6px]',
            selectedIndex === 1 ? 'text-white' : 'text-stieglitz',
          )}
        >
          {lpPositionsLength}
        </span>
      </div>
      {/* <div
        role="button"
        onClick={() => setSelectedIndex(2)}
        className="flex space-x-[4px] items-center justify-center"
      >
        <span
          className={cx(
            'font-medium text-[12px]',
            selectedIndex === 2 ? 'text-white' : 'text-stieglitz',
          )}
        >
          History
        </span>
        <span className="bg-cod-gray rounded-3xl text-[12px] px-[6px] text-stieglitz"></span>
      </div> */}
    </div>
  );
};

export default PositionsTypeSelector;
