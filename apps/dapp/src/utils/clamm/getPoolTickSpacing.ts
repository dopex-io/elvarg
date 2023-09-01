import { Address } from 'viem';

import { readContract } from 'wagmi/actions';

import { univ3PoolAbi } from './UniV3PoolAbi';

const getPoolTickSpacing = async (poolAddress: Address): Promise<number> => {
  return (await readContract({
    abi: univ3PoolAbi,
    address: poolAddress,
    functionName: 'tickSpacing',
    args: [],
  })) as number;
};

export default getPoolTickSpacing;
