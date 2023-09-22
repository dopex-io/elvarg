import { Address } from 'viem';

import request from 'graphql-request';

import queryClient from 'queryClient';

import { getOptionsPositionExercisesForUserDocument } from 'graphql/clamm';

import { DOPEX_CLAMM_SUBGRAPH_API_URL } from 'constants/subgraphs';

import { OptionsPurchasesRaw } from './getUserOptionsPurchases';

async function getUserOptionsExercises(
  uniswapV3PoolAddress: Address,
  userAddress: Address,
  first: number = 1000,
): Promise<OptionsPurchasesRaw[]> {
  console.log('PARAMs', uniswapV3PoolAddress, userAddress);
  try {
    const { optionsPositionExercises } = await queryClient.fetchQuery({
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
      }) => ({
        tickLower: Number(tickLower),
        tickUpper: Number(tickUpper),
        options: BigInt(options),
        premium: BigInt(profit),
        expiry: BigInt(expiry),
        isPut: isPut,
        blockNumber: BigInt(blockNumber),
        timestamp: Number(timestamp),
      }),
    );
  } catch (err) {
    console.error('[getUserOptionsPositions] ', err);
    return [];
  }
}
export default getUserOptionsExercises;
