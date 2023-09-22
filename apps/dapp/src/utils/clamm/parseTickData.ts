import { getAmountsForLiquidity } from 'utils/clamm/liquidityAmountMath';
import { getSqrtRatioAtTick } from 'utils/clamm/tickMath';

import parsePriceFromTick from './parsePriceFromTick';
import { StrikesDataRaw } from './subgraph/fetchStrikesData';

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
  availableShares: bigint;
};

function parseTickData(
  uniswapPoolSqrtX96: bigint,
  precision0: number,
  precision1: number,
  inversePrice: boolean,
  data: StrikesDataRaw,
): TickData {
  const { tickLower, tickUpper, liquidityUsed, totalShares, totalLiquidity } =
    data;

  const totalLiquidityAmounts = getAmountsForLiquidity(
    uniswapPoolSqrtX96,
    getSqrtRatioAtTick(BigInt(tickLower)),
    getSqrtRatioAtTick(BigInt(tickUpper)),
    totalLiquidity,
  );
  const availableLiquidityToAmounts = getAmountsForLiquidity(
    uniswapPoolSqrtX96,
    getSqrtRatioAtTick(BigInt(tickLower)),
    getSqrtRatioAtTick(BigInt(tickUpper)),
    totalLiquidity - liquidityUsed,
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
    availableShares: totalShares,
  };
}

export default parseTickData;
