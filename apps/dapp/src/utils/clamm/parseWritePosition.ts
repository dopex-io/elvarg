import {
  getAmountsForLiquidity,
  getLiquidityForAmounts,
} from 'utils/clamm/liquidityAmountMath';
import { getSqrtRatioAtTick } from 'utils/clamm/tickMath';

import parsePriceFromTick from './parsePriceFromTick';
import { TickData } from './parseTickData';
import { WritePositionRaw } from './subgraph/getUserWritePositions';

export type WritePosition = {
  tickLower: number;
  tickUpper: number;
  shares: bigint;
  tickLowerPrice: number;
  tickUpperPrice: number;
  size: {
    token0Amount: bigint;
    token1Amount: bigint;
  };
  earned: {
    token0Amount: bigint;
    token1Amount: bigint;
  };
};

function parseWritePosition(
  priceSqrtX96: bigint,
  precision0: number,
  precision1: number,
  inversePrice: boolean,
  tickData: TickData,
  position: WritePositionRaw,
): WritePosition {
  const { totalLiquidity, availableShares } = tickData;
  let { liquidity, tickLower, tickUpper, shares } = position;

  const totalLiquidityToL = getLiquidityForAmounts(
    priceSqrtX96,
    getSqrtRatioAtTick(BigInt(tickLower)),
    getSqrtRatioAtTick(BigInt(tickUpper)),
    totalLiquidity.token0Amount,
    totalLiquidity.token1Amount,
  );

  const totalUserLiquidity = (shares * totalLiquidityToL) / availableShares;

  if (liquidity < 0n) {
    liquidity = 0n;
  }

  const earnedLiquidity =
    totalLiquidityToL === 0n
      ? 0n
      : (shares * (totalUserLiquidity - liquidity)) / totalLiquidityToL;

  const earnedAmounts = getAmountsForLiquidity(
    priceSqrtX96,
    getSqrtRatioAtTick(BigInt(tickLower)),
    getSqrtRatioAtTick(BigInt(tickUpper)),
    earnedLiquidity,
  );

  const liquidityAmounts = getAmountsForLiquidity(
    priceSqrtX96,
    getSqrtRatioAtTick(BigInt(tickLower)),
    getSqrtRatioAtTick(BigInt(tickUpper)),
    liquidity,
  );

  let userShares = shares;
  if (userShares >= availableShares) {
    userShares = availableShares;
  }

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

  return {
    tickLower,
    tickUpper,
    shares: userShares > 0n ? userShares - 1n : 0n,
    tickLowerPrice,
    tickUpperPrice,
    size: {
      token0Amount: liquidityAmounts.amount0,
      token1Amount: liquidityAmounts.amount1,
    },
    earned: {
      token0Amount: earnedAmounts.amount0 < 0n ? 0n : earnedAmounts.amount0,
      token1Amount: earnedAmounts.amount1 < 0n ? 0n : earnedAmounts.amount1,
    },
  };
}

export default parseWritePosition;
