import { Address } from 'viem';

import request from 'graphql-request';

import queryClient from 'queryClient';

import { getWritePositionsForUserDocument } from 'graphql/clamm';

import { DOPEX_CLAMM_SUBGRAPH_API_URL } from 'constants/subgraphs';

export type WritePositionRaw = {
  liquidity: bigint;
  shares: bigint;
  tickLower: number;
  tickUpper: number;
  timestamp: number;
};

async function getUserWritePositions(
  uniswapV3PoolAddress: Address,
  userAddress: Address,
  first: number = 1000,
) {
  try {
    const { writePositions } = await queryClient.fetchQuery({
      queryKey: ['clamm-write' + uniswapV3PoolAddress + '#' + userAddress],
      queryFn: async () =>
        request(
          DOPEX_CLAMM_SUBGRAPH_API_URL,
          getWritePositionsForUserDocument,
          {
            userAddress: userAddress.toLowerCase(),
            poolAddress: uniswapV3PoolAddress.toLowerCase(),
            first: first,
          },
        ),
    });

    return writePositions.map(
      ({ liquidity, shares, tickLower, tickUpper, timestamp }) => ({
        liquidity: BigInt(liquidity),
        shares: BigInt(shares),
        tickLower: Number(tickLower),
        tickUpper: Number(tickUpper),
        timestamp: Number(timestamp),
      }),
    );
  } catch (err) {
    console.error('[getUserWritePositions] ', err);
    return [];
  }
}

export default getUserWritePositions;