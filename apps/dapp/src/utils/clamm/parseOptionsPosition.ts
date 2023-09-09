import {
  getAmount0ForLiquidity,
  getAmount1ForLiquidity,
  getAmountsForLiquidity,
} from 'utils/clamm/liquidityAmountMath';
import { getSqrtRatioAtTick } from 'utils/clamm/tickMath';

import getLowerAndUpperTicksFromTick from './getLowerAndUpperTicksFromTick';
import parsePriceFromTick from './parsePriceFromTick';
import { OptionsPositionRaw } from './subgraph/getUserPositions';

export type OptionsPosition = {
  tickLower: number;
  tickUpper: number;
  exercisableAmount: bigint;
  amounts: {
    token0Amount: bigint;
    token1Amount: bigint;
  };
  tickLowerPrice: number;
  tickUpperPrice: number;
  callOrPut: boolean;
  expiry: number;
  exercised: boolean;
};
function parseOptionsPosition(
  priceSqrtX96: bigint,
  tick: number,
  tickSpacing: number,
  precision0: number,
  precision1: number,
  inversePrice: boolean,
  position: OptionsPositionRaw,
): OptionsPosition {
  const { exercised, expiry, isPut, options, tickLower, tickUpper } = position;

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

  let exercisableAmount = options - exercised;

  const currentTicks = getLowerAndUpperTicksFromTick(tick, tickSpacing);

  return {
    tickLower,
    tickUpper,
    exercisableAmount,
    amounts: {
      token0Amount: getAmount0ForLiquidity(
        getSqrtRatioAtTick(BigInt(tickLower)),
        getSqrtRatioAtTick(BigInt(tickUpper)),
        exercisableAmount,
      ),
      token1Amount: getAmount1ForLiquidity(
        getSqrtRatioAtTick(BigInt(tickLower)),
        getSqrtRatioAtTick(BigInt(tickUpper)),
        exercisableAmount,
      ),
    },
    tickLowerPrice,
    tickUpperPrice,
    callOrPut: !isPut,
    expiry: Number(expiry.toString()),
    exercised: exercisableAmount === 0n,
  };
}

export default parseOptionsPosition;
