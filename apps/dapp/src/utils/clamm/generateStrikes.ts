import getPriceFromTick from 'utils/clamm/getPriceFromTick';

type GenerateStrike = {
  strike: number;
  tickLower: number;
  tickUpper: number;
  type: string;
};
function generateStrikes(
  tick: number,
  token0Precision: number,
  token1Precision: number,
  inversePrice: boolean,
  range: number,
) {
  const tickSpacing = 20;
  const rounded = Math.round(tick / 10) * 10;
  const currentPrice = getPriceFromTick(
    tick,
    token0Precision,
    token1Precision,
    inversePrice,
  );

  const ticksToAvoid = [
    rounded - tickSpacing,
    rounded,
    tick,
    rounded + tickSpacing,
  ];
  const tickRange = tickSpacing * range;
  let startTick = rounded + tickRange;
  const endTick = rounded - tickRange;

  const strikes: GenerateStrike[] = [];
  let loopCount = 0;
  const maxLoops = 200;
  while (startTick != endTick && loopCount < maxLoops) {
    loopCount = loopCount + 1;
    startTick -= tickSpacing;
    console.log(startTick, endTick, tickSpacing);

    const tickUpper = startTick + tickSpacing;
    const tickLower = startTick;

    const tickLowerPrice = getPriceFromTick(
      tickLower,
      token0Precision,
      token1Precision,
      inversePrice,
    );

    const tickUpperPrice = getPriceFromTick(
      tickUpper,
      token0Precision,
      token1Precision,
      inversePrice,
    );

    if (
      !ticksToAvoid.includes(tickLower) &&
      !ticksToAvoid.includes(tickUpper)
    ) {
      if (currentPrice > tickLowerPrice && currentPrice > tickUpperPrice) {
        strikes.push({
          type: 'put',
          strike: tickUpperPrice,
          tickLower: startTick,
          tickUpper: startTick + 10,
        });
      }

      if (currentPrice < tickLowerPrice && currentPrice < tickUpperPrice) {
        strikes.push({
          type: 'call',
          strike: tickUpperPrice,
          tickLower: startTick,
          tickUpper: startTick + 10,
        });
      }
    }
  }

  if (strikes.length === 0) {
    return [];
  } else {
    return strikes[0].type === 'put' ? strikes.reverse() : strikes;
  }
}
export default generateStrikes;
