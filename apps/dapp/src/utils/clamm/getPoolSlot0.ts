import { readContract } from 'wagmi/actions';

import { univ3PoolAbi } from './UniV3PoolAbi';

const getPoolSlot0 = async (poolAddress: `0x${string}`) => {
  const data = await readContract({
    abi: univ3PoolAbi,
    address: poolAddress,
    functionName: 'slot0',
    args: [],
  });

  return data;
};

export default getPoolSlot0;
