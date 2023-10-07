import { Address } from 'viem';

import request from 'graphql-request';

import queryClient from 'queryClient';

import { getOptionsPositionPurchasesForUserDocument } from 'graphql/clamm';

import { DOPEX_CLAMM_SUBGRAPH_API_URL } from 'constants/subgraphs';

export type OptionsPurchasesRaw = {
  tickLower: number;
  tickUpper: number;
  options: bigint;
  premium: bigint;
  expiry: bigint;
  isPut: boolean;
  blockNumber: bigint;
  timestamp: number;
  txHash: string;
};

async function getUserOptionsPurchases(
  uniswapV3PoolAddress: Address,
  userAddress: Address,
  first: number = 1000,
): Promise<OptionsPurchasesRaw[]> {
  try {
    const { optionsPositionPurchases } = await queryClient.fetchQuery({
      queryKey: ['clamm-purchases' + uniswapV3PoolAddress + '#' + userAddress],
      queryFn: async () =>
        request(
          DOPEX_CLAMM_SUBGRAPH_API_URL,
          getOptionsPositionPurchasesForUserDocument,
          {
            userAddress: userAddress.toLowerCase(),
            poolAddress: uniswapV3PoolAddress.toLowerCase(),
            first: first,
          },
        ),
    });

    return optionsPositionPurchases.map(
      ({
        tickLower,
        tickUpper,
        options,
        premium,
        expiry,
        isPut,
        blockNumber,
        timestamp,
        txHash,
      }) => ({
        tickLower: Number(tickLower),
        tickUpper: Number(tickUpper),
        options: BigInt(options),
        premium: BigInt(premium),
        expiry: BigInt(expiry),
        isPut: isPut,
        blockNumber: BigInt(blockNumber),
        timestamp: Number(timestamp),
        txHash: String(txHash),
      }),
    );
  } catch (err) {
    console.error('[getUserWritePositions] ', err);
    return [];
  }
}
export default getUserOptionsPurchases;
