import { Address } from 'viem';

import { PositionsManager__factory } from '@dopex-io/sdk';
import { readContract } from 'wagmi/actions';

import getWritePositionId from './getWritePositionId';

const getLiquidityAtTick = async (
  poolAddress: Address,
  tickLower: number,
  tickUpper: number,
) => {
  console.log(
    'ID',
    getWritePositionId(poolAddress, tickLower, tickUpper),
    getWritePositionId(poolAddress, tickLower, tickUpper).toString(),
  );
  return readContract({
    abi: PositionsManager__factory.abi,
    address: '0x2a9a9f63F13dD70816C456B2f2553bb648EE0F8F',
    functionName: 'tokenIds',
    args: [getWritePositionId(poolAddress, tickLower, tickUpper)],
  });
};

export default getLiquidityAtTick;
