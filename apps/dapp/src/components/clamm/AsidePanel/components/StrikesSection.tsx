import React from 'react';

import cx from 'classnames';

import useClammStore from 'hooks/clamm/useClammStore';
import useStrikesChainStore from 'hooks/clamm/useStrikesChainStore';

import SelectedStrikeItem from './SelectedStrikeItem';
import StrikesList from './StrikesList';

const StrikesSection = () => {
  const { selectedStrikes } = useStrikesChainStore();
  const { isTrade } = useClammStore();

  return (
    <div
      className={cx(
        'bg-umbra w-full flex flex-col space-y-[10px] rounded-b-lg',
        !isTrade && 'rounded-t-lg',
      )}
    >
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
