import React, { useMemo } from 'react';

import { Listbox } from '@dopex-io/ui';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import useClammStore from 'hooks/clamm/useClammStore';

import { Pair } from 'types/clamm';

interface Props {
  selectedPair: Pair;
  updateSelectedPairData: (T: Pair) => void;
}

const PairSelector = (props: Props) => {
  const { selectedPair, updateSelectedPairData } = props;

  const { optionMarkets } = useClammStore();

  const validPairs = useMemo(() => {
    if (!optionMarkets || optionMarkets.size === 0) return [];
    return Array.from(optionMarkets, ([_, value]) => {
      const pairNameSplit = value.pairName.split('-');
      return {
        textContent: `${pairNameSplit[0]} - ${pairNameSplit[1]}`,
        callToken: value.callToken.symbol,
        putToken: value.putToken.symbol,
        deprecated: value.deprecated,
      };
    });
  }, [optionMarkets]);

  return (
    <div className="flex flex-col space-y-[8px]">
      <div className="flex space-x-[12px]">
        <div className="flex -space-x-4 self-center">
          <img
            className="w-[40px] h-[40px] z-12 border border-gray-500 rounded-full"
            src={`/images/tokens/${selectedPair.callToken.toLowerCase()}.svg`}
            alt={selectedPair.callToken.toLowerCase()}
          />
          <img
            className="w-[40px] h-[40px]"
            src={`/images/tokens/${selectedPair.putToken.toLowerCase()}.svg`}
            alt={selectedPair.putToken.toLowerCase()}
          />
        </div>
        <Listbox value={selectedPair} onChange={updateSelectedPairData}>
          <div className="relative">
            <Listbox.Button className="bg-mineshaft px-[12px] py-[11px] w-[150px] rounded-lg flex items-center justify-center space-x-[6px] font-medium">
              <span className="text-[13px]">{selectedPair.textContent}</span>
              <ChevronDownIcon height={18} width={18} />
            </Listbox.Button>
            <Listbox.Options className="w-[170px] absolute flex flex-col justify-center h-fit  rounded-md mt-1 border border-cod-gray drop-shadow-md divide-y-[0.1px] divide-carbon bg-umbra">
              {validPairs
                .filter(
                  ({ textContent }) => textContent !== selectedPair.textContent,
                )
                .map((pair, index) => (
                  <Listbox.Option
                    value={pair}
                    className="text-[13px] flex items-center space-x-[4px] hover:bg-mineshaft cursor-pointer px-[12px] py-[6px]"
                    key={index}
                  >
                    <span>{pair.textContent}</span>
                    {pair.deprecated && (
                      <span className="border rounded-lg text-[9px] px-[4px] py-[2px] border-jaffa bg-jaffa bg-opacity-30 text-jaffa">
                        Legacy
                      </span>
                    )}
                  </Listbox.Option>
                ))}
            </Listbox.Options>
          </div>
        </Listbox>
      </div>
    </div>
  );
};

export default PairSelector;
