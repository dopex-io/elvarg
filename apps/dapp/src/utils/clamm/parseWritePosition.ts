import {
  getAmountsForLiquidity,
  getLiquidityForAmounts,
} from 'utils/clamm/liquidityAmountMath';
import { getSqrtRatioAtTick } from 'utils/clamm/tickMath';

import parsePriceFromTick from './getPriceFromTick';
import { TickData } from './parseTickData';
import { WritePositionRaw } from './subgraph/getUserWritePositions';

export type WritePosition = {
  timestamp: number;
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
  withdrawableLiquidity: {
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
  const { totalLiquidity, availableShares, liquidityAvailable } = tickData;
  let { liquidity, tickLower, tickUpper, shares, timestamp } = position;

  const totalLiquidityToL = getLiquidityForAmounts(
    priceSqrtX96,
    getSqrtRatioAtTick(BigInt(tickLower)),
    getSqrtRatioAtTick(BigInt(tickUpper)),
    totalLiquidity.token0Amount,
    totalLiquidity.token1Amount,
  );

  const availableLiquidity = getLiquidityForAmounts(
    priceSqrtX96,
    getSqrtRatioAtTick(BigInt(tickLower)),
    getSqrtRatioAtTick(BigInt(tickUpper)),
    liquidityAvailable.token0Amount,
    liquidityAvailable.token1Amount,
  );

  const totalUserLiquidity = (shares * totalLiquidityToL) / availableShares;

  if (liquidity < 0n) {
    liquidity = 0n;
  }

  const earnedLiquidity =
    totalLiquidityToL === 0n
      ? 0n
      : (shares * (totalUserLiquidity - liquidity)) / availableShares;

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

  let withdrawableLiquidity = {
    token0Amount:
      (userShares * liquidityAvailable.token0Amount) / availableShares,
    token1Amount:
      (userShares * liquidityAvailable.token1Amount) / availableShares,
  };

  let withdrawableShares = userShares;

  if (availableLiquidity >= totalUserLiquidity) {
    withdrawableLiquidity = {
      token0Amount: liquidityAmounts.amount0,
      token1Amount: liquidityAmounts.amount1,
    };
  }

  if (availableShares - withdrawableShares === 0n) {
    withdrawableShares = withdrawableShares - 1n;
  }

  return {
    timestamp,
    withdrawableLiquidity: withdrawableLiquidity,
    tickLower,
    tickUpper,
    shares: withdrawableShares > 0n ? withdrawableShares : 0n,
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
