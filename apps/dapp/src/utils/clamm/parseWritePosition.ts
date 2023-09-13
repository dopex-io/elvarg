import { getAmountsForLiquidity } from 'utils/clamm/liquidityAmountMath';
import { getSqrtRatioAtTick } from 'utils/clamm/tickMath';

import parsePriceFromTick from './parsePriceFromTick';
import { TickData } from './parseTickData';
import { WritePositionRaw } from './subgraph/getUserPositions';

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
  const { liquidityCompounded, totalLiquidity, availableShares } = tickData;
  const { liquidity, tickLower, tickUpper, shares } = position;

  // const liquidityCompoundedAmount0 =
  //   totalLiquidity === 0n
  //     ? 0n
  //     : (shares * liquidityCompounded.token0Amount) / availableShares;

  // const liquidityCompoundedAmount1 =
  //   totalLiquidity === 0n
  //     ? 0n
  //     : (shares * liquidityCompounded.token1Amount) / availableShares;

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
      token0Amount: 0n,
      token1Amount: 0n,
    },
  };
}

export default parseWritePosition;
