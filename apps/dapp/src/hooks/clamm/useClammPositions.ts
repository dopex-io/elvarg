import { useCallback, useEffect, useState } from 'react';
import { formatUnits } from 'viem';

import request from 'graphql-request';
import { Address, useAccount } from 'wagmi';

import queryClient from 'queryClient';

import { getUserClammPositions } from 'graphql/clamm';

import { ClammBuyPosition, ClammWritePosition } from 'store/Vault/clamm';

import { MARKETS } from 'constants/clamm/markets';
import { DECIMALS_TOKEN } from 'constants/index';
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
  const address = '0x29ed22a9e56ee1813e6ff69fc6cac676aa24c09c';

  const [writePositions, setWritePositions] = useState<ClammWritePosition[]>();
  const [buyPositions, setBuyPositions] = useState<ClammBuyPosition[]>();
  const [loading, setLoading] = useState<boolean>(true);

  const updateClammPositions = useCallback(async () => {
    setLoading(true);
    if (!address || !MARKETS[market]) {
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

    // TODO: confirm pool ID
    const wantPoolId = MARKETS[market].uniswapPoolAddress;

    if (!queryResult.users[0] || !wantPoolId) {
      setLoading(false);
    }

    // strikeSymbol: string;
    // optionId: string;
    // strike: number;
    // tickLower: number;
    // tickUpper: number;
    // size: number;
    // isPut: boolean;
    const _buyPositions: ClammBuyPosition[] =
      queryResult.users[0].userBuyPositions
        .filter((position) => {
          const poolId = position.id.split('#')[0] as string;
          return (
            wantPoolId && poolId.toLowerCase() === wantPoolId.toLowerCase()
          );
        })
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
    setBuyPositions(_buyPositions);

    const _writePositions: ClammWritePosition[] =
      queryResult.users[0].userWritePositions
        .filter((position) => {
          const poolId = position.id.split('#')[0] as string;
          return (
            wantPoolId && poolId.toLowerCase() === wantPoolId.toLowerCase()
          );
        })
        .map((item) => {
          return {
            balance: item.amount,
            epoch: item.epoch,
          };
        });
    setWritePositions(_writePositions);

    setLoading(false);
  }, [address, market]);

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
