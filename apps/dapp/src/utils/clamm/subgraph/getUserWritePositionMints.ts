import { Address } from 'viem';

import request from 'graphql-request';

import queryClient from 'queryClient';

import { getWritePositionsMintsForUserDocument } from 'graphql/clamm';

import { DOPEX_CLAMM_SUBGRAPH_API_URL } from 'constants/subgraphs';

export type WritePositionMintRaw = {
  sqrtx96Price: bigint;
  tickLower: number;
  tickUpper: number;
  liquidity: bigint;
  shares: bigint;
  blockNumber: bigint;
  timestamp: number;
  txHash: string;
};

async function getUserWritePositionMints(
  uniswapV3PoolAddress: Address,
  userAddress: Address,
): Promise<WritePositionMintRaw[]> {
  try {
    const { writePositionMints } = await queryClient.fetchQuery({
      queryKey: [
        'clamm-write-mints' + uniswapV3PoolAddress + '#' + userAddress,
      ],
      queryFn: async () =>
        request(
          DOPEX_CLAMM_SUBGRAPH_API_URL,
          getWritePositionsMintsForUserDocument,
          {
            userAddress: userAddress.toLowerCase(),
            poolAddress: uniswapV3PoolAddress.toLowerCase(),
            first: 1000,
          },
        ),
    });

    return writePositionMints.map(
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

export default getUserWritePositionMints;
