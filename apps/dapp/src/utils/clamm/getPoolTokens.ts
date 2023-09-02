import { Address } from 'viem';

import { readContract } from 'wagmi/actions';

import { univ3PoolAbi } from './UniV3PoolAbi';

const getPoolTokens = async (poolAddress: Address) => {
  const [tokenA, tokenB] = await Promise.all([
    readContract({
      abi: univ3PoolAbi,
      address: poolAddress,
      functionName: 'token0',
      args: [],
    }),
    readContract({
      abi: univ3PoolAbi,
      address: poolAddress,
      functionName: 'token1',
      args: [],
    }),
  ]);

  return [tokenA, tokenB];
};

export default getPoolTokens;
