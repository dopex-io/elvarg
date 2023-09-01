import { Address, formatUnits } from 'viem';

import { StateCreator } from 'zustand';

import { WalletSlice } from 'store/Wallet';

import generateStrikes from 'utils/clamm/generateStrikes';

import { MARKETS } from 'constants/clamm/markets';
import { DECIMALS_STRIKE, DECIMALS_TOKEN, ZERO_ADDRESS } from 'constants/index';

import { CommonSlice } from '../common';

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

export interface ClammBuyPosition {
  strikeSymbol: string;
  strike: number;
  size: number;
  isPut: boolean;
}

export interface ClammWritePosition {
  strikeSymbol: string;
  strike: number;
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
  updateOptionPoolsContract: Function;
  updatePositionManagerContract: Function;
  updateIsPut: Function;
  updateTokenDeps: Function;
  updateClammStrikesData: Function;
  updateSelectedStrike: Function;
  updateBuyPositions: Function;
  updateWritePositions: Function;
  updateAvailableOptions: Function;
  updateIsTrade: Function;
  updateMaxOtmPercentage: Function;
  updateStep: Function;
  updateUniswapPoolContract: Function;

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
  buyPositions: ClammBuyPosition[];
  writePositions: ClammWritePosition[];
  availableOptions: bigint;
  isTrade: boolean;
  step: number;
  maxOtmPercentage: number;
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
      get().updateBuyPositions(),
      get().updateWritePositions(),
      get().updateMaxOtmPercentage(),
      get().updateStep(),
      get().updatePositionManagerContract(),
      get().updateOptionPoolsContract(),
      get().updateUniswapPoolContract(),
    ]);
  },
  updateTokenDeps: async () => {
    get().updateStep();
    get().updateClammMarkPrice();
    get().updateClammStrikesData();
    get().updateBuyPositions();
    get().updateWritePositions();
  },
  updateClammMarkPrice: async () => {
    const tokenA = get().tokenA;
    const tokenToPrice: { [key: string]: number } = {
      ARB: 0.98,
      '42069inu': 1800,
    };
    set((prevState) => ({
      ...prevState,
      clammMarkPrice: tokenToPrice[tokenA],
    }));
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
    const markPrice = get().clammMarkPrice;
    get().updateSelectedStrike(markPrice);
    const collateralToken = MARKETS[get().tokenA];
    const isPut = get().isPut;

    if (!collateralToken.uniswapPoolAddress) {
      set((prevState) => ({
        ...prevState,
        clammStrikesData: [],
      }));
      return;
    }

    const strikes = await generateStrikes(
      collateralToken.uniswapPoolAddress,
      10,
      isPut,
    );

    if (isPut) {
      set((prevState) => ({
        ...prevState,
        clammStrikesData: generatePutStrikesData({
          strikes: strikes,
        }),
      }));
    } else {
      set((prevState) => ({
        ...prevState,
        clammStrikesData: generateCallStrikesData({
          strikes: strikes,
        }),
      }));
    }
  },
  updateOptionPoolsContract: async () => {
    set((prevState) => ({
      ...prevState,
      optionPoolsContract:
        '0xDF3d96299275E2Fb40124b8Ad9d270acFDcc6148' as Address,
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
  updateWritePositions: async () => {
    const tokenA = get().tokenA;
    const positions: ClammWritePosition[] = [
      {
        strikeSymbol: 'ARB',
        strike: Number(formatUnits(BigInt(123456789), DECIMALS_STRIKE)),
        size: Number(
          formatUnits(BigInt(Math.pow(10, 18) * 13), DECIMALS_TOKEN),
        ),
        isPut: false,
        tokenId: Number(BigInt(1)),
        earned: Number(
          formatUnits(BigInt(Math.pow(10, 18) * 13), DECIMALS_TOKEN),
        ),
        premiums: Number(
          formatUnits(BigInt(Math.pow(10, 18) * 13), DECIMALS_TOKEN),
        ),
      },
      {
        strikeSymbol: '42069inu',
        strike: Number(formatUnits(BigInt(123456789), DECIMALS_STRIKE)),
        size: Number(
          formatUnits(BigInt(Math.pow(10, 18) * 13), DECIMALS_TOKEN),
        ),
        isPut: false,
        tokenId: Number(BigInt(1)),
        earned: Number(
          formatUnits(BigInt(Math.pow(10, 18) * 13), DECIMALS_TOKEN),
        ),
        premiums: Number(
          formatUnits(BigInt(Math.pow(10, 18) * 13), DECIMALS_TOKEN),
        ),
      },
    ];
    set((prevState) => ({
      ...prevState,
      writePositions: positions.filter(
        (position) => position.strikeSymbol === tokenA,
      ),
    }));
  },
  writePositions: [],
  updateBuyPositions: async () => {
    const tokenA = get().tokenA;
    const positions: ClammBuyPosition[] = [
      {
        strikeSymbol: 'ARB',
        strike: Number(formatUnits(BigInt(123456789), DECIMALS_STRIKE)),
        size: Number(
          formatUnits(BigInt(Math.pow(10, 18) * 13), DECIMALS_TOKEN),
        ),
        isPut: false,
      },
    ];

    set((prevState) => ({
      ...prevState,
      buyPositions: positions.filter(
        (position) => position.strikeSymbol === tokenA,
      ),
    }));
  },
  buyPositions: [],
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
  updateUniswapPoolContract: () => {
    set((prevState) => ({
      ...prevState,
      uniswapPoolContract: ZERO_ADDRESS as Address,
    }));
  },
});

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
