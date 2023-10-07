import { Address } from 'viem';

import request from 'graphql-request';

import queryClient from 'queryClient';

import { getWritePositionsBurnsForUserDocument } from 'graphql/clamm';

import { DOPEX_CLAMM_SUBGRAPH_API_URL } from 'constants/subgraphs';

export type WritePositionBurnRaw = {
  sqrtx96Price: bigint;
  tickLower: number;
  tickUpper: number;
  liquidity: bigint;
  shares: bigint;
  blockNumber: bigint;
  timestamp: number;
  txHash: string;
};

async function getUserWritePositionBurns(
  uniswapV3PoolAddress: Address,
  userAddress: Address,
): Promise<WritePositionBurnRaw[]> {
  try {
    const { writePositionBurns } = await queryClient.fetchQuery({
      queryKey: [
        'clamm-write-burns' + uniswapV3PoolAddress + '#' + userAddress,
      ],
      queryFn: async () =>
        request(
          DOPEX_CLAMM_SUBGRAPH_API_URL,
          getWritePositionsBurnsForUserDocument,
          {
            userAddress: userAddress.toLowerCase(),
            poolAddress: uniswapV3PoolAddress.toLowerCase(),
            first: 1000,
          },
        ),
    });

    return writePositionBurns.map(
      ({
        tickLower,
        tickUpper,
        liquidity,
        shares,
        blockNumber,
        timestamp,
        sqrtx96Price,
        txHash,
      }) => ({
        sqrtx96Price: BigInt(sqrtx96Price),
        tickLower: Number(tickLower),
        tickUpper: Number(tickUpper),
        liquidity: BigInt(liquidity),
        shares: BigInt(shares),
        blockNumber: BigInt(blockNumber),
        timestamp: Number(timestamp),
        txHash: String(txHash),
      }),
    );
  } catch (err) {
    console.error(err);
    return [];
  }
}

export default getUserWritePositionBurns;
