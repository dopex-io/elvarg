import React, { useMemo } from 'react';

import { Menu } from '@dopex-io/ui';

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
      };
    });
  }, [optionMarkets]);

  return (
    <div className="flex flex-col space-y-[8px]">
      {/* <span className="text-md font-normal text-stieglitz">Select Pair</span> */}
      <div className="flex space-x-[12px]">
        <div className="flex -space-x-4 self-center">
          <img
            className="w-[40px] h-[40px] z-10 border border-gray-500 rounded-full"
            src={`/images/tokens/${selectedPair.callToken.toLowerCase()}.svg`}
            alt={selectedPair.callToken.toLowerCase()}
          />
          <img
            className="w-[40px] h-[40px]"
            src={`/images/tokens/${selectedPair.putToken.toLowerCase()}.svg`}
            alt={selectedPair.putToken.toLowerCase()}
          />
        </div>
        <Menu
          color="mineshaft"
          dropdownVariant="icon"
          setSelection={updateSelectedPairData}
          selection={selectedPair}
          data={validPairs.filter(
            ({ textContent }) => textContent !== selectedPair.textContent,
          )}
          showArrow
        />
      </div>
    </div>
  );
};

export default PairSelector;
