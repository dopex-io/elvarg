import { useCallback, useState } from 'react';
import { Address } from 'viem';

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
    ],
    staleTime: 10000,
  });

  const updateContractState = useCallback(async () => {
    if (!user || !data || !data[6].result) return;
    for (let i = 0; i < data.length; i++) {
      if (!data[i].result) return;
    }

    const _rewardTokens = data[6].result;

    const rewardsData = _rewardTokens.map((rt, index) => ({
      rate: data[7].result![index], // note: cannot be out of bounds as the length of rewardRates, rewardTokens, rewardTokenSymbols must all match at contract level
      symbol: data[8].result![index],
      address: rt,
    }));

    setContractData((prev) => ({ ...prev, rewardsData }));
  }, [data, user]);

  const updateUserData = useCallback(async () => {
    if (user == '0x' || !_userData) return;
    for (let i = 0; i < _userData.length; i++) {
      if (!_userData[i].result) return;
    }

    const combinedWeight = _userData[2].result || 0n;
    const totalLocked = _userData[1].result || 0n;
    const lockedStakes = _userData[0].result || [];

    setUserData((prev) => ({
      ...prev,
      combinedWeight,
      totalLocked,
      lockedStakes,
    }));
  }, [_userData, user]);

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
