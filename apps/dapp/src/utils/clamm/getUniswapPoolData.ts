import { Address, zeroAddress } from 'viem';

import { UniswapV3Pool__factory } from '@dopex-io/sdk';
import { multicall } from 'wagmi/actions';

type UniswapV3PoolData = {
  sqrtX96Price: bigint;
  tick: number;
  tickSpacing: number;
  token0: Address;
  token1: Address;
};

async function getUniswapPoolData(pool: Address): Promise<UniswapV3PoolData> {
  const contractToCall = {
    address: pool,
    abi: UniswapV3Pool__factory.abi,
  };

  try {
    const data = await multicall({
      contracts: [
        {
          ...contractToCall,
          functionName: 'slot0',
        },
        {
          ...contractToCall,
          functionName: 'tickSpacing',
        },
        {
          ...contractToCall,
          functionName: 'token0',
        },
        {
          ...contractToCall,
          functionName: 'token1',
        },
      ],
    });
    return {
      sqrtX96Price: data[0].result ? BigInt(data[0].result[0]) : 0n,
      tick: data[0].result ? data[0].result[1] : 0,
      tickSpacing: data[1].result ?? 0,
      token0: data[2].result ?? zeroAddress,
      token1: data[3].result ?? zeroAddress,
    };
  } catch (err) {
    console.error(err);
    return {
      sqrtX96Price: 0n,
      tick: 0,
      tickSpacing: 0,
      token0: '0x0',
      token1: '0x0',
    };
  }
}

export default getUniswapPoolData;
