import parsePriceFromTick from './getPriceFromTick';

function generateStrikes(
  tick: number,
  tickSpacing: number,
  precision0: number,
  precision1: number,
  inversePrice: boolean,
  range: number,
) {
  const tickModulo = tick % tickSpacing;
  if (tickModulo === 0) {
  } else if ((tickModulo + tick) % tickSpacing === 0) {
    tick += tickModulo;
  } else {
    tick -= tickModulo;
  }
  let upwardsStrikes = [];
  let downwardsStrikes = [];
  for (let i = 1; i < range; i++) {
    const upwardsLowerTick = tick + i * tickSpacing;
    const upwardsUpperTick = upwardsLowerTick + tickSpacing;
    const downwardsUpperTick = tick - i * tickSpacing;
    const downwardsLowerTick = downwardsUpperTick - tickSpacing;

    upwardsStrikes.push({
      tickLower: upwardsLowerTick,
      tickUpper: upwardsUpperTick,
      tickLowerPrice: parsePriceFromTick(
        upwardsLowerTick,
        precision0,
        precision1,
        inversePrice,
      ),
      tickUpperPrice: parsePriceFromTick(
        upwardsUpperTick,
        precision0,
        precision1,
        inversePrice,
      ),
    });

    downwardsStrikes.push({
      tickLower: downwardsLowerTick,
      tickUpper: downwardsUpperTick,
      tickLowerPrice: parsePriceFromTick(
        downwardsLowerTick,
        precision0,
        precision1,
        inversePrice,
      ),
      tickUpperPrice: parsePriceFromTick(
        downwardsUpperTick,
        precision0,
        precision1,
        inversePrice,
      ),
    });
  }

  return {
    token0Strikes: downwardsStrikes,
    token1Strikes: upwardsStrikes,
  };
}

export default generateStrikes;
