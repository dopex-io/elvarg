import { BigNumber } from 'ethers';

export interface LpData {
  ethReserveOfDpxWethPool: number;
  dpxReserveOfDpxWethPool: number;
  ethReserveOfRdpxWethPool: number;
  rdpxReserveOfRdpxWethPool: number;
  dpxPrice: number;
  rdpxPrice: number;
  rdpxWethLpTokenRatios: { rdpx: number; weth: number; lpPrice: number };
  dpxWethLpTokenRatios: { dpx: number; weth: number; lpPrice: number };
}

export interface Farm {
  stakingTokenSymbol: string;
  stakingTokenAddress: string;
  stakingRewardsAddress: string;
  status: 'ACTIVE' | 'RETIRED';
  type: 'SINGLE' | 'LP';
  rewardTokens: { symbol: string; address: string }[];
  version: number;
  newStakingRewardsAddress?: string;
}

export interface FarmData {
  TVL: number;
  APR: number;
  farmTotalSupply: BigNumber;
}

export interface UserData {
  userStakingTokenBalance: BigNumber;
  userStakingRewardsBalance: BigNumber;
  userRewardsEarned: BigNumber[];
}
