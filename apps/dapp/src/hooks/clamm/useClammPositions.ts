import { useCallback, useEffect, useState } from 'react';
import { formatUnits } from 'viem';

import request from 'graphql-request';
import { Address, useAccount } from 'wagmi';

import queryClient from 'queryClient';

import 'graphql/clamm';

import {
  getOptionsPositionsForUser,
  getWritePositionsForUser,
} from 'graphql/clamm';

import { useBoundStore } from 'store';
import { OptionsPosition, WritePosition } from 'store/Vault/clamm';

import calculatePriceFromTick from 'utils/clamm/calculatePriceFromTick';
import {
  getAmount0ForLiquidity,
  getAmount1ForLiquidity,
  getAmountsForLiquidity,
} from 'utils/clamm/liquidityAmountMath';
import { getSqrtRatioAtTick } from 'utils/clamm/tickMath';
import { formatAmount } from 'utils/general';

import { CHAINS } from 'constants/chains';
import { DOPEX_CLAMM_SUBGRAPH_API_URL } from 'constants/subgraphs';

export interface RewardsInfo {
  rewardAmount: bigint;
  periodFinish: bigint;
  rewardRate: bigint;
  rewardRateStored: bigint;
  lastUpdateTime: bigint;
  totalSupply: bigint;
  decimalsPrecision: bigint;
  rewardToken: Address;
}
export interface RewardAccrued {
  symbol: string;
  name: string;
  amount: bigint;
  address: Address;
  isOption: boolean;
}

