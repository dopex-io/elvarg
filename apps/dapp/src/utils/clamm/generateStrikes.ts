import getPriceFromTick from 'utils/clamm/getPriceFromTick';

import getLowerAndUpperTicksFromTick from './getLowerAndUpperTicksFromTick';

export type GeneratedStrike = {
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
  tickSpacing: number,
  strikesSpacingMultiplier: number,
  baseTickSpacing: number,
) {
  if (!Boolean(tick)) return [];

  const rounded = Math.round(tick / tickSpacing) * tickSpacing;
  const currentPrice = getPriceFromTick(
    tick,
    token0Precision,
    token1Precision,
    inversePrice,
  );

  const { tickLower, tickUpper } = getLowerAndUpperTicksFromTick(
    tick,
    baseTickSpacing,
  );

  const basePriceDifference =
    getPriceFromTick(
      tickLower,
      token0Precision,
      token1Precision,
      inversePrice,
    ) -
    getPriceFromTick(tickUpper, token0Precision, token1Precision, inversePrice);

  const ticksToAvoid = [
    rounded - tickSpacing,
    rounded,
    tick,
    rounded + tickSpacing,
  ];
  const tickRange = tickSpacing * range;
  let startTick = rounded + tickRange;
  const endTick = rounded - tickRange;

  const strikes: GeneratedStrike[] = [];
  const maxLoops = 1000;
  let counter = 0;
  while (startTick != endTick && maxLoops !== counter) {
    counter++;
    startTick -= tickSpacing;

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
          strike: tickLowerPrice,
          tickLower: tickLower,
          tickUpper: tickUpper,
        });
      }

      if (currentPrice < tickLowerPrice && currentPrice < tickUpperPrice) {
        strikes.push({
          type: 'call',
          strike: tickUpperPrice,
          tickLower: tickLower,
          tickUpper: tickUpper,
        });
      }
    }
  }
  if (strikes.length === 0) return [];

  if (strikesSpacingMultiplier !== 0) {
    let _strikesWithSpacing: GeneratedStrike[] = [];
    strikes.forEach((strike, index) => {
      if (index === 0) {
        _strikesWithSpacing.push(strike);
      } else {
        const absoluteBasePriceDifference =
          basePriceDifference < 0
            ? basePriceDifference * -1
            : basePriceDifference;

        const priceDifference =
          _strikesWithSpacing[_strikesWithSpacing.length - 1].strike -
          strike.strike;

        const absolutePriceDifference =
          priceDifference < 0 ? priceDifference * -1 : priceDifference;

        if (
          absolutePriceDifference >
          absoluteBasePriceDifference * strikesSpacingMultiplier
        ) {
          _strikesWithSpacing.push(strike);
        }
      }
    });

    return _strikesWithSpacing;
  }
  return strikes;
}
export default generateStrikes;
