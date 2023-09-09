import { Address } from 'viem';

import request from 'graphql-request';

import queryClient from 'queryClient';

import {
  getOptionsPositionsForUserDocument,
  getWritePositionsForUserDocument,
} from 'graphql/clamm';

import { DOPEX_CLAMM_SUBGRAPH_API_URL } from 'constants/subgraphs';

export type WritePositionRaw = {
  liquidity: bigint;
  shares: bigint;
  tickLower: number;
  tickUpper: number;
  earned: bigint;
};
export type OptionsPositionRaw = {
  exercised: bigint;
  expiry: bigint;
  isPut: boolean;
  options: bigint;
  tickLower: number;
  tickUpper: number;
};

async function getUserPositions(
  user: Address,
  uniswapV3PoolAddress: Address,
): Promise<{
  writePositions: WritePositionRaw[];
  optionsPositions: OptionsPositionRaw[];
}> {
  const [{ optionsPositions }, { writePositions }] = await Promise.all([
    queryClient.fetchQuery({
      staleTime: 1000000,
      queryKey: ['userClammOptionsPositions', user.toLowerCase()],
      queryFn: async () =>
        request(
          DOPEX_CLAMM_SUBGRAPH_API_URL,
          getOptionsPositionsForUserDocument,
          {
            user: user.toLowerCase(),
            poolAddress: uniswapV3PoolAddress.toLowerCase(),
            first: 1000,
          },
        ),
    }),
    queryClient.fetchQuery({
      staleTime: 1000000,
      queryKey: ['userClammWritePositions', user.toLowerCase()],
      queryFn: async () =>
        request(
          DOPEX_CLAMM_SUBGRAPH_API_URL,
          getWritePositionsForUserDocument,
          {
            user: user.toLowerCase(),
            poolAddress: uniswapV3PoolAddress.toLowerCase(),
            first: 1000,
          },
        ),
    }),
  ]);

  const writePositionWithTypes = writePositions.map(
    ({ earned, liquidity, shares, tickLower, tickUpper }) => ({
      liquidity: BigInt(liquidity),
      shares: BigInt(shares),
      tickLower: Number(tickLower),
      tickUpper: Number(tickUpper),
      earned: BigInt(earned),
    }),
  );

  const optionsPositionsWithTypes = optionsPositions.map(
    ({ exercised, expiry, isPut, options, tickLower, tickUpper }) => ({
      exercised: BigInt(exercised),
      expiry: BigInt(expiry),
      isPut,
      options: BigInt(options),
      tickLower: Number(tickLower),
      tickUpper: Number(tickUpper),
    }),
  );

  return {
    optionsPositions: optionsPositionsWithTypes,
    writePositions: writePositionWithTypes,
  };
}

export default getUserPositions;
