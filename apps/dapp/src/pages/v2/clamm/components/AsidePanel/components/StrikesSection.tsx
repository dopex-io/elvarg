import React from 'react';

import useStrikesChainStore from 'hooks/clamm/useStrikesChainStore';

import SelectedStrikeItem from './SelectedStrikeItem';
import StrikesList from './StrikesList';

const StrikesSection = () => {
  const { selectedStrikes } = useStrikesChainStore();

  return (
    <div className="bg-umbra rounded-b-lg w-full flex flex-col">
      <span className="text-stieglitz px-[12px] pt-[12px] font-medium">
        Options
      </span>
      <div className="flex flex-col w-full space-y-[8px] divide-y-4 divide-cod-gray">
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