const useClammPositions = () => {
  const { address } = useAccount();
  const { chainId, selectedUniswapPool, tickersData } = useBoundStore();

  const [writePositions, setWritePositions] = useState<WritePosition[]>([]);
  const [optionsPositions, setOptionsPositions] = useState<OptionsPosition[]>(
    [],
  );
  const [loading, setLoading] = useState<boolean>(true);

  const parseAndUpdateOptionsPositions = useCallback(
    (positions: any) => {
      const parsedOptionsPositions: OptionsPosition[] = positions.map(
        ({ expiry, isPut, options, tickLower, tickUpper }: any) => {
          const amount = isPut
            ? selectedUniswapPool.tickScaleFlipped
              ? getAmount0ForLiquidity(
                  getSqrtRatioAtTick(BigInt(tickLower)),
                  getSqrtRatioAtTick(BigInt(tickUpper)),
                  BigInt(options),
                )
              : getAmount1ForLiquidity(
                  getSqrtRatioAtTick(BigInt(tickLower)),
                  getSqrtRatioAtTick(BigInt(tickUpper)),
                  BigInt(options),
                )
            : selectedUniswapPool.tickScaleFlipped
            ? getAmount1ForLiquidity(
                getSqrtRatioAtTick(BigInt(tickLower)),
                getSqrtRatioAtTick(BigInt(tickUpper)),
                BigInt(options),
              )
            : getAmount0ForLiquidity(
                getSqrtRatioAtTick(BigInt(tickLower)),
                getSqrtRatioAtTick(BigInt(tickUpper)),
                BigInt(options),
              );
          return {
            strike: calculatePriceFromTick(
              isPut ? Number(tickLower) : Number(tickUpper),
              // @todo-match-precision
              1e18,
              1e6,
              selectedUniswapPool.tickScaleFlipped,
            ),
            tickLower: Number(tickLower),
            tickUpper: Number(tickUpper),
            expiry: Number(expiry),
            callOrPut: !isPut,
            amount: {
              userReadable: formatUnits(
                amount,
                CHAINS[chainId].tokenDecimals[
                  isPut
                    ? selectedUniswapPool.tickScaleFlipped
                      ? selectedUniswapPool.collateralTokenSymbol
                      : selectedUniswapPool.underlyingTokenSymbol
                    : selectedUniswapPool.tickScaleFlipped
                    ? selectedUniswapPool.underlyingTokenSymbol
                    : selectedUniswapPool.collateralTokenSymbol
                ],
              ),

              contractReadable: amount,
            },
          };
        },
      );

      setOptionsPositions(parsedOptionsPositions);
    },

    [
      selectedUniswapPool.tickScaleFlipped,
      chainId,
      selectedUniswapPool.collateralTokenSymbol,
      selectedUniswapPool.underlyingTokenSymbol,
    ],
  );

  const parseAndUpdateWritePositions = useCallback(
    async (positions: any) => {
      const parsedWritePositions: WritePosition[] = [];
      positions.forEach(({ tickLower, tickUpper, shares, liquidity }: any) => {
        const tickerData = tickersData.find(
          (data) =>
            Number(data.tickLower) === Number(tickLower) &&
            Number(data.tickUpper) === Number(tickUpper),
        );

        if (BigInt(shares) === 1n) return;
        if (!tickerData) return;

        let userShares = shares;

        // total liquidity
        const totalLiquidtyAtTick =
          BigInt(tickerData.liquidity) - BigInt(tickerData.liquidityWithdrawn);

        // total liquidity used
        const liquidityUsed =
          BigInt(tickerData.liquidityUsed) - BigInt(tickerData.liquidityUnused);

        const availableLiquidity =
          BigInt(totalLiquidtyAtTick) - BigInt(liquidityUsed);
        const availableLiquidityToShares =
          (BigInt(availableLiquidity) * BigInt(tickerData.totalShares)) /
          totalLiquidtyAtTick;

        if (shares >= availableLiquidityToShares) {
          userShares = availableLiquidityToShares - 1n;
        }

        const earnings = getAmountsForLiquidity(
          selectedUniswapPool.sqrtX96,
          getSqrtRatioAtTick(BigInt(tickLower)),
          getSqrtRatioAtTick(BigInt(tickUpper)),
          BigInt(tickerData?.liquidityCompounded || 0n),
        );

        const callOrPut = selectedUniswapPool.tickScaleFlipped
          ? selectedUniswapPool.currentTick > tickLower
            ? true
            : false
          : selectedUniswapPool.currentTick < tickUpper
          ? false
          : true;

        const liquidityParsed = getAmountsForLiquidity(
          selectedUniswapPool.sqrtX96,
          getSqrtRatioAtTick(BigInt(tickLower)),
          getSqrtRatioAtTick(BigInt(tickUpper)),
          BigInt(liquidity),
        );

        let token0Symbol = selectedUniswapPool.underlyingTokenSymbol;
        let token1Symbol = selectedUniswapPool.collateralTokenSymbol;
        let token0Decimals = CHAINS[chainId].tokenDecimals[token0Symbol];
        let token1Decimals = CHAINS[chainId].tokenDecimals[token1Symbol];

        if (selectedUniswapPool.tickScaleFlipped) {
          token0Symbol = selectedUniswapPool.collateralTokenSymbol;
          token1Symbol = selectedUniswapPool.underlyingTokenSymbol;
          token0Decimals = CHAINS[chainId].tokenDecimals[token0Symbol];
          token1Decimals = CHAINS[chainId].tokenDecimals[token1Symbol];
        }

        const token0EarningsData = {
          amount: formatAmount(
            formatUnits(earnings.amount0, token0Decimals),
            5,
          ),
          symbol: token0Symbol,
        };
        const token1EarningsData = {
          amount: formatAmount(
            formatUnits(earnings.amount1, token1Decimals),
            5,
          ),
          symbol: token1Symbol,
        };

        const token0LiquidityData = {
          amount: formatAmount(
            formatUnits(liquidityParsed.amount0, token0Decimals),
            5,
          ),
          symbol: token0Symbol,
        };
        const token1LiquidityData = {
          amount: formatAmount(
            formatUnits(liquidityParsed.amount1, token1Decimals),
            5,
          ),
          symbol: token1Symbol,
        };

        parsedWritePositions.push({
          strike: calculatePriceFromTick(
            callOrPut ? Number(tickUpper) : Number(tickLower),
            // @todo-match-precision
            1e18,
            1e6,
            selectedUniswapPool.tickScaleFlipped,
          ),
          shares: userShares,
          tickLower: tickLower,
          tickUpper: tickUpper,
          liquidity: {
            token0Amount: token0LiquidityData.amount,
            token0Symbol: token0LiquidityData.symbol,
            token1Amount: token1LiquidityData.amount,
            token1Symbol: token1LiquidityData.symbol,
          },
          callOrPut,
          earnings: {
            token0Amount: token0EarningsData.amount,
            token0Symbol: token0EarningsData.symbol,
            token1Amount: token1EarningsData.amount,
            token1Symbol: token1EarningsData.symbol,
          },
        });
      });

      setWritePositions(parsedWritePositions);
    },
    [
      selectedUniswapPool.currentTick,
      selectedUniswapPool.tickScaleFlipped,
      chainId,
      selectedUniswapPool.collateralTokenSymbol,
      selectedUniswapPool.sqrtX96,
      selectedUniswapPool.underlyingTokenSymbol,
      tickersData,
    ],
  );

  const updateClammPositions = useCallback(async () => {
    setLoading(true);
    if (!address) {
      setLoading(false);
      return;
    }

    // @ts-ignore
    const [{ optionsPositions }, { writePositions }] = await Promise.all([
      queryClient.fetchQuery({
        queryKey: ['userClammOptionsPositions', address.toLowerCase()],
        queryFn: async () =>
          request(DOPEX_CLAMM_SUBGRAPH_API_URL, getOptionsPositionsForUser, {
            user: address.toLowerCase(),
            poolAddress: selectedUniswapPool.address.toLowerCase(),
            first: 1000,
          }),
        staleTime: 1000,
      }),
      queryClient.fetchQuery({
        queryKey: ['userClammWritePositions', address.toLowerCase()],
        queryFn: async () =>
          request(DOPEX_CLAMM_SUBGRAPH_API_URL, getWritePositionsForUser, {
            user: address.toLowerCase(),
            poolAddress: selectedUniswapPool.address.toLowerCase(),
            first: 1000,
          }),
      }),
    ]);

    parseAndUpdateOptionsPositions(optionsPositions);
    await parseAndUpdateWritePositions(writePositions);

    setLoading(false);
  }, [
    parseAndUpdateWritePositions,
    address,
    parseAndUpdateOptionsPositions,
    selectedUniswapPool.address,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      updateClammPositions();
    }, 2500);
    return () => clearInterval(interval);
  }, [updateClammPositions]);

  return {
    updateClammPositions,
    writePositions,
    optionsPositions,
    isLoading: loading,
  };
};

// const calculateStrike = ({
//   isPut,
//   tickLower,
//   tickUpper,
//   decimals0,
//   decimals1,
// }: {
//   isPut: boolean;
//   tickLower: number;
//   tickUpper: number;
//   decimals0: number;
//   decimals1: number;
// }): number => {
//   const strike = isPut
//     ? ((1 / 1.0001 ** tickLower) * 10 ** decimals0) / 10 ** decimals1
//     : ((1 / 1.0001 ** tickUpper) * 10 ** decimals0) / 10 ** decimals1;
//   return strike;
// };

export default useClammPositions;
