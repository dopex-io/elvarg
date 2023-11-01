import React from 'react';

import { Listbox } from '@dopex-io/ui';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

import useStrikesChainStore from 'hooks/clamm/useStrikesChainStore';

const StrikesList = () => {
  const { selectStrike, strikesChain, selectedStrikes } =
    useStrikesChainStore();
  return (
    <Listbox
      onChange={({ key, strikeData }: { key: number; strikeData: any }) => {
        selectStrike(key, {
          amount0: 0,
          amount1: 0,
          isCall: strikeData.type === 'call' ? true : false,
          strike: strikeData.strike,
          tokenDecimals: Number(strikeData.tokenDecimals),
          tokenSymbol: strikeData.tokenSymbol,
          ttl: '24h',
          meta: {
            tickLower: Number(strikeData.meta.tickLower),
            tickUpper: Number(strikeData.meta.tickUpper),
            amount0: 0n,
            amount1: 0n,
          },
        });
      }}
    >
      <div className="relative w-full px-[12px] pb-[12px] py-[4px]">
        <Listbox.Button className="bg-mineshaft text-white text-[14px]font-medium flex items-center justify-center space-x-[8px] w-full rounded-md px-[4px] py-[6px]">
          <span>{selectedStrikes.size} Selected</span>
          <ChevronDownIcon className="w-[18px] h-[18px] pt-[3px]" />
        </Listbox.Button>
        <Listbox.Options className="absolute w-[318px] rounded-md overflow-auto mt-1 border border-umbra drop-shadow-md divide-y-[0.1px] divide-carbon">
          {strikesChain &&
            strikesChain.map((strikeData, index) => (
              <Listbox.Option
                className="bg-mineshaft hover:cursor-pointer hover:bg-carbon z-10 py-[8px]"
                key={index}
                value={{ key: index, strikeData }}
              >
                <div className="flex items-center w-full justify-center">
                  <div className="flex items-center justfiy-center space-x-[4px]">
                    <span className="text-sm text-stieglitz">$</span>
                    <span className="text-sm text-white">
                      {strikeData.strike.toFixed(4)}
                    </span>
                  </div>
                </div>
              </Listbox.Option>
            ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
};

export default StrikesList;
