import React, { useCallback } from 'react';

import { useBoundStore } from 'store';

import getLiquidityAtTick from 'utils/clamm/getLiquidityAtTick';
import {
  getAmount0ForLiquidity,
  getAmount1ForLiquidity,
  getAmountsForLiquidity,
  getLiquidityForAmount0,
  getLiquidityForAmount1,
} from 'utils/clamm/liquidityAmountMath';
import { getSqrtRatioAtTick } from 'utils/clamm/tickMath';
import { OPTIONS_TOKEN_DECIMALS } from 'utils/contracts/atlantics/pool';

import { CHAINS } from 'constants/chains';

const useOptionPool = () => {
  const { selectedUniswapPool, chainId, isPut } = useBoundStore();

  const {
    token0,
    sqrtX96,
    underlyingToken,
    underlyingTokenSymbol,
    collateralTokenSymbol,
  } = selectedUniswapPool;
  /*
   * Query from subgraph and calculate here, anything related to the pool.
   */

  const getAvailableLiquidityAtTick = useCallback(
    async (tickLower: number, tickUpper: number) => {
      const liquidityAtTick = await getLiquidityAtTick(
        selectedUniswapPool.address,
        tickLower,
        tickUpper,
      );

      const availableLiquidity = liquidityAtTick[0] - liquidityAtTick[2];

      if (isPut) {
        if (token0 === underlyingToken) {
          return getAmount1ForLiquidity(
            getSqrtRatioAtTick(BigInt(tickLower)),
            getSqrtRatioAtTick(BigInt(tickUpper)),
            availableLiquidity,
          );
        } else {
          return getAmount0ForLiquidity(
            getSqrtRatioAtTick(BigInt(tickLower)),
            getSqrtRatioAtTick(BigInt(tickUpper)),
            availableLiquidity,
          );
        }
      } else {
        if (token0 === underlyingToken) {
          return getAmount0ForLiquidity(
            getSqrtRatioAtTick(BigInt(tickLower)),
            getSqrtRatioAtTick(BigInt(tickUpper)),
            availableLiquidity,
          );
        } else {
          return getAmount1ForLiquidity(
            getSqrtRatioAtTick(BigInt(tickLower)),
            getSqrtRatioAtTick(BigInt(tickUpper)),
            availableLiquidity,
          );
        }
      }
    },
    [selectedUniswapPool.address, isPut, token0, underlyingToken],
  );
  const getLiquidityToUse = useCallback(
    (
      strike: bigint,
      tickLower: number,
      tickUpper: number,
      amountOfOptions: bigint,
      isPut: boolean,
    ) => {
      if (isPut) {
        amountOfOptions = (strike * amountOfOptions) / BigInt(1e8);
      }

      const tokenDecimals =
        CHAINS[chainId].tokenDecimals[
          isPut ? collateralTokenSymbol : underlyingTokenSymbol
        ];

      // Adjust for decimals
      if (OPTIONS_TOKEN_DECIMALS <= tokenDecimals) {
        amountOfOptions =
          amountOfOptions *
          BigInt(10 ** (tokenDecimals - OPTIONS_TOKEN_DECIMALS));
      } else {
        amountOfOptions =
          amountOfOptions /
          BigInt(10 ** (OPTIONS_TOKEN_DECIMALS - tokenDecimals));
      }

      /**
       * Purchase call options with underlying / call asset
       * Purchasse put options with collateral / put asset
       */

      if (isPut) {
        if (token0 === underlyingToken) {
          return getLiquidityForAmount1(
            getSqrtRatioAtTick(BigInt(tickLower)),
            getSqrtRatioAtTick(BigInt(tickUpper)),
            amountOfOptions,
          );
        } else {
          return getLiquidityForAmount0(
            getSqrtRatioAtTick(BigInt(tickLower)),
            getSqrtRatioAtTick(BigInt(tickUpper)),
            amountOfOptions,
          );
        }
      } else {
        if (token0 === underlyingToken) {
          return getLiquidityForAmount0(
            getSqrtRatioAtTick(BigInt(tickLower)),
            getSqrtRatioAtTick(BigInt(tickUpper)),
            amountOfOptions,
          );
        } else {
          return getLiquidityForAmount1(
            getSqrtRatioAtTick(BigInt(tickLower)),
            getSqrtRatioAtTick(BigInt(tickUpper)),
            amountOfOptions,
          );
        }
      }
    },
    [
      chainId,
      collateralTokenSymbol,
      token0,
      underlyingToken,
      underlyingTokenSymbol,
    ],
  );
  return { getAvailableLiquidityAtTick, getLiquidityToUse };
};

export default useOptionPool;
