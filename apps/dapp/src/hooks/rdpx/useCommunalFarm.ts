import { useCallback, useState } from 'react';
import { Address, zeroAddress } from 'viem';

import { useContractRead, useContractReads } from 'wagmi';

import CommunalFarm from 'constants/rdpx/abis/CommunalFarm';
import addresses from 'constants/rdpx/addresses';
import initialContractStates from 'constants/rdpx/initialStates';

type Props = {
  user: Address;
};

type LockedStake = {
  kek_id: `0x${string}`;
  liquidity: bigint;
  start_timestamp: bigint;
  ending_timestamp: bigint;
  lock_multiplier: bigint;
};

type UserData = {
  lockedStakes: readonly LockedStake[];
  totalLocked: bigint;
  combinedWeight: bigint;
  unlockable: bigint;
  earnedTokens: readonly UserReward[];
};

type UserReward = {
  address: Address;
  symbol: string;
  earned: bigint;
};

type RewardInfo = {
  rate: bigint;
  symbol: string;
  address: Address;
};

type CommunalFarmState = {
  stakingToken: Address;
  totalLocked: bigint;
  rewardsData: RewardInfo[];
  periodFinish: bigint;
  lastUpdateTime: bigint;
  minLockTime: bigint;
  maxLockTime: bigint;
  multiplierRate: bigint;
};

const contractConfig = {
  abi: CommunalFarm,
  address: addresses.communalFarm,
};

const useCommunalFarm = (props: Props) => {
  const { user = '0x' } = props;

  const [userData, setUserData] = useState<UserData>(
    initialContractStates.communalFarm.userData,
  );
  const [contractData, setContractData] = useState<CommunalFarmState>(
    initialContractStates.communalFarm.state,
  );

  const { data, refetch } = useContractReads({
    contracts: [
      { ...contractConfig, functionName: 'stakingToken' },
      { ...contractConfig, functionName: 'totalLiquidityLocked' },
      { ...contractConfig, functionName: 'periodFinish' },

      { ...contractConfig, functionName: 'lastUpdateTime' },
      { ...contractConfig, functionName: 'lock_time_min' },
      { ...contractConfig, functionName: 'lock_time_for_max_multiplier' },

      { ...contractConfig, functionName: 'getAllRewardTokens' },
      { ...contractConfig, functionName: 'getAllRewardRates' },
      { ...contractConfig, functionName: 'getRewardSymbols' },

      { ...contractConfig, functionName: 'lockMultiplier', args: [1n] }, // multiplier for 1 second
    ],
    staleTime: 10000,
  });
  const { data: _userData, refetch: refetchUserData } = useContractReads({
    contracts: [
      {
        ...contractConfig,
        functionName: 'lockedStakesOf',
        args: [user],
      },
      {
        ...contractConfig,
        functionName: 'lockedLiquidityOf',
        args: [user],
      },
      {
        ...contractConfig,
        functionName: 'combinedWeightOf',
        args: [user],
      },
      {
        ...contractConfig,
        functionName: 'earned',
        args: [user],
      },
    ],
    staleTime: 10000,
  });

  const updateContractState = useCallback(async () => {
    if (!user || !data || data[6].status === 'failure') return;

    const stakingToken = data[0].result;
    const totalLocked = data[1].result;
    const periodFinish = data[2].result;
    const lastUpdateTime = data[3].result;
    const minLockTime = data[4].result;
    const maxLockTime = data[5].result;
    const _rewardTokens = data[6].result;
    const multiplierRate = data[9].result;

    if (
      !stakingToken ||
      totalLocked === undefined ||
      periodFinish === undefined ||
      lastUpdateTime === undefined ||
      minLockTime === undefined ||
      maxLockTime === undefined ||
      multiplierRate === undefined
    )
      return;

    const rewardsData = _rewardTokens.map((rt, index) => ({
      rate: data[7].result![index], // note: cannot be out of bounds as the length of rewardRates, rewardTokens, rewardTokenSymbols must all match at contract level
      symbol: data[8].result![index],
      address: rt,
    }));

    setContractData((prev) => ({
      ...prev,
      rewardsData,
      stakingToken,
      totalLocked,
      periodFinish,
      lastUpdateTime,
      minLockTime,
      maxLockTime,
      multiplierRate,
    }));
  }, [data, user]);

  const updateUserData = useCallback(async () => {
    if (user == '0x' || !_userData) return;
    for (let i = 0; i < _userData.length; i++) {
      if (!_userData[i].result) return;
    }

    const earned = _userData[3].result || [];
    const earnedTokens: UserReward[] = earned.map((amount, index) => ({
      address: contractData.rewardsData[index]?.address ?? zeroAddress,
      symbol: contractData.rewardsData[index]?.symbol
        ? contractData.rewardsData[index].symbol
        : 'N/A',
      earned: amount || 0n,
    }));

    const combinedWeight = _userData[2].result || 0n;
    const totalLocked = _userData[1].result || 0n;
    const lockedStakes =
      _userData[0].result?.filter((ls) => !!ls.liquidity) || []; // prune zero-data structs since contract deletes array entries in withdrawLocked()

    setUserData((prev) => ({
      ...prev,
      combinedWeight,
      totalLocked,
      lockedStakes,
      earnedTokens,
    }));
  }, [_userData, contractData.rewardsData, user]);

  return {
    refetchCommunalFarmState: refetch,
    communalFarmState: contractData,
    updateCommunalFarmState: updateContractState,

    refetchCommunalFarmUserData: refetchUserData,
    userCommunalFarmData: userData,
    updateUserCommunalFarmData: updateUserData,
  };
};

export default useCommunalFarm;
