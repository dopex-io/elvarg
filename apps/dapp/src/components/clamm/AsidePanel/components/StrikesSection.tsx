import React from 'react';

import useStrikesChainStore from 'hooks/clamm/useStrikesChainStore';

import SelectedStrikeItem from './SelectedStrikeItem';
import StrikesList from './StrikesList';

const StrikesSection = () => {
  const { selectedStrikes } = useStrikesChainStore();

  return (
    <div className="bg-umbra rounded-b-lg w-full flex flex-col space-y-[10px]">
      <span className="flex w-full items-center justify-between text-stieglitz px-[12px] pt-[12px] font-medium text-[13px]">
        <span>Strikes</span>
        <span>Amount</span>
      </span>
      <div className="flex flex-col w-full space-y-[10px] px-[12px]">
        {Array.from(selectedStrikes).map(([strikeIndex, strikeData], index) => (
          <SelectedStrikeItem
            key={index}
            strikeData={strikeData}
            strikeIndex={strikeIndex}
          />
        ))}
      </div>
      <StrikesList />
    </div>
  );
};

export default StrikesSection;
