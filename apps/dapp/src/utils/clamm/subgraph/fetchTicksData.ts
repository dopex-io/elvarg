import { Address } from 'viem';

import request from 'graphql-request';

import queryClient from 'queryClient';

import { getTickerLiquiditiesDocument } from 'graphql/clamm';

import { DOPEX_CLAMM_SUBGRAPH_API_URL } from 'constants/subgraphs';

export type TickDataRaw = {
  tickLower: number;
  tickUpper: number;
  liquidity: bigint;
  liquidityUsed: bigint;
  liquidityUnused: bigint;
  liquidityCompounded: bigint;
  liquidityWithdrawn: bigint;
  totalEarningsWithdrawn: bigint;
  totalShares: bigint;
  totalCallAssetsEarned: bigint;
  totalPutAssetsEarned: bigint;
};

async function fetchTicksdata(
  uniswapV3PoolAddress: Address,
): Promise<TickDataRaw[] | undefined> {
  try {
    const response = await queryClient.fetchQuery({
      queryKey: ['tickersLiquidityData'],
      queryFn: async () =>
        request(DOPEX_CLAMM_SUBGRAPH_API_URL, getTickerLiquiditiesDocument, {
          pool: uniswapV3PoolAddress.toLowerCase(),
          first: 1000,
        }),
    });

    return response.tickerLiquidities.map(
      ({
        liquidity,
        liquidityCompounded,
        liquidityUnused,
        liquidityUsed,
        liquidityWithdrawn,
        tickLower,
        tickUpper,
        totalCallAssetsEarned,
        totalEarningsWithdrawn,
        totalPutAssetsEarned,
        totalShares,
      }: TickDataRaw) => ({
        liquidity: BigInt(liquidity),
        liquidityCompounded: BigInt(liquidityCompounded),
        liquidityUnused: BigInt(liquidityUnused),
        liquidityUsed: BigInt(liquidityUsed),
        liquidityWithdrawn: BigInt(liquidityWithdrawn),
        tickLower: Number(tickLower),
        tickUpper: Number(tickUpper),
        totalCallAssetsEarned: BigInt(totalCallAssetsEarned),
        totalEarningsWithdrawn: BigInt(totalEarningsWithdrawn),
        totalPutAssetsEarned: BigInt(totalPutAssetsEarned),
        totalShares: BigInt(totalShares),
      }),
    );
  } catch (err) {
    console.error('[fetchTicksdata] failed to fetch ticks data');
    console.error(err);
    return;
  }
}

export default fetchTicksdata;
