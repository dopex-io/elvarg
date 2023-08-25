import { useCallback, useEffect, useState } from 'react';
import { formatUnits, getAddress } from 'viem';

import request from 'graphql-request';
import { Address, useAccount } from 'wagmi';

import queryClient from 'queryClient';

import { getSsovUserDataV2Document } from 'graphql/ssovs';

import { getERC20Info } from 'utils/contracts/getERC20Info';
import getSsovCheckpointData from 'utils/ssov/getSsovCheckpointData';
import getSsovEpochData from 'utils/ssov/getSsovEpochData';
import getSsovEpochTimes from 'utils/ssov/getSsovEpochTimes';
import getSsovSide from 'utils/ssov/getSsovSide';
import {
  getEarned,
  getRewardsInfo,
} from 'utils/ssov/getSsovStakingRewardsData';

import { DECIMALS_STRIKE, DECIMALS_TOKEN } from 'constants/index';
import { MARKETS } from 'constants/ssov/markets';
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
  name: string;
  amount: bigint;
  address: Address;
  isOption: boolean;
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
  epochSettlementPrice: number;
  expiry: number;
  side: string;
  vault: Address;
  optionToken: Address;
}

interface Args {
  market: string;
}

const useSsovPositions = (args: Args) => {
  const { market } = args;
  const { address } = useAccount();

  const [writePositions, setWritePositions] = useState<WritePosition[]>();
  const [buyPositions, setBuyPositions] = useState<BuyPosition[]>();
  const [loading, setLoading] = useState<boolean>(true);

  const updateSsovPositions = useCallback(async () => {
    setLoading(true);
    if (!address || !MARKETS[market]) {
      setLoading(false);
      return;
    }
    const ssovQueryResult = await queryClient.fetchQuery({
      queryKey: ['getSsovUserDataV2', address.toLowerCase()],
      queryFn: async () =>
        request(DOPEX_SSOV_SUBGRAPH_API_URL, getSsovUserDataV2Document, {
          user: address.toLowerCase(),
        }),
    });

    const ssovsFromMarket = MARKETS[market].vaults.map(
      (vault) => vault.address,
    );

    if (!ssovQueryResult.users[0]) {
      setLoading(false);
    }

    // Filter option token balances for ssov and flatten data
    const optionTokenBalances = ssovQueryResult.users[0].userOptionBalances
      .filter(
        (item) =>
          ssovsFromMarket.includes(getAddress(item.optionToken.ssov.id)) &&
          BigInt(item.balance) > 0n,
      )
      .map((item) => {
        return {
          balance: item.balance,
          epoch: item.optionToken.epoch,
          strike: item.optionToken.strike,
          ssovAddress: item.optionToken.ssov.id,
          optionTokenAddress: item.optionToken.id,
          side: item.optionToken.ssov.isPut ? 'Put' : 'Call',
          premium: 0,
        };
      });

    // Filter buy positions for ssov and flatten data
    const filteredBuyPositions = ssovQueryResult.users[0].userSSOVOptionBalance
      .filter((position) =>
        ssovsFromMarket.includes(getAddress(position.ssov.id)),
      )
      .map((item) => {
        return {
          balance: item.amount,
          epoch: item.epoch,
          strike: item.strike,
          ssovAddress: item.ssov.id,
          optionTokenAddress: '',
          side: item.ssov.isPut ? 'Put' : 'Call',
          premium: Number(formatUnits(item.premium, DECIMALS_TOKEN)),
        };
      });

    /**
     * Generate active positions
     * For a position to be active it must fulfill the following conditions:
     * - The user must have a positive option token balance for the epoch and strike
     * - The option must not have expired or if expired must be settleable
     */

    const optionTokenBalancesToDelete: number[] = [];

    let activePositions = filteredBuyPositions.map((buyPosition) => {
      // Find the corresponding option token balance
      const correspondingOptionTokenBalance = optionTokenBalances.find(
        (optionTokenBalance) =>
          optionTokenBalance.epoch === buyPosition.epoch &&
          optionTokenBalance.strike === buyPosition.strike,
      );

      const correspondingOptionTokenBalanceIndex =
        optionTokenBalances.findIndex(
          (optionTokenBalance) =>
            optionTokenBalance.epoch === buyPosition.epoch &&
            optionTokenBalance.strike === buyPosition.strike,
        );

      if (correspondingOptionTokenBalanceIndex !== -1)
        optionTokenBalancesToDelete.push(correspondingOptionTokenBalanceIndex);

      if (correspondingOptionTokenBalance) {
        if (correspondingOptionTokenBalance.balance !== '0') {
          return { ...buyPosition, ...correspondingOptionTokenBalance };
        } else return undefined;
      } else return undefined;
    });

    optionTokenBalancesToDelete.forEach((i) => {
      optionTokenBalances.splice(i, 1);
    });

    if (optionTokenBalances.length > 0) {
      activePositions = activePositions.concat(optionTokenBalances);
    }

    activePositions = activePositions.filter((item) => item);

    const _buyPositions = [];

    for (let i = 0; i < activePositions.length; i++) {
      const position = activePositions[i]!;

      const epochTimes = await getSsovEpochTimes({
        epoch: Number(position.epoch),
        ssovAddress: getAddress(position.ssovAddress),
      });

      const epochSettlementPrice = (
        await getSsovEpochData({
          epoch: Number(position.epoch),
          ssovAddress: getAddress(position.ssovAddress),
        })
      ).settlementPrice;

      // TODO: check if the option is not expired or if expired must be settleable

      _buyPositions[i] = {
        ...position,
        side: position.side,
        strike: Number(formatUnits(position.strike, DECIMALS_STRIKE)),
        epochSettlementPrice: Number(
          formatUnits(epochSettlementPrice, DECIMALS_STRIKE),
        ),
        epoch: Number(position.epoch),
        expiry: Number(epochTimes[1]),
        vault: getAddress(position.ssovAddress),
        optionToken: getAddress(position.optionTokenAddress),
      };
    }

    setBuyPositions(_buyPositions.sort((a, b) => b.expiry - a.expiry));

    const filteredWritePositions =
      ssovQueryResult.users[0].userOpenDeposits.filter((position) =>
        ssovsFromMarket.includes(getAddress(position.id.split('#')[0])),
      );

    const _writePositions = [];

    for (let i = 0; i < filteredWritePositions.length; i++) {
      const vault = filteredWritePositions[i];
      const _ssovAddress = getAddress(vault.id.split('#')[0]);

      const epochTimes = await getSsovEpochTimes({
        epoch: Number(vault.epoch),
        ssovAddress: _ssovAddress,
      });

      const checkpointData = await getSsovCheckpointData({
        positionId: Number(vault.id.split('#')[1]),
        ssovAddress: _ssovAddress,
      });

      const activeCollateralShare =
        (BigInt(vault.amount) * checkpointData.activeCollateral) /
        checkpointData.totalCollateral;

      const accruedPremium =
        checkpointData.activeCollateral === 0n
          ? 0n
          : (activeCollateralShare * checkpointData.accruedPremium) /
            checkpointData.activeCollateral;

      const earned = (await getEarned(
        _ssovAddress,
        BigInt(vault.id.split('#')[1]),
      )) as [Address[], bigint[]];

      let rewardsAccrued: RewardAccrued[] = [];

      for (let i = 0; i < earned[0].length; i++) {
        const erc20Info = await getERC20Info(earned[0][i]);
        const symbol = erc20Info.symbol as string;
        const _name = erc20Info.name as string;
        rewardsAccrued.push({
          symbol: symbol,
          name: _name,
          amount: earned[1][i],
          address: earned[0][i],
          isOption: _name.includes('SSOV V3 Options'),
        });
      }

      const rewardsInfo = (
        await getRewardsInfo(
          _ssovAddress,
          BigInt(vault.strike),
          BigInt(vault.epoch),
        )
      ).map((rewardInfo) => ({
        ...rewardInfo,
        canStake: !rewardsAccrued.length,
      }));

      // todo: replace with subgraph fetched isPut once synced
      const ssovSide = await getSsovSide(_ssovAddress);

      _writePositions[i] = {
        ...vault,
        strike: Number(formatUnits(vault.strike, DECIMALS_STRIKE)),
        balance: Number(formatUnits(vault.amount, 18)),
        epoch: Number(vault.epoch),
        side: ssovSide ? 'Put' : 'Call',
        tokenId: Number(vault.id.split('#')[1]),
        address: _ssovAddress,
        expiry: Number(epochTimes[1]),
        accruedPremium: Number(formatUnits(accruedPremium, DECIMALS_TOKEN)),
        rewardsAccrued,
        rewardsInfo,
      };
    }

    setWritePositions(_writePositions.sort((a, b) => b.expiry - a.expiry));

    setLoading(false);
  }, [address, market]);

  useEffect(() => {
    updateSsovPositions();
  }, [updateSsovPositions]);

  return {
    writePositions,
    buyPositions,
    // optionTokenBalances,
    isLoading: loading,
  };
};

export default useSsovPositions;
