import { Address } from 'viem';

import getOptionsPosition from './getOptionsPosition';
import getOptionsId from './getOptionsPositionId';
import getId from './getWritePositionId';

export async function getUserOptionPositions(user: Address, pool: Address) {
  // Call position https://arbiscan.io/tx/0xd89fb4eb4fd085d7afba5665cb4b4781dc895cb0e1b25adbef3531a3a6fa3f98
  // Info from events
  // Tick lower: 277460
  // Tick Upper: 277470
  // id should be: 20819020847627533227863465126276573274895648100294514601637106900808685889968
  const callOptionId = getOptionsId(
    getId(pool, 277460, 27740),
    1693737039n + 1200n,
    false,
  );

  console.log('Call option n', callOptionId);

  // Put position https://arbiscan.io/tx/0x8330f05a7c1ab756a24445e231c039563a1497aca861eb8748bb34f04306cb0a
  // Info from events
  // Tick lower: 277500
  // Tick Upper: 277510
  // Id should be 20819020847627533227863465126276573274895648100294514601637106900808685889968
  const putOptionId = getOptionsId(
    getId(pool, 277460, 27740),
    1693780332n + 1200n,
    true,
  );

  // console.log('call option id', callOptionId);

  // console.log(await getOptionsPosition(BigInt(20819020847627533227863465126276573274895648100294514601637106900808685889968n)));

  // const positions = await Promise.all([
  //   getOptionsPosition(callOptionId),
  //   getOptionsPosition(putOptionId),
  // ]);

  // return positions;
  return [];
}
