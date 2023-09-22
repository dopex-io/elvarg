import { Address } from 'viem';

import request from 'graphql-request';

import queryClient from 'queryClient';

import { getStrikeDataDocument } from 'graphql/clamm';

import { DOPEX_CLAMM_SUBGRAPH_API_URL } from 'constants/subgraphs';

export type StrikesDataRaw = {
  totalShares: bigint;
  tickLower: number;
  tickUpper: number;
  totalLiquidity: bigint;
  liquidityUsed: bigint;
};

async function fetchStrikesData(
  uniswapV3PoolAddress: Address,
  first: number = 1000,
): Promise<StrikesDataRaw[]> {
  try {
    const response = await queryClient.fetchQuery({
      queryKey: ['clammPositionsStrikesData'],
      queryFn: async () =>
        request(DOPEX_CLAMM_SUBGRAPH_API_URL, getStrikeDataDocument, {
          poolAddress: uniswapV3PoolAddress.toLowerCase(),
          first: first,
        }),
    });

    return response.strikeDatas.map(
      ({
        totalShares,
        tickLower,
        tickUpper,
        totalLiquidity,
        usedLiquidity,
      }) => ({
        totalLiquidity: BigInt(totalLiquidity),
        liquidityUsed: BigInt(usedLiquidity),
        tickLower: Number(tickLower),
        tickUpper: Number(tickUpper),
        totalShares: BigInt(totalShares),
      }),
    );
  } catch (err) {
    console.error('[fetchTicksdata] failed to fetch ticks data');
    console.error(err);
    return [];
  }
}

export default fetchStrikesData;
