import { useCallback, useState } from 'react';
import { ethers, Signer } from 'ethers';
import { Address } from 'viem';

import { useBoundStore } from 'store';

import {
  getLiquidityForAmount0,
  getLiquidityForAmount1,
  getLiquidityForAmounts,
} from 'utils/clamm/liquidityAmountMath';
import splitMarketPair from 'utils/clamm/splitMarketPair';
import { getSqrtRatioAtTick } from 'utils/clamm/tickMath';

import { CHAINS } from 'constants/chains';

type Pool = {
  sqrtX96: bigint;
  token0: Address;
  token1: Address;
  currentTick: number;
  tickSpacing: number;
  strikes: any[];
  address: Address;
  underlyingToken: Address;
  collateralToken: Address;
};

export type PositionManagerParams = {
  pool: Address;
  tickLower: number;
  tickUpper: number;
  liquidity: bigint;
};

export type ClammStrike = {
  strike: number;
  upperTick: number;
  lowerTick: number;
  optionsAvailable: bigint;
};

const usePositionManager = () => {
  const { isPut, chainId, selectedPair, selectedUniswapPool } = useBoundStore();

  const { token0, tickSpacing, underlyingToken, currentTick, address } =
    selectedUniswapPool;

  const getDepositParams = useCallback(
    (
      tickLower: number,
      tickUpper: number,
      liquidity: bigint,
    ): PositionManagerParams => {
      const amount = isPut
        ? getLiquidityForAmount0(
            getSqrtRatioAtTick(BigInt(tickLower)),
            getSqrtRatioAtTick(BigInt(tickUpper)),
            liquidity,
          )
        : getLiquidityForAmount1(
            getSqrtRatioAtTick(BigInt(tickLower)),
            getSqrtRatioAtTick(BigInt(tickUpper)),
            liquidity,
          );

      let _liquidity = 0n;
      if (token0 === underlyingToken) {
        if (isPut) {
          _liquidity = getLiquidityForAmount1(
            getSqrtRatioAtTick(BigInt(tickLower)),
            getSqrtRatioAtTick(BigInt(tickUpper)),
            liquidity,
          );
        } else {
          _liquidity = getLiquidityForAmount0(
            getSqrtRatioAtTick(BigInt(tickLower)),
            getSqrtRatioAtTick(BigInt(tickUpper)),
            liquidity,
          );
        }
      } else {
        if (isPut) {
          _liquidity = getLiquidityForAmount0(
            getSqrtRatioAtTick(BigInt(tickLower)),
            getSqrtRatioAtTick(BigInt(tickUpper)),
            liquidity,
          );
        } else {
          _liquidity = getLiquidityForAmount1(
            getSqrtRatioAtTick(BigInt(tickLower)),
            getSqrtRatioAtTick(BigInt(tickUpper)),
            liquidity,
          );
        }
      }

      return {
        pool: address,
        tickLower: tickLower,
        tickUpper: tickUpper,
        liquidity: amount,
      };
    },
    [address, isPut, token0, underlyingToken],
  );

  const getStrikesWithTicks = useCallback(
    async (range: number) => {
      const { underlyingTokenSymbol, collateralTokenSymbol } =
        splitMarketPair(selectedPair);

      const decimals0 = CHAINS[chainId].tokenDecimals[underlyingTokenSymbol];
      const decimals1 = CHAINS[chainId].tokenDecimals[collateralTokenSymbol];

      let tickModuloFromTickSpace = currentTick % tickSpacing;

      const _isPut = token0 !== underlyingToken ? !isPut : isPut;

      const startTick =
        currentTick < 0
          ? _isPut
            ? currentTick + (-tickModuloFromTickSpace - tickSpacing)
            : currentTick - tickModuloFromTickSpace
          : _isPut
          ? currentTick - tickModuloFromTickSpace
          : currentTick - (tickModuloFromTickSpace - tickSpacing);

      const strikes: ClammStrike[] = [];

      for (let i = 1; i < range + 1; i++) {
        let strike = 0;
        let upperTick = 0;
        let lowerTick = 0;
        if (_isPut) {
          lowerTick = startTick - tickSpacing * i - tickSpacing;
          upperTick = startTick - tickSpacing * i;
          strike =
            ((token0 === underlyingToken ? 1.0001 : 1 / 1.0001) ** lowerTick *
              10 ** decimals0) /
            10 ** decimals1;
        } else {
          upperTick = startTick + tickSpacing * i + tickSpacing;
          lowerTick = startTick + tickSpacing * i;
          strike =
            ((token0 === underlyingToken ? 1.0001 : 1 / 1.0001) ** upperTick *
              10 ** decimals0) /
            10 ** decimals1;
        }

        strikes.push({
          strike: strike,
          upperTick,
          lowerTick,
          optionsAvailable: 0n,
        });
      }

      return strikes;
    },
    [
      chainId,
      currentTick,
      isPut,
      selectedPair,
      tickSpacing,
      token0,
      underlyingToken,
    ],
  );

  return {
    getDepositParams,
    getStrikesWithTicks,
  };
};

export default usePositionManager;
