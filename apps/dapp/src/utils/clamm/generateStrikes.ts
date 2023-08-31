import calculatePriceFromTick from './calculatePriceFromTick';
import getPoolSlot0 from './getPoolSlot0';
import getPoolTickSpacing from './getPoolTickSpacing';

const generateStrikes = async (
  poolAddress: `0x${string}`,
  range: number,
  isPut: boolean,
) => {
  const slot0 = await getPoolSlot0(poolAddress);
  // @ts-ignore
  const currentTick = slot0[1];
  const tickSpacing = await getPoolTickSpacing(poolAddress);
  const strikes: number[] = [];
  const lastRangedLimitTicks = tickSpacing * range;
  let startTick = isPut
    ? currentTick - lastRangedLimitTicks
    : currentTick + lastRangedLimitTicks;

  while (startTick != currentTick) {
    startTick = isPut ? startTick + tickSpacing : startTick - tickSpacing;
    strikes.push(calculatePriceFromTick(startTick));
  }
  return strikes.reverse();
};

export default generateStrikes;
