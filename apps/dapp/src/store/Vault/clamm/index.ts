import { Address, formatUnits, zeroAddress } from 'viem';

import axios from 'axios';
import { StateCreator } from 'zustand';

import { WalletSlice } from 'store/Wallet';

import { ClammStrike } from 'hooks/clamm/usePositionManager';

import getMarketInformation from 'utils/clamm/getMarketInformation';

import { DECIMALS_STRIKE, ZERO_ADDRESS } from 'constants/index';
import { TOKEN_DATA } from 'constants/tokens';

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
  size: number;
  isPut: boolean;
  tokenId: number;
  earned: number;
  premiums: number;
}

export interface ClammSlice {
  updateClammData: Function;
  updateClammMarkPrice: Function;
  updateClammOpenInterest: Function;
  updateClammTotalVolume: Function;
  updateTokenA: Function;
  updatePositionManagerContract: Function;
  updateIsPut: Function;
  updateTokenDeps: Function;
  updateClammStrikesData: Function;
  updateSelectedStrike: Function;
  updateAvailableOptions: Function;
  updateIsTrade: Function;
  updateMaxOtmPercentage: Function;
  updateStep: Function;
  updateUserAddress: Function;
  updateGeneratedStrikes: Function;
  updateSelectedExpiry: Function;

  /** NEWLY ADDED */
  selectedPair: ClammPair;
  updateSelectedPair: Function;
  selectedUniswapPool: UniswapV3Pool;
  updateSelectedUniswapPool: (pool: UniswapV3Pool) => void;

  /** NEWLY ADDED */

  // state
  clammMarkPrice: number;
  clammOpenInterest: bigint;
  clammTotalVolume: bigint;
  tokenA: string;
  optionPoolsContract: Address;
  positionManagerContract: Address;
  uniswapPoolContract: Address;
  isPut: boolean;
  breakeven: number;
  premiumPerOption: number;
  clammStrikesData: ClammStrikeData[];
  selectedStrike: number;
  availableOptions: bigint;
  isTrade: boolean;
  step: number;
  maxOtmPercentage: number;
  userAddress: Address;
  generatedStrikes: ClammStrike[];
  selectedExpiry: number;
}

export const createClammSlice: StateCreator<
  ClammSlice & WalletSlice & CommonSlice,
  [['zustand/devtools', never]],
  [],
  ClammSlice
