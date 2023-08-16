import { useState } from 'react';

import { ChevronDownIcon } from '@heroicons/react/24/solid';

type StrikeInformationProps = {
  strike: string;
  availableOptions: string;
  liquidity: string;
  earnings: string;
  utilization: string;
  iv: string;
  delta: string;
  vega: string;
  gamma: string;
  theta: string;
};

const StrikeInformation = (props: StrikeInformationProps) => {
  const [open, setOpen] = useState<Boolean>(false);

  console.log(open);
  return (
    <div
      className={`w-full bg-cod-gray rounded-md relative ${
        open ? 'h-[9rem]' : 'h-[5rem]'
      } transition-height duration-200 ease-in flex flex-col`}
    >
      <div
        onClick={() => {
          console.log('Clicked');
          setOpen((prev) => !prev);
        }}
        className="flex items-center justify-center p-4 cursor-pointer"
      >
        <div className="flex flex-col items-left justify-center flex-1 space-y-2">
          <span className="text-xs text-stieglitz">Strike</span>
          <span className="text-sm">
            <span className="text-stieglitz mr-1">$</span>
            {props.strike}
          </span>
        </div>
        <div className="flex flex-col items-left justify-center flex-1 space-y-2">
          <span className="text-xs text-stieglitz">Available Options</span>
          <span className="text-sm">{props.availableOptions}</span>
        </div>
        <div className="flex flex-col items-left justify-center flex-1 space-y-2">
          <span className="text-xs text-stieglitz">Liquidity</span>
          <span className="text-sm">
            <span className="text-stieglitz mr-1">$</span>
            {props.liquidity}
          </span>
        </div>
        <div className="flex flex-col items-left justify-center flex-1 space-y-2">
          <span className="text-xs text-stieglitz">Earnings</span>
          <span className="text-sm">
            <span className="text-stieglitz mr-1">$</span>
            {props.earnings}
          </span>
        </div>
        <div className="flex flex-col items-left justify-center flex-1 space-y-2">
          <span className="text-xs text-stieglitz">Utilization</span>
          <span className="text-sm">{props.utilization}</span>
        </div>
        <div className="flex flex-[0.15]">
          <ChevronDownIcon
            className={`text-stieglitz transition-rotate ease-in duration-200 ${
              open ? 'rotate-180' : ''
            }`}
          />
        </div>
      </div>
      <div
        className={`w-full flex flex-col items-center justify-center px-4 bg-umbra space-y-2 ${
          open ? 'opacity-full' : 'opacity-0'
        } transition-opacity duration-10 ease-out ${
          open ? 'delay-200' : 'delay=0'
        }`}
      >
        <div className="w-full h-full flex items-center justify-center py-4">
          <div className="flex flex-col items-left justify-center flex-1 space-y-2">
            <span className="text-sm">{props.iv}</span>
            <span className="text-xs text-stieglitz">IV</span>
          </div>
          <div className="flex flex-col items-left justify-center flex-1 space-y-2">
            <span className="text-sm">{props.delta}</span>
            <span className="text-xs text-stieglitz">Delta</span>
          </div>
          <div className="flex flex-col items-left justify-center flex-1 space-y-2">
            <span className="text-sm">{props.vega}</span>
            <span className="text-xs text-stieglitz">Vega</span>
          </div>
          <div className="flex flex-col items-left justify-center flex-1 space-y-2">
            <span className="text-sm">{props.gamma}</span>
            <span className="text-xs text-stieglitz">Gamma</span>
          </div>
          <div className="flex flex-col items-left justify-center flex-1 space-y-2">
            <span className="text-sm">{props.theta}</span>
            <span className="text-xs text-stieglitz">Theta</span>
          </div>
          <div className="flex flex-[0.15]"></div>
        </div>
      </div>
    </div>
  );
};

export default StrikeInformation;
