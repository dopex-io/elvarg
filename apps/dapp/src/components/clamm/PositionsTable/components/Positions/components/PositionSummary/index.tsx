import React from 'react';

import { cn, formatAmount } from 'utils/general';

type Props = {
  totalEarned: string;
  totalDeposit: string;
  totalWithdrawable: {
    token0: {
      symbol: string;
      amount: string;
    };
    token1: {
      symbol: string;
      amount: string;
    };
  };
};

const PositionsSummary = ({
  totalEarned,
  totalDeposit,
  totalWithdrawable,
}: Props) => {
  return (
    <div className="bg-cod-gray flex items-center justify-end space-x-[12px]">
      <div className="flex items-center justify-center space-x-[4px]">
        <span className="text-stieglitz text-xs">Total earned:</span>
        <span className="text-xs flex items-center justify-center space-x-[2px]">
          <span className="text-stieglitz">$</span>
          <span className={cn(Number(totalEarned) > 0 && 'text-up-only')}>
            {formatAmount(totalEarned, 3)}
          </span>
        </span>
      </div>
      <div className="flex items-center justify-center space-x-[4px]">
        <span className="text-stieglitz text-xs">Total deposit:</span>
        <span className="text-xs flex items-center justify-center space-x-[2px]">
          <span className="text-stieglitz">$</span>
          <span>{formatAmount(totalDeposit, 3)}</span>
        </span>
      </div>
      <div className="flex items-center justify-center space-x-[6px]">
        <span className="text-stieglitz text-xs">Total withdrawable:</span>
        <span className="text-xs flex items-center justify-center space-x-[2px]">
          <span>{formatAmount(totalWithdrawable.token0.amount, 3)}</span>
          <span className="text-stieglitz">
            {totalWithdrawable.token0.symbol}
          </span>
        </span>
        <span className="text-xs flex items-center justify-center space-x-[2px]">
          <span>{formatAmount(totalWithdrawable.token1.amount, 3)}</span>
          <span className="text-stieglitz">
            {totalWithdrawable.token1.symbol}
          </span>
        </span>
      </div>
    </div>
  );
};

export default PositionsSummary;
