import { Address, zeroAddress } from 'viem';

import { StateCreator } from 'zustand';

import { AssetsSlice } from 'store/Assets';
import { WalletSlice } from 'store/Wallet';

import { ClammStrike } from 'hooks/clamm/usePositionManager';

import calculatePriceFromTick from 'utils/clamm/calculatePriceFromTick';
import { getAmountsForLiquidity } from 'utils/clamm/liquidityAmountMath';
import { getSqrtRatioAtTick } from 'utils/clamm/tickMath';

import { ZERO_ADDRESS } from 'constants/index';

import { CommonSlice } from '../common';

type UniswapV3Pool = {
  sqrtX96: bigint;
  token0: Address;
  token1: Address;
  currentTick: number;
  tickSpacing: number;
  strikes: any[];
  address: Address;
  underlyingToken: Address;
  collateralToken: Address;
  optionPool: Address;
  underlyingTokenSymbol: string;
  collateralTokenSymbol: string;
  tickScaleFlipped: boolean;
};

export type WritePosition = {
  strike: number;
  shares: bigint;
  tickLower: number;
  tickUpper: number;
  liquidity: {
    token0Amount: string;
    token0Symbol: string;
    token1Amount: string;
    token1Symbol: string;
  };
  callOrPut: boolean;
  earnings: {
    token0Amount: string;
    token0Symbol: string;
    token1Amount: string;
    token1Symbol: string;
  };
};

export type TickerData = {
  poolAddress: Address;
  tickLower: number;
  tickUpper: number;
  liquidity: bigint;
  liquidityUsed: bigint;
  liquidityUnused: bigint;
  liquidityCompounded: bigint;
  liquidityWithdrawn: bigint;
  totalEarningsWithdrawn: bigint;
  totalShares: bigint;
  totalCallAssetsEarned: bigint;
  totalPutAssetsEarned: bigint;
};

export interface ClammStrikeData {
  strike: number;
  liquidity: number;
  premiumPerOption: number;
  iv: number;
  breakeven: number;
  delta: number;
  theta: number;
  vega: number;
  gamma: number;
  utilization: number;
  tvl: number;
  apy: number;
  premiumApy: number;
}

export type CollateralTokenTypes = 'USDC' | 'USDC';
export type UnderlyingTokenTypes = 'ARB';
export type ClammPair = `${UnderlyingTokenTypes}-${CollateralTokenTypes}`;

export interface ClammBuyPosition {
  strikeSymbol: string;
  optionId: string;
  strike: number;
  tickLower: number;
  tickUpper: number;
  size: number;
  isPut: boolean;
  expiry: number;
}

export interface ClammWritePosition {
  strikeSymbol: string;
  strike: number;
  tickLower: number;
  tickUpper: number;
  size: {
    token0: bigint;
    token1: bigint;
  };
  premiums2: {
    token0: bigint;
    token1: bigint;
  };
  isPut: boolean;
  tokenId: number;
  earned: number;
  premiums: number;
  balance: bigint;
  withdrawable: bigint;
}

export interface OptionsPosition {
  amount: {
    userReadable: string;
    contractReadable: bigint;
  };
  strike: string;
  tickLower: number;
  tickUpper: number;
  expiry: number;
  callOrPut: boolean;
}

export interface ClammSlice {
  updateTokenA: Function;
  updateIsPut: Function;
  updateSelectedStrike: Function;
  updateUserAddress: Function;
  updateGeneratedStrikes: Function;
  updateSelectedExpiry: Function;

  /** NEWLY ADDED */
  selectedPair: ClammPair;
  updateSelectedPair: Function;
  selectedUniswapPool: UniswapV3Pool;
  updateSelectedUniswapPool: (pool: UniswapV3Pool) => void;
  tickersData: TickerData[];
  updateTickersData: (data: TickerData[]) => void;
  getClammStrikes: () => {
    callStrikes: ClammStrike[];
    putStrikes: ClammStrike[];
  };

  /** NEWLY ADDED */

  // state
  tokenA: string;
  isPut: boolean;
  breakeven: number;
  premiumPerOption: number;
  selectedStrike: number;
  isTrade: boolean;
  userAddress: Address;
  generatedStrikes: ClammStrike[];
  selectedExpiry: number;
}

export const createClammSlice: StateCreator<
  ClammSlice & WalletSlice & CommonSlice & AssetsSlice,
  [['zustand/devtools', never]],
  [],
  ClammSlice
