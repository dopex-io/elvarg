import { Address } from 'viem';

import { SsovV3StakingRewards__factory } from '@dopex-io/sdk';
import { readContract } from 'wagmi/actions';

const STAKING_REWARDS_ADDRESS: Address =
  '0x9d5FA385cd988d3F148F53a9A5C87B7C8540B62d';

const getPositionId = async (ssov: Address, tokenId: bigint, epoch: bigint) => {
  const positionId = await readContract({
    abi: SsovV3StakingRewards__factory.abi,
    address: STAKING_REWARDS_ADDRESS,
    functionName: 'getId',
    args: [ssov, tokenId, epoch],
  });
  return positionId;
};

const getSsovStakingRewardsPosition = async ({
  ssov,
  tokenId,
  epoch,
}: {
  ssov: Address;
  tokenId: bigint;
  epoch: bigint;
}) => {
  const userId = await getPositionId(ssov, tokenId, epoch);
  const userPosition = await readContract({
    abi: SsovV3StakingRewards__factory.abi,
    address: STAKING_REWARDS_ADDRESS,
    functionName: 'getUserStakedPosition',
    args: [userId],
  });
  return userPosition;
};

export default getSsovStakingRewardsPosition;
