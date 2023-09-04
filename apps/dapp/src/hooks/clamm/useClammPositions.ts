import { useCallback, useEffect, useState } from 'react';
import { formatEther } from 'viem';

import request from 'graphql-request';
import { Address } from 'wagmi';

import queryClient from 'queryClient';

import { getUserClammPositions } from 'graphql/clamm';

import { useBoundStore } from 'store';
import {
  ClammBuyPosition,
  ClammPair,
  ClammWritePosition,
} from 'store/Vault/clamm';

import getPoolSlot0 from 'utils/clamm/getPoolSlot0';
import splitMarketPair from 'utils/clamm/splitMarketPair';

import { CHAINS } from 'constants/chains';
import { MARKETS } from 'constants/clamm/markets';
import { DOPEX_CLAMM_SUBGRAPH_API_URL } from 'constants/subgraphs';

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

interface Args {
  market: string;
}

const useClammPositions = (args: Args) => {
  const { market } = args;
  //   const { address } = useAccount();
  const ARC = '0x2a9a9f63f13dd70816c456b2f2553bb648ee0f8f';
  const CARROT = '0x29ed22a9e56ee1813e6ff69fc6cac676aa24c09c';
  const address = CARROT;
  const { selectedPair, chainId } = useBoundStore();

  const [writePositions, setWritePositions] = useState<ClammWritePosition[]>();
  const [buyPositions, setBuyPositions] = useState<ClammBuyPosition[]>();
  const [loading, setLoading] = useState<boolean>(true);

  const updateClammPositions = useCallback(async () => {
    setLoading(true);
    if (!address || MARKETS[market as ClammPair] === undefined) {
      setLoading(false);
      return;
    }
    const queryResult = (await queryClient.fetchQuery({
      queryKey: ['getUserClammPositions', address.toLowerCase()],
      queryFn: async () =>
        request(DOPEX_CLAMM_SUBGRAPH_API_URL, getUserClammPositions, {
          user: address.toLowerCase(),
        }),
    })) as any;

    const poolAddress = MARKETS[market as ClammPair].uniswapPoolAddress;

    if (!queryResult.users[0] || !poolAddress) {
      setLoading(false);
    }

    const slot0 = await getPoolSlot0(poolAddress);
    // @ts-ignore
    const currentTick = slot0[1];

    const { underlyingTokenSymbol, collateralTokenSymbol } =
      splitMarketPair(selectedPair);

    const decimals0 = CHAINS[chainId].tokenDecimals[underlyingTokenSymbol];
    const decimals1 = CHAINS[chainId].tokenDecimals[collateralTokenSymbol];

    const _buyPositions: ClammBuyPosition[] =
      queryResult.users[0].userBuyPositions
        .filter((position) => {
          const poolId = position.id.split('#')[0] as string;
          return (
            poolAddress && poolId.toLowerCase() === poolAddress.toLowerCase()
          );
        })
        .map((item) => {
          const isPut = currentTick < item.lowerTick;
          const strike = isPut
            ? ((1 / 1.0001 ** item.tickLower) * 10 ** decimals0) /
              10 ** decimals1
            : ((1 / 1.0001 ** item.tickUpper) * 10 ** decimals0) /
              10 ** decimals1;
          return {
            strikeSymbol: market,
            optionId: item.id,
            strike: Number(strike),
            tickLower: item.tickLower,
            tickUpper: item.tickUpper,
            size: item.options,
            isPut: isPut,
            expiry: item.expiry,
          };
        });
    setBuyPositions(_buyPositions);

    const _writePositions: ClammWritePosition[] =
      queryResult.users[0].userWritePositions
        .filter((position) => {
          const poolId = position.id.split('#')[0] as string;
          return (
            poolAddress && poolId.toLowerCase() === poolAddress.toLowerCase()
          );
        })
        .map((item) => {
          const isPut = currentTick < item.lowerTick;
          const strike = isPut
            ? ((1 / 1.0001 ** item.tickLower) * 10 ** decimals0) /
              10 ** decimals1
            : ((1 / 1.0001 ** item.tickUpper) * 10 ** decimals0) /
              10 ** decimals1;
          return {
            strikeSymbol: market,
            optionId: item.id,
            strike: Number(strike),
            tickLower: item.tickLower,
            tickUpper: item.tickUpper,
            size: formatEther(item.size),
            isPut: isPut,
            earned: 0,
            premiums: 0,
          };
        });
    setWritePositions(_writePositions);

    setLoading(false);
  }, [address, chainId, market, selectedPair]);

  useEffect(() => {
    updateClammPositions();
  }, [updateClammPositions]);

  return {
    writePositions,
    buyPositions,
    isLoading: loading,
  };
};

export default useClammPositions;
