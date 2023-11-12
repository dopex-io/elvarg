import React from 'react';

import cx from 'classnames';

import useClammStore from 'hooks/clamm/useClammStore';
import useStrikesChainStore from 'hooks/clamm/useStrikesChainStore';

import { formatAmount } from 'utils/general';

import SelectedStrikeItem from './SelectedStrikeItem';
import StrikesList from './StrikesList';

const StrikesSection = () => {
  const { selectedStrikes } = useStrikesChainStore();
  const { isTrade, tokenBalances } = useClammStore();

  return (
    <div
      className={cx(
        'bg-umbra w-full flex flex-col space-y-[10px]',
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
      <div className="text-[13px] p-[13px] font-medium flex items-center justify-between">
        <span className="text-stieglitz">Balance</span>
        <span className="flex items-center justify-center space-x-[8px]">
          <span className="text-[13px] flex items-center justify-center space-x-[4px]">
            <span className="text-white">
              {formatAmount(tokenBalances.readableCallToken, 5)}
            </span>
            <span className="text-stieglitz">
              {tokenBalances.callTokenSymbol}
            </span>
          </span>{' '}
          <span className="text-[13px] flex items-center justify-center space-x-[4px]">
            <span className="text-white">
              {formatAmount(tokenBalances.readablePutToken, 5)}
            </span>
            <span className="text-stieglitz">
              {tokenBalances.putTokenSymbol}
            </span>
          </span>
        </span>
      </div>
    </div>
  );
};

export default StrikesSection;
