import React from 'react';

import useClammStore from 'hooks/clamm/useClammStore';

import { formatAmount } from 'utils/general';

const TokenBalances = () => {
  const { tokenBalances } = useClammStore();
  return (
    <div className="text-[13px]  font-medium flex items-center justify-between">
      <span className="text-stieglitz">Balance</span>
      <span className="flex items-center justify-center space-x-[8px]">
        <span className="text-[13px] flex items-center justify-center space-x-[4px]">
          <span className="text-white">
            {formatAmount(tokenBalances.readableCallToken, 5)}
          </span>
          <span className="text-stieglitz">
            {tokenBalances.callTokenSymbol}
          </span>
        </span>
        <span className="text-[13px] flex items-center justify-center space-x-[4px]">
          <span className="text-white">
            {formatAmount(tokenBalances.readablePutToken, 5)}
          </span>
          <span className="text-stieglitz">{tokenBalances.putTokenSymbol}</span>
        </span>
      </span>
    </div>
  );
};

export default TokenBalances;
