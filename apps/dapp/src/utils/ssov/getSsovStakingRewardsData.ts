import { Address, encodePacked, keccak256 } from 'viem';

import { SsovV3StakingRewards__factory } from '@dopex-io/sdk';
import { readContract } from 'wagmi/actions';

const STAKING_REWARDS_ADDRESS: Address =
  '0x9d5FA385cd988d3F148F53a9A5C87B7C8540B62d';

export const getSsovStakingRewardsPosition = async (
  ssov: Address,
  tokenId: bigint,
  epoch: bigint
) => {
  const _id = keccak256(
    encodePacked(['address', 'uint256', 'uint256'], [ssov, tokenId, epoch])
  );
  const userPosition = await readContract({
    abi: SsovV3StakingRewards__factory.abi,
    address: STAKING_REWARDS_ADDRESS,
    functionName: 'getUserStakedPosition',
    args: [_id],
  });
  return userPosition;
};

export const getEarned = async (ssov: Address, positionId: bigint) => {
  const earned = await readContract({
    abi: SsovV3StakingRewards__factory.abi,
    address: STAKING_REWARDS_ADDRESS,
    functionName: 'earned',
    args: [ssov, positionId],
  });
  return earned;
};