> = (set, get) => ({
  updateTokenA: async (tokenA: string) => {
    set((prevState) => ({
      ...prevState,
      tokenA: tokenA,
    }));
  },
  tokenA: 'ARB',
  updateIsPut: async (isPut: boolean) => {
    set((prevState) => ({
      ...prevState,
      isPut: isPut,
    }));
  },
  isPut: false,
  breakeven: 0,
  premiumPerOption: 0,
  updateSelectedStrike: async (selectedStrike: number) => {
    set((prevState) => ({
      ...prevState,
      breakeven: 0,
      premiumPerOption: 0,
      selectedStrike: selectedStrike,
    }));
  },
  selectedStrike: 0,
  isTrade: true,
  userAddress: ZERO_ADDRESS as Address,
  updateUserAddress: (userAddress: Address) => {
    set((prevState) => ({
      ...prevState,
      userAddress: userAddress,
    }));
  },
  selectedPair: 'ARB-USDC',
  updateSelectedPair: (pair: ClammPair) => {
    set((prev) => {
      return {
        ...prev,
        selectedPair: pair,
      };
    });
  },
  selectedUniswapPool: {
    sqrtX96: 0n,
    token0: zeroAddress,
    token1: zeroAddress,
    currentTick: 0,
    tickSpacing: 1,
    strikes: [],
    address: zeroAddress,
    underlyingToken: zeroAddress,
    collateralToken: zeroAddress,
    optionPool: zeroAddress,
    underlyingTokenSymbol: '',
    collateralTokenSymbol: '',
    tickScaleFlipped: false,
  },
  updateSelectedUniswapPool: (pool: UniswapV3Pool) => {
    set((prev) => ({
      ...prev,
      selectedUniswapPool: pool,
    }));
  },
  generatedStrikes: [],
  updateGeneratedStrikes: (strikes: ClammStrike[]) => {
    set((prev) => ({
      ...prev,
      generatedStrikes: strikes,
    }));
  },
  updateSelectedExpiry: (expiry: number) => {
    set((prev) => ({
      ...prev,
      selectedExpiry: expiry,
    }));
  },
  selectedExpiry: 0,
  tickersData: [],
  updateTickersData: (data: TickerData[]) => {
    set((prev) => ({
      ...prev,
      tickersData: data,
    }));
  },
  getClammStrikes: () => {
    const { selectedUniswapPool, tickersData } = get();
    const { tickScaleFlipped, currentTick } = selectedUniswapPool;

    console.log(tickersData);

    const putStrikes = tickersData
      .filter(({ tickLower, tickUpper }) =>
        tickScaleFlipped ? tickUpper > currentTick : tickLower < currentTick,
      )
      .map(
        ({
          tickLower,
          tickUpper,
          liquidity,
          liquidityWithdrawn,
          liquidityUsed,
          liquidityUnused,
        }) => {
          const totalLiquidtyAtTick =
            BigInt(liquidity) - BigInt(liquidityWithdrawn);
          const liquidityUsedAtTick =
            BigInt(liquidityUsed) - BigInt(liquidityUnused);
          const availableLiquidity =
            BigInt(totalLiquidtyAtTick) - BigInt(liquidityUsedAtTick);

          let optionsAvailable = 0n;
          const { amount0, amount1 } = getAmountsForLiquidity(
            selectedUniswapPool.sqrtX96,
            getSqrtRatioAtTick(BigInt(tickLower)),
            getSqrtRatioAtTick(BigInt(tickUpper)),
            availableLiquidity,
          );

          const priceFromTick = calculatePriceFromTick(
            tickLower,
            10 ** 18,
            10 ** 6,
            tickScaleFlipped,
          );

          optionsAvailable = amount0 > amount1 ? amount0 : amount1;
          optionsAvailable =
            (optionsAvailable * BigInt(1e8)) /
            BigInt(Number(priceFromTick.toFixed(0)) * 1e8);

          return {
            strike: priceFromTick,
            lowerTick: tickLower,
            upperTick: tickUpper,
            optionsAvailable: optionsAvailable,
          };
        },
      );

    const callStrikes = tickersData
      .filter(({ tickUpper, tickLower }) =>
        tickScaleFlipped ? tickLower < currentTick : tickUpper > currentTick,
      )
      .map(
        ({
          tickLower,
          tickUpper,
          liquidityWithdrawn,
          liquidityUsed,
          liquidity,
          liquidityUnused,
        }) => {
          const totalLiquidtyAtTick =
            BigInt(liquidity) - BigInt(liquidityWithdrawn);
          const liquidityUsedAtTick =
            BigInt(liquidityUsed) - BigInt(liquidityUnused);
          const availableLiquidity =
            BigInt(totalLiquidtyAtTick) - BigInt(liquidityUsedAtTick);

          let optionsAvailable = 0n;
          const { amount0, amount1 } = getAmountsForLiquidity(
            selectedUniswapPool.sqrtX96,
            getSqrtRatioAtTick(BigInt(tickLower)),
            getSqrtRatioAtTick(BigInt(tickUpper)),
            availableLiquidity,
          );
          optionsAvailable = amount0 > amount1 ? amount0 : amount1;

          return {
            strike: calculatePriceFromTick(
              tickUpper,
              10 ** 18,
              10 ** 6,
              tickScaleFlipped,
            ),
            lowerTick: tickLower,
            upperTick: tickUpper,
            optionsAvailable: optionsAvailable,
          };
        },
      );

    return {
      callStrikes,
      putStrikes,
    };
  },
});
