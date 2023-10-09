import getSqrtx96Price from './getSqrtx96Price';
import {
  getAmount0ForLiquidity,
  getAmount1ForLiquidity,
} from './liquidityAmountMath';
import parsePriceFromTick from './parsePriceFromTick';
import { OptionsExercisesRaw } from './subgraph/getUserOptionsExercises';
import { getSqrtRatioAtTick } from './tickMath';

function parseOptionsExercises(
  precision0: number,
  precision1: number,
  inversePrice: boolean,
  position: OptionsExercisesRaw,
) {
  const {
    expiry,
    isPut,
    options,
    tickLower,
    tickUpper,
    profit,
    txHash,
    sqrtx96Price,
    premium,
  } = position;

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

  const exercisePrice = getSqrtx96Price(
    sqrtx96Price,
    precision0,
    precision1,
    inversePrice,
  );

  return {
    strike: isPut ? tickLowerPrice : tickUpperPrice,
    amounts: {
      token0Amount: getAmount0ForLiquidity(
        getSqrtRatioAtTick(BigInt(tickLower)),
        getSqrtRatioAtTick(BigInt(tickUpper)),
        options,
      ),
      token1Amount: getAmount1ForLiquidity(
        getSqrtRatioAtTick(BigInt(tickLower)),
        getSqrtRatioAtTick(BigInt(tickUpper)),
        options,
      ),
    },
    isPut,
    timestamp: Number(expiry.toString()),
    profit,
    premium,
    txHash,
    exercisePrice,
  };
}
export default parseOptionsExercises;
