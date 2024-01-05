import React from 'react';

import { cn, formatAmount } from 'utils/general';

type Props = {
  totalProfitUsd: number;
  totalPremiumUsd: number;
  totalOptions: number;
  callTokenSymbol: string;
};

const PositionSummary = ({
  callTokenSymbol,
  totalOptions,
  totalPremiumUsd,
  totalProfitUsd,
}: Props) => {
  return (
    <div className="flex items-center space-x-[6px]">
      <div className="flex items-center justify-center space-x-[4px]">
        <span className="text-stieglitz text-xs">Total profit:</span>
        <span className="text-xs flex items-center justify-center space-x-[2px]">
          <span className="text-stieglitz">$</span>
          <span className={cn(totalProfitUsd > 0 && 'text-up-only')}>
            {formatAmount(totalProfitUsd, 5)}
          </span>
        </span>
      </div>
      <div className="flex items-center justify-center space-x-[4px]">
        <span className="text-stieglitz text-xs">Total premium:</span>
        <span className="text-xs flex items-center justify-center space-x-[2px]">
          <span className="text-stieglitz">$</span>
          <span>{formatAmount(totalPremiumUsd, 5)}</span>
        </span>
      </div>
      <div className="flex items-center justify-center space-x-[4px]">
        <span className="text-stieglitz text-xs">Total size:</span>
        <span className="text-xs flex items-center justify-center space-x-[4px]">
          <span>{formatAmount(totalOptions, 5)}</span>
          <span className="text-stieglitz text-xs">{callTokenSymbol}</span>
        </span>
      </div>
    </div>
  );
};

export default PositionSummary;
