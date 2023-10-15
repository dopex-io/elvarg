import { Address } from 'viem';

import request from 'graphql-request';

import queryClient from 'queryClient';

import { getEarningsCheckpointsDocument } from 'graphql/clamm';

import { DOPEX_CLAMM_SUBGRAPH_API_URL } from 'constants/subgraphs';

export type EarningsCheckpointRaw = {
  liquidity: bigint;
  tickLower: number;
  tickUpper: number;
};

async function getEarningsCheckpoints(
  uniswapV3PoolAddress: Address,
  timestampGt: string,
  first: number = 1000,
): Promise<EarningsCheckpointRaw[]> {
  try {
    const { earningsCheckpoints } = await queryClient.fetchQuery({
      queryKey: ['earnings-checkpoints'],
      queryFn: async () =>
        request(DOPEX_CLAMM_SUBGRAPH_API_URL, getEarningsCheckpointsDocument, {
          poolAddress: uniswapV3PoolAddress.toLowerCase(),
          timestampGt: timestampGt,
          first: first,
        }),
    });

    if (earningsCheckpoints) {
      return earningsCheckpoints.map(({ liquidity, tickLower, tickUpper }) => ({
        liquidity: BigInt(liquidity),
        tickLower: Number(tickLower),
        tickUpper: Number(tickUpper),
      }));
    } else {
      console.error(
        '[getEarningsCheckpoints] Failed to get earnings checkpoints',
      );
      return [];
    }
  } catch (err) {
    console.error('[fetchTicksdata] Failed to get earnings checkpoints');
    console.error(err);
    return [];
  }
}
export default getEarningsCheckpoints;
