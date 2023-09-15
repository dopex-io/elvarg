import { getAmountsForLiquidity } from 'utils/clamm/liquidityAmountMath';
import { getSqrtRatioAtTick } from 'utils/clamm/tickMath';

import parsePriceFromTick from './parsePriceFromTick';
import { TickDataRaw } from './subgraph/fetchTicksData';

export type TickData = {
  tickLowerPrice: number;
  tickUpperPrice: number;
  tickLower: number;
  tickUpper: number;
  totalLiquidity: {
    token0Amount: bigint;
    token1Amount: bigint;
  };
  liquidityAvailable: {
    token0Amount: bigint;
    token1Amount: bigint;
  };
  liquidityCompounded: {
    token0Amount: bigint;
    token1Amount: bigint;
  };
  availableShares: bigint;
};

function parseTickData(
  uniswapPoolSqrtX96: bigint,
  precision0: number,
  precision1: number,
  inversePrice: boolean,
  data: TickDataRaw,
): TickData {
  const {
    tickLower,
    tickUpper,
    liquidity,
    liquidityUsed,
    liquidityUnused,
    liquidityCompounded,
    liquidityWithdrawn,
    totalEarningsWithdrawn,
    totalShares,
  } = data;

  const netLiquidity = liquidity - liquidityWithdrawn;
  const netUsedLiquidity =
    liquidityUnused > liquidityUsed ? 0n : liquidityUsed - liquidityUnused;
  const availableLiquidity = netLiquidity - netUsedLiquidity;
  const availableShares =
    availableLiquidity === 0n || netLiquidity === 0n
      ? 0n
      : (availableLiquidity * totalShares) / netLiquidity;

  const totalLiquidityAmounts = getAmountsForLiquidity(
    uniswapPoolSqrtX96,
    getSqrtRatioAtTick(BigInt(tickLower)),
    getSqrtRatioAtTick(BigInt(tickUpper)),
    netLiquidity,
  );

  const availableLiquidityToAmounts = getAmountsForLiquidity(
    uniswapPoolSqrtX96,
    getSqrtRatioAtTick(BigInt(tickLower)),
    getSqrtRatioAtTick(BigInt(tickUpper)),
    availableLiquidity,
  );

  const liquidityCompoundedToAmounts = getAmountsForLiquidity(
    uniswapPoolSqrtX96,
    getSqrtRatioAtTick(BigInt(tickLower)),
    getSqrtRatioAtTick(BigInt(tickUpper)),
    liquidityCompounded - totalEarningsWithdrawn,
  );

  const [tickLowerPrice, tickUpperPrice] = [
    parsePriceFromTick(tickLower, precision0, precision1, inversePrice),
    parsePriceFromTick(tickUpper, precision0, precision1, inversePrice),
  ];

  return {
    totalLiquidity: {
      token0Amount: totalLiquidityAmounts.amount0,
      token1Amount: totalLiquidityAmounts.amount1,
    },
    // tickLowerPrice: inversePrice ? 1 / tickLowerPrice : tickLowerPrice,
    // tickUpperPrice: inversePrice ? 1 / tickUpperPrice : tickUpperPrice,
    tickLowerPrice: tickLowerPrice,
    tickUpperPrice: tickUpperPrice,
    tickLower: tickLower,
    tickUpper: tickUpper,
    liquidityAvailable: {
      token0Amount:
        availableLiquidityToAmounts.amount0 < 0n
          ? 0n
          : availableLiquidityToAmounts.amount0,
      token1Amount:
        availableLiquidityToAmounts.amount1 < 0n
          ? 0n
          : availableLiquidityToAmounts.amount1,
    },
    liquidityCompounded: {
      token0Amount:
        liquidityCompoundedToAmounts.amount0 < 0n
          ? 0n
          : liquidityCompoundedToAmounts.amount0,
      token1Amount:
        liquidityCompoundedToAmounts.amount1 < 0n
          ? 0n
          : liquidityCompoundedToAmounts.amount1,
    },
    availableShares: availableShares,
  };
}

export default parseTickData;
