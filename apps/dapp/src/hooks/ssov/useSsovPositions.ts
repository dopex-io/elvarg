import { useCallback, useEffect, useState } from 'react';
import { formatUnits } from 'viem';

import request from 'graphql-request';
import { Address, useAccount } from 'wagmi';

import queryClient from 'queryClient';

import { getSsovUserDataDocument } from 'graphql/ssovs';

import { getTokenSymbol } from 'utils/contracts/getTokenSymbol';
import getSsovCheckpointData from 'utils/ssov/getSsovCheckpointData';
import getSsovEpochTimes from 'utils/ssov/getSsovEpochTimes';
import {
  getEarned,
  getRewardsInfo,
} from 'utils/ssov/getSsovStakingRewardsData';

import { DECIMALS_STRIKE, DECIMALS_TOKEN } from 'constants/index';
import { DOPEX_SSOV_SUBGRAPH_API_URL } from 'constants/subgraphs';

export interface RewardsInfo {
  rewardAmount: bigint;
  periodFinish: bigint;
  rewardRate: bigint;
  rewardRateStored: bigint;
  lastUpdateTime: bigint;
  totalSupply: bigint;
  decimalsPrecision: bigint;
  rewardToken: Address;
}

export interface RewardAccrued {
  symbol: string;
  amount: bigint;
}

export interface WritePosition {
  strike: number;
  balance: number;
  side: string;
  epoch: number;
  tokenId: number;
  address: string;
  id: string;
  expiry: number;
  accruedPremium: number;
  rewardsAccrued: RewardAccrued[];
  rewardsInfo: RewardsInfo[];
}

export interface BuyPosition {
  strike: number;
  premium: number;
  balance: string;
  epoch: number;
  expiry: number;
  side: string;
  id: string;
}

interface Args {
  ssovAddress: Address;
  isPut: boolean;
}

const useSsovPositions = (args: Args) => {
  const { ssovAddress, isPut } = args;
  const { address } = useAccount();

  const [writePositions, setWritePositions] = useState<WritePosition[]>();
  const [buyPositions, setBuyPositions] = useState<BuyPosition[]>();
  const [loading, setLoading] = useState<boolean>(true);

  const updateSsovPositions = useCallback(async () => {
    setLoading(true);
    if (!address || !ssovAddress) return;
    const ssovQueryResult = await queryClient.fetchQuery({
      queryKey: ['getSsovUserData', address.toLowerCase()],
      queryFn: async () =>
        request(DOPEX_SSOV_SUBGRAPH_API_URL, getSsovUserDataDocument, {
          user: address.toLowerCase(),
        }),
    });

    const filteredWritePositions =
      ssovQueryResult.users[0].userSSOVDeposit.filter(
        (position) =>
          position.ssov.id.toLowerCase() === ssovAddress.toLowerCase()
      );

    const _writePositions = [];

    for (let i = 0; i < filteredWritePositions.length; i++) {
      const vault = filteredWritePositions[i];

      const epochTimes = await getSsovEpochTimes({
        epoch: Number(vault.epoch),
        ssovAddress: ssovAddress as Address,
      });

      const checkpointData = await getSsovCheckpointData({
        positionId: Number(vault.id.split('#')[1]),
        ssovAddress: ssovAddress as Address,
      });

      const activeCollateralShare =
        (checkpointData.totalCollateral * checkpointData.activeCollateral) /
        checkpointData.totalCollateral;

      const accruedPremium =
        checkpointData.activeCollateral === 0n
          ? 0n
          : (activeCollateralShare * checkpointData.accruedPremium) /
            checkpointData.activeCollateral;

      const earned = (await getEarned(
        ssovAddress,
        BigInt(vault.id.split('#')[1])
      )) as [Address[], bigint[]];

      let rewardsAccrued: RewardAccrued[] = [];

      for (let i = 0; i < earned[0].length; i++) {
        const symbol = await getTokenSymbol(earned[0][i]);
        rewardsAccrued.push({
          symbol,
          amount: earned[1][i],
        });
      }

      const rewardsInfo = (
        await getRewardsInfo(
          ssovAddress,
          BigInt(vault.strike),
          BigInt(vault.epoch)
        )
      ).map((rewardInfo) => ({
        ...rewardInfo,
        canStake: !rewardsAccrued.length,
      }));

      _writePositions[i] = {
        ...vault,
        strike: Number(formatUnits(vault.strike, DECIMALS_STRIKE)),
        balance: Number(formatUnits(vault.amount, 18)),
        epoch: Number(vault.epoch),
        side: isPut ? 'Put' : 'Call',
        tokenId: Number(vault.id.split('#')[1]),
        address: vault.ssov.id.toLowerCase(),
        expiry: Number(epochTimes[1]),
        accruedPremium: Number(formatUnits(accruedPremium, DECIMALS_TOKEN)),
        rewardsAccrued,
        rewardsInfo,
      };
    }

    setWritePositions(_writePositions);

    const filteredBuyPositions =
      ssovQueryResult.users[0].userSSOVOptionBalance.filter((position) =>
        position.id.toLowerCase().includes(ssovAddress.toLowerCase())
      );

    const _buyPositions = [];

    for (let i = 0; i < filteredBuyPositions.length; i++) {
      const vault = filteredBuyPositions[i];

      const epochTimes = await getSsovEpochTimes({
        epoch: Number(vault.epoch),
        ssovAddress,
      });

      _buyPositions[i] = {
        ...vault,
        side: isPut ? 'Put' : 'Call',
        strike: Number(formatUnits(vault.strike, DECIMALS_STRIKE)),
        premium: Number(formatUnits(vault.premium, DECIMALS_TOKEN)),
        epoch: Number(vault.epoch),
        expiry: Number(epochTimes[1]),
        balance: vault.amount,
      };
    }

    setBuyPositions(_buyPositions);
    setLoading(false);
  }, [address, isPut, ssovAddress]);

  useEffect(() => {
    updateSsovPositions();
  }, [updateSsovPositions]);

  return {
    writePositions,
    buyPositions,
    isLoading: loading,
  };
};

export default useSsovPositions;
