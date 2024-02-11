import React from 'react';
import { checksumAddress } from 'viem';

import { Skeleton } from '@dopex-io/ui';

import useMerklRewards from 'hooks/clamm/useMerklRewards';

import { formatAmount } from 'utils/general';

import { TOKENS } from 'constants/tokens';

const RewardsApr = () => {
  const optionsMarketAddress = '0x764fA09d0B3de61EeD242099BD9352C1C61D3d27';
  const primePool = '0xC31E54c7a869B9FcBEcc14363CF510d1c41fa443';
  const chainId = 42161;
  const userAddress = '0x764fA09d0B3de61EeD242099BD9352C1C61D3d27';

  const { avgAPR, isLoading } = useMerklRewards({
    user: userAddress,
    chainId: chainId,
    rewardToken: TOKENS[chainId].find(
      (token) => token.symbol.toUpperCase() === 'ARB',
    ),
    pool: checksumAddress(primePool),
  });

  return (
    <div className="flex flex-col items-start">
      <div className="flex items-center space-x-[4px]">
        {isLoading ? (
          <Skeleton height={13} width={80} />
        ) : (
          <div className="text-[13px] md:text-[16px]">
            {formatAmount(avgAPR, 3)}
          </div>
        )}
        <div className="text-stieglitz">%</div>
      </div>
      <div className="text-[16px] text-stieglitz font-semibold">
        Avg. Rewards APR
      </div>
    </div>
  );
};

export default RewardsApr;
