import getSqrtx96Price from './getSqrtx96Price';
import { getAmountsForLiquidity } from './liquidityAmountMath';
import parsePriceFromTick from './parsePriceFromTick';
import { WritePositionBurnRaw } from './subgraph/getUserWritePositionBurns';
import { getSqrtRatioAtTick } from './tickMath';

function parseWritePositionBurn(
  precision0: number,
  precision1: number,
  inversePrice: boolean,
  position: WritePositionBurnRaw,
) {
  let { liquidity, tickLower, tickUpper, timestamp, sqrtx96Price, txHash } =
    position;

  const liquidityAmounts = getAmountsForLiquidity(
    sqrtx96Price,
    getSqrtRatioAtTick(BigInt(tickLower)),
    getSqrtRatioAtTick(BigInt(tickUpper)),
    liquidity,
  );

  const tickLowerPrice = parsePriceFromTick(
    tickLower,
    precision0,
    precision1,
    inversePrice,
  );
  const tickUpperPrice = parsePriceFromTick(
    tickUpper,
    precision0,
    precision1,
    inversePrice,
  );

  const price = getSqrtx96Price(
    sqrtx96Price,
    precision0,
    precision1,
    inversePrice,
  );

  let side = 'Neutral';
  let strikePrice = price;
  if (inversePrice) {
    if (price < tickLowerPrice) {
      side = 'Put';
      strikePrice = tickLowerPrice;
    } else if (price > tickUpperPrice) {
      side = 'Call';
      strikePrice = tickUpperPrice;
    }
  } else {
    if (price < tickLowerPrice) {
      side = 'Call';
      strikePrice = tickUpperPrice;
    } else if (price > tickUpperPrice) {
      side = 'Put';
      strikePrice = tickUpperPrice;
    }
  }

  return {
    txHash,
    side,
    strike: strikePrice,
    liquidity: {
      token0Amount: liquidityAmounts.amount0,
      token1Amount: liquidityAmounts.amount1,
    },
    timestamp: Number(timestamp.toString()),
  };
}

export default parseWritePositionBurn;
