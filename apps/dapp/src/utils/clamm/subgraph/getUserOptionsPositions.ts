import { Address } from 'viem';

import request from 'graphql-request';

import queryClient from 'queryClient';

import { getOptionsPositionsForUserDocument } from 'graphql/clamm';

import { DOPEX_CLAMM_SUBGRAPH_API_URL } from 'constants/subgraphs';

export type OptionsPositionRaw = {
  expiry: bigint;
  isPut: boolean;
  options: bigint;
  tickLower: number;
  tickUpper: number;
  premium: bigint;
};

async function getUserOptionsPositions(
  uniswapV3PoolAddress: Address,
  userAddress: Address,
  first: number = 1000,
): Promise<OptionsPositionRaw[]> {
  try {
    const { optionsPositions } = await queryClient.fetchQuery({
      queryKey: ['clamm-options' + uniswapV3PoolAddress + '#' + userAddress],
      queryFn: async () =>
        request(
          DOPEX_CLAMM_SUBGRAPH_API_URL,
          getOptionsPositionsForUserDocument,
          {
            userAddress: userAddress.toLowerCase(),
            poolAddress: uniswapV3PoolAddress.toLowerCase(),
            first: first,
          },
        ),
    });

    return optionsPositions.map(
      ({ expiry, isPut, options, tickLower, tickUpper, premium }) => ({
        expiry: BigInt(expiry),
        isPut,
        options: BigInt(options),
        tickLower: Number(tickLower),
        tickUpper: Number(tickUpper),
        premium: BigInt(premium),
      }),
    );
  } catch (err) {
    console.error('[getUserOptionsPositions] ', err);
    return [];
  }
}
export default getUserOptionsPositions;
