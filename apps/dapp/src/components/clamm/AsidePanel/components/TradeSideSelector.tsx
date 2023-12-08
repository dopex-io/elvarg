import React from 'react';

import useClammStore from 'hooks/clamm/useClammStore';
import useClammTransactionsStore from 'hooks/clamm/useClammTransactionsStore';
import useStrikesChainStore from 'hooks/clamm/useStrikesChainStore';

import { cn } from 'utils/general';

const TradeSideSelector = () => {
  const { setIsTrade, isTrade } = useClammStore();
  const { reset } = useStrikesChainStore();
  const { resetPurchases, resetDeposits } = useClammTransactionsStore();
  return (
    <div className="flex space-x-[12px] items-center justfiy-start w-full mb-[12px]">
      <span
        role="button"
        onClick={() => {
          setIsTrade(true);
          resetDeposits();
          resetPurchases();
          reset();
        }}
        className={cn('text-[14px]', isTrade ? 'text-white' : 'text-stieglitz')}
      >
        Trade
      </span>
      <span
        role="button"
        onClick={() => {
          resetDeposits();
          resetPurchases();
          setIsTrade(false);
          reset();
        }}
        className={cn(
          'text-[14px]',
          !isTrade ? 'text-white' : 'text-stieglitz',
        )}
      >
        Liquidity Provision
      </span>
    </div>
  );
};

export default TradeSideSelector;
