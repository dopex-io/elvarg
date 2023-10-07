import { Address } from 'viem';

import request from 'graphql-request';

import queryClient from 'queryClient';

import { getOptionsPositionExercisesForUserDocument } from 'graphql/clamm';

import { DOPEX_CLAMM_SUBGRAPH_API_URL } from 'constants/subgraphs';

export type OptionsExercisesRaw = {
  tickLower: number;
  tickUpper: number;
  options: bigint;
  sqrtx96Price: bigint;
  profit: bigint;
  expiry: bigint;
  isPut: boolean;
  blockNumber: bigint;
  timestamp: number;
  txHash: string;
};

async function getUserOptionsExercises(
  uniswapV3PoolAddress: Address,
  userAddress: Address,
  first: number = 1000,
): Promise<OptionsExercisesRaw[]> {
  try {
    const { optionsPositionExercises } = await queryClient.fetchQuery({
      queryKey: ['clamm-exercises' + uniswapV3PoolAddress + '#' + userAddress],
      queryFn: async () =>
        request(
          DOPEX_CLAMM_SUBGRAPH_API_URL,
          getOptionsPositionExercisesForUserDocument,
          {
            userAddress: userAddress.toLowerCase(),
            poolAddress: uniswapV3PoolAddress.toLowerCase(),
            first: first,
          },
        ),
    });

    return optionsPositionExercises.map(
      ({
        tickLower,
        tickUpper,
        options,
        profit,
        expiry,
        isPut,
        blockNumber,
        timestamp,
        txHash,
        sqrtx96Price,
      }) => ({
        tickLower: Number(tickLower),
        tickUpper: Number(tickUpper),
        options: BigInt(options),
        profit: BigInt(profit),
        expiry: BigInt(expiry),
        isPut: isPut,
        blockNumber: BigInt(blockNumber),
        timestamp: Number(timestamp),
        txHash: String(txHash),
        sqrtx96Price: BigInt(sqrtx96Price),
      }),
    );
  } catch (err) {
    console.error('[getUserOptionsPositions] ', err);
    return [];
  }
}
export default getUserOptionsExercises;