> = (set, get) => ({
  updateClammData: async () => {
    Promise.all([
      get().updateClammMarkPrice(),
      get().updateClammOpenInterest(),
      get().updateClammTotalVolume(),
      get().updateClammStrikesData(),
      get().updateMaxOtmPercentage(),
      get().updateStep(),
      get().updatePositionManagerContract(),
      // get().updateOptionPoolsContract(),
      // get().updateUniswapPoolContract(),
    ]);
  },
  updateTokenDeps: async () => {
    // get().updateStep();
    get().updateClammMarkPrice();
    get().updateClammStrikesData();
  },
  updateClammMarkPrice: async () => {
    const tokenA = get().tokenA;
    let currentPrice = 0;

    const tokenId = TOKEN_DATA[tokenA].cgId;
    if (tokenId) {
      try {
        axios
          .get(
            `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`,
          )
          .then(async (payload) => {
            currentPrice = payload.data[tokenId].usd;
            set((prevState) => ({
              ...prevState,
              clammMarkPrice: currentPrice,
            }));
          });
      } catch (e) {
        console.log(e);
      }
    }
  },
  updateClammOpenInterest: async () => {
    set((prevState) => ({
      ...prevState,
      clammOpenInterest: BigInt(Math.pow(10, 23)),
    }));
  },
  updateClammTotalVolume: async () => {
    set((prevState) => ({
      ...prevState,
      clammTotalVolume: BigInt(Math.pow(10, 24)),
    }));
  },
  clammMarkPrice: 0,
  clammOpenInterest: BigInt(0),
  clammTotalVolume: BigInt(0),
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
  updateMaxOtmPercentage: async () => {
    set((prevState) => ({
      ...prevState,
      maxOtmPercentage: 20,
    }));
  },
  updateStep: async () => {
    const tokenA = get().tokenA;
    const tokenToStrike: { [key: string]: number } = {
      ARB: 0.1,
      '42069inu': 50,
    };
    set((prevState) => ({
      ...prevState,
      step: tokenToStrike[tokenA],
    }));
  },
  step: 0,
  maxOtmPercentage: 0,
  clammStrikesData: [],
  updateClammStrikesData: async () => {
    // get().updateSelectedStrike(markPrice);

    const { isPut, selectedPair } = get();

    const { uniswapPoolAddress } = getMarketInformation(selectedPair);

    if (!uniswapPoolAddress) {
      set((prevState) => ({
        ...prevState,
        clammStrikesData: [],
      }));
      return;
    } else {
      set((prevState) => ({
        ...prevState,
        uniswapPoolContract: uniswapPoolAddress as Address,
      }));
    }

    const strikes: any[] = [];

    const strikesData = isPut
      ? generatePutStrikesData({
          strikes: strikes,
        })
      : generateCallStrikesData({
          strikes: strikes,
        });

    set((prevState) => ({
      ...prevState,
      clammStrikesData: strikesData,
    }));
  },
  updatePositionManagerContract: async () => {
    set((prevState) => ({
      ...prevState,
      positionManagerContract:
        '0xDF3d96299275E2Fb40124b8Ad9d270acFDcc6148' as Address,
    }));
  },
  optionPoolsContract: ZERO_ADDRESS as Address,
  positionManagerContract: ZERO_ADDRESS as Address,
  updateSelectedStrike: async (selectedStrike: number) => {
    set((prevState) => ({
      ...prevState,
      breakeven: 0,
      premiumPerOption: 0,
      selectedStrike: selectedStrike,
    }));
  },
  selectedStrike: 0,
  updateAvailableOptions: async () => {
    set((prevState) => ({
      ...prevState,
      availableOptions: BigInt(123),
    }));
  },
  availableOptions: BigInt(0),
  isTrade: true,
  updateIsTrade: (isTrade: boolean) => {
    set((prevState) => ({
      ...prevState,
      isTrade: isTrade,
    }));
  },
  uniswapPoolContract: ZERO_ADDRESS as Address,
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
});

// END

function generateCallStrikesData({
  strikes,
}: {
  strikes: number[];
}): ClammStrikeData[] {
  return strikes.map((strike) => {
    const strikePremiumRaw = BigInt(Math.pow(10, 8) * 2.789);
    const premiumPerOption = Number(
      formatUnits(strikePremiumRaw, DECIMALS_STRIKE),
    );
    const strikeIvRaw = BigInt(139);
    const iv = Number(strikeIvRaw);

    return {
      strike: strike,
      liquidity: 123,
      premiumPerOption: premiumPerOption,
      iv: iv,
      breakeven: strike + premiumPerOption,
      delta: 0,
      theta: 0,
      vega: 0,
      gamma: 0,
      utilization: 0,
      tvl: 0,
      apy: 0,
      premiumApy: 0,
    };
  });
}

function generatePutStrikesData({
  strikes,
}: {
  strikes: number[];
}): ClammStrikeData[] {
  return strikes.map((strike) => {
    const strikePremiumRaw = BigInt(Math.pow(10, 8) * 2.789);
    const premiumPerOption = Number(
      formatUnits(strikePremiumRaw, DECIMALS_STRIKE),
    );
    const strikeIvRaw = BigInt(139);
    const iv = Number(strikeIvRaw);

    return {
      strike: strike,
      liquidity: 234,
      premiumPerOption: premiumPerOption,
      iv: iv,
      breakeven: strike - premiumPerOption,
      delta: 0,
      theta: 0,
      vega: 0,
      gamma: 0,
      utilization: 0,
      tvl: 0,
      apy: 0,
      premiumApy: 0,
    };
  });
}
