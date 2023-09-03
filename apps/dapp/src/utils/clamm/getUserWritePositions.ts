import { Address, encodePacked, keccak256 } from 'viem';

import getWritePosition from './getWritePosition';
import getWritePositionId from './getWritePositionId';

async function getUserWritePositions(user: Address, uniswapPool: Address) {
  // Deposit 1000 DUSDC
  // https://arbiscan.io/tx/0xc150b6f375fb79fbf171164a55d8cf45258b11c73dab393508d727de1be36005
  // info from events
  // tickLower: 277500
  // tickUpper: 277510

  const putWritePositionId = getWritePositionId(uniswapPool, 277500, 277510);

  // Deposit 100 DARB
  // https://arbiscan.io/tx/0xc150b6f375fb79fbf171164a55d8cf45258b11c73dab393508d727de1be36005
  // Info from events
  // lowerTick: 277460
  // upperTick: 277470
  const callWritePositionId = getWritePositionId(uniswapPool, 277500, 277510);

  // const positions = await Promise.all([
  //   getWritePosition(putWritePositionId),
  //   getWritePosition(callWritePositionId),
  // ]);

  return positions;
}

export default getUserWritePositions;
