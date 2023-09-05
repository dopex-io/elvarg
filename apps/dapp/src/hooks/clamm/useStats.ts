import React, { useCallback, useEffect, useState } from 'react';
import { formatUnits } from 'viem';

import { GetBuyPositionsWithCallDataDocument } from 'gql/clamm/graphql';
import request from 'graphql-request';

import queryClient from 'queryClient';

import { getBuyPositionsWithCallData, getUsePositions } from 'graphql/clamm';

import { useBoundStore } from 'store';

import { getAmountsForLiquidity } from 'utils/clamm/liquidityAmountMath';
import parseLiquidityFromMintPositionTxData from 'utils/clamm/parseLiquidityFromMintPositionTxData';
import { getSqrtRatioAtTick } from 'utils/clamm/tickMath';

import { CHAINS } from 'constants/chains';
import { DOPEX_CLAMM_SUBGRAPH_API_URL } from 'constants/subgraphs';

const useStats = () => {
  const [totalVolume, setTotalVolume] = useState(0);
  const [openInterest, setOpenInterest] = useState(0);

  const { selectedUniswapPool, tokenPrices, chainId } = useBoundStore();
  const {
    sqrtX96,
    token0,
    underlyingToken,
    collateralTokenSymbol,
    underlyingTokenSymbol,
  } = selectedUniswapPool;

  const updateStrikesOpenInterestAndVolume = useCallback(async () => {
    const usePositionsQueryResult = await queryClient.fetchQuery({
      queryKey: ['getUsePositions'],
      queryFn: async () =>
        request(DOPEX_CLAMM_SUBGRAPH_API_URL, getUsePositions),
    });

    const buyPositionsQueryResult = await queryClient.fetchQuery({
      queryKey: ['getBuyPositionsWithCallData'],
      queryFn: async () =>
        // @ts-ignore
        request(DOPEX_CLAMM_SUBGRAPH_API_URL, getBuyPositionsWithCallData),
    });

    const token0Symbol =
      token0 === underlyingToken
        ? underlyingTokenSymbol
        : collateralTokenSymbol;
    const token1Symbol =
      token0Symbol === underlyingTokenSymbol
        ? collateralTokenSymbol
        : underlyingTokenSymbol;

    const token0Info = tokenPrices.find((token) => token.name === token0Symbol);
    const token1Info = tokenPrices.find((token) => token.name === token1Symbol);

    const token0Decimals = CHAINS[chainId].tokenDecimals[token0Symbol];
    const token1Decimals = CHAINS[chainId].tokenDecimals[token1Symbol];

    let _openInterest = 0;
    let _totalVolume = 0;
    const { usePositions } = usePositionsQueryResult;
    usePositions.map(({ tickLower, tickUpper, liquidityToUse }) => {
      const { amount0, amount1 } = getAmountsForLiquidity(
        sqrtX96,
        getSqrtRatioAtTick(BigInt(tickLower)),
        getSqrtRatioAtTick(BigInt(tickUpper)),
        BigInt(liquidityToUse),
      );

      if (amount0 > 0n) {
        const amount0UsdValue =
          Number(formatUnits(amount0, token0Decimals)) *
          (token0Info?.price || 0);
        _openInterest += amount0UsdValue;
      }

      if (amount1) {
        const amount1UsdValue =
          Number(formatUnits(amount1, token1Decimals)) *
          (token1Info?.price || 0);

        _openInterest += amount1UsdValue;
      }
    });

    const { buyPositions } = buyPositionsQueryResult as any;

    buyPositions.map(({ tickLower, tickUpper, txInput }: any) => {
      const liquidity = parseLiquidityFromMintPositionTxData(txInput);
      const { amount0, amount1 } = getAmountsForLiquidity(
        sqrtX96,
        getSqrtRatioAtTick(BigInt(tickLower)),
        getSqrtRatioAtTick(BigInt(tickUpper)),
        // @ts-ignore
        BigInt(liquidity),
      );

      if (amount0 > 0n) {
        const amount0UsdValue =
          Number(formatUnits(amount0, token0Decimals)) *
          (token0Info?.price || 0);
        _totalVolume += amount0UsdValue;
      }

      if (amount1) {
        const amount1UsdValue =
          Number(formatUnits(amount1, token1Decimals)) *
          (token1Info?.price || 0);

        _totalVolume += amount1UsdValue;
      }
    });
    setTotalVolume(_totalVolume);
    setOpenInterest(_openInterest);
  }, [
    chainId,
    sqrtX96,
    collateralTokenSymbol,
    token0,
    tokenPrices,
    underlyingToken,
    underlyingTokenSymbol,
  ]);

  useEffect(() => {
    updateStrikesOpenInterestAndVolume();
  }, [updateStrikesOpenInterestAndVolume]);

  return { totalVolume, openInterest };
};

export default useStats;
