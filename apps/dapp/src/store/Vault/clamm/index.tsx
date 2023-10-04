import { Address, zeroAddress } from 'viem';

import { StateCreator } from 'zustand';

import { AssetsSlice } from 'store/Assets';
import { WalletSlice } from 'store/Wallet';

import { TickDataWithPremiums } from 'utils/clamm/getTicksPremiumAndBreakeven';
import {
  getLiquidityForAmount0,
  getLiquidityForAmount1,
} from 'utils/clamm/liquidityAmountMath';
import { OptionsPosition } from 'utils/clamm/parseOptionsPosition';
import { WritePosition } from 'utils/clamm/parseWritePosition';

import { VALID_CLAMM_PAIRS } from 'constants/clamm';

import { CommonSlice } from '../common';

export type Strikes = {
  callPurchaseStrikes: PurchaseStrike[];
  putPurchaseStrikes: PurchaseStrike[];
  callDepositStrikes: DepositStrike[];
  putDepositStrikes: DepositStrike[];
};

export type DepositStrike = {
  tickLower: number;
  tickUpper: number;
  tickLowerPrice: number;
  tickUpperPrice: number;
};

export type PurchaseStrike = DepositStrike & {
  optionsAvailable: string;
};

type OptionsPoolPairWithSymbolsOnly = {
  joined: string;
  underlyingTokenSymbol: string;
  collateralTokenSymbol: string;
};

export type OptionsPositionWithTimestamp = OptionsPosition & {
  timestamp: number;
};

const DEFAULT_CLAMM_OPTIONS_POOL_PAIR = {
  joined: 'ARB-USDC',
  underlyingTokenSymbol: 'ARB',
  collateralTokenSymbol: 'USDC',
};

const DEFAULT_CLAMM_LOADING_STATES = {
  optionsPool: false,
  ticksData: false,
  positions: false,
  asidePanelButton: false,
  tokenAmountsToSpend: false,
  writePositions: false,
  optionsPositions: false,
  positionsHistory: false,
};

type OptionsPool = {
  address: Address;
  uniswapV3PoolAddress: Address;

  // Tick info
  sqrtX96Price: bigint;
  tick: number;
  tickSpacing: number;
  // Token info
  token0Symbol: string;
  token0Address: Address;
  token0Decimals: number;

  token1Symbol: string;
  token1Decimals: number;
  token1Address: Address;

  inversePrice: boolean;

  getLiquidityForAmounts0: typeof getLiquidityForAmount0;
  getLiquidityForAmounts1: typeof getLiquidityForAmount1;
};

export type ClammSlice = {
  fullReload: Function;
  setFullReload: (fn: Function) => void;
  positionManagerAddress: Address;
  setPositionManagerAddress: (address: Address) => void;

  updateOptionsPoolTickAndSqrtX96Price: (
    tick: number,
    sqrtX96Price: bigint,
  ) => void;

  // StrikesTable <=> AsidePanel
  selectedClammExpiry: number;
  updateSelectedExpiry: (expiry: number) => void;

  selectedClammStrike: DepositStrike | PurchaseStrike | undefined;
  setSelectedClammStrike: (
    selectedStrike: DepositStrike | PurchaseStrike | undefined,
  ) => void;

  markPrice: number;
  setMarkPrice: (price: number) => void;

  ticksData: TickDataWithPremiums[];
  setTicksData: (ticksData: TickDataWithPremiums[]) => void;

  // Pairs
  setSelectedOptionsPoolPair: Function;
  selectedOptionsPoolPair: OptionsPoolPairWithSymbolsOnly;

  // Options pool
  optionsPool?: OptionsPool;
  setOptionsPool: (optionsPool: OptionsPool) => void;

  keys: Keys;
  setKeys: (keys: typeof DEFAULT_CLAMM_KEYS) => void;

  userClammPositions: PositionTypes;
  setUserClammPositions: <T extends keyof PositionTypes>(
    positionType: T,
    positions: PositionTypes[T],
  ) => void;

  // Loading
  loading: typeof DEFAULT_CLAMM_LOADING_STATES;
  setLoading: (
    key: keyof typeof DEFAULT_CLAMM_LOADING_STATES,
    setAs: boolean,
  ) => void;

  isPut: boolean;
  setIsPut: (isPut: boolean) => void;

  userAddress: Address;
  updateUserAddress: Function;
};

type PositionTypes = {
  writePositions: WritePosition[];
  optionsPositions: OptionsPosition[];
  optionsPurchases: OptionsPositionWithTimestamp[];
  optionsExercises: OptionsPositionWithTimestamp[];
};

const DEFAULT_CLAMM_KEYS: Keys = {
  putAssetAmountKey: 'token1Amount',
  putAssetSymbolKey: 'token1Symbol',
  putAssetDecimalsKey: 'token1Decimals',
  putAssetAddressKey: 'token1Address',
  putAssetGetLiquidity: 'getLiquidityForAmounts1',
  callAssetAmountKey: 'token0Amount',
  callAssetSymbolKey: 'token0Symbol',
  callAssetDecimalsKey: 'token0Decimals',
  callAssetAddressKey: 'token0Address',
  callAssetGetLiquidity: 'getLiquidityForAmounts0',
};

type TokenAmountKeysToData = 'token0Amount' | 'token1Amount';
type TokenDecimalKeysToData = 'token0Decimals' | 'token1Decimals';
type TokenSymbolKeysToData = 'token0Symbol' | 'token1Symbol';
type TokenAddressKeysToData = 'token0Address' | 'token1Address';
type TokenGetAmountsForLiquidity =
  | 'getLiquidityForAmounts0'
  | 'getLiquidityForAmounts1';

type Keys = {
  callAssetAmountKey: TokenAmountKeysToData;
  callAssetSymbolKey: TokenSymbolKeysToData;
  callAssetDecimalsKey: TokenDecimalKeysToData;
  callAssetAddressKey: TokenAddressKeysToData;
  callAssetGetLiquidity: TokenGetAmountsForLiquidity;
  putAssetAmountKey: TokenAmountKeysToData;
  putAssetSymbolKey: TokenSymbolKeysToData;
  putAssetDecimalsKey: TokenDecimalKeysToData;
  putAssetAddressKey: TokenAddressKeysToData;
  putAssetGetLiquidity: TokenGetAmountsForLiquidity;
};

export const createClammSlice: StateCreator<
  WalletSlice & CommonSlice & AssetsSlice & ClammSlice,
  [['zustand/devtools', never]],
  [],
  ClammSlice
> = (set, get) => ({
  loading: DEFAULT_CLAMM_LOADING_STATES,
  setLoading: (
    key: keyof typeof DEFAULT_CLAMM_LOADING_STATES,
    setAs: boolean,
  ) => {
    let { loading } = get();
    loading[key] = setAs;
    set((prev) => ({
      ...prev,
      loading,
    }));
  },
  selectedOptionsPoolPair: DEFAULT_CLAMM_OPTIONS_POOL_PAIR,
  setSelectedOptionsPoolPair: (
    underlyingTokenSymbol: string,
    collateralTokenSymbol: string,
  ) => {
    const pairSymbolsJoined = `${underlyingTokenSymbol}-${collateralTokenSymbol}`;
    if (!VALID_CLAMM_PAIRS.includes(pairSymbolsJoined)) {
      console.error(
        `[slice/clamm/setSelectedOptionsPoolPair] ${pairSymbolsJoined} is not a available pair.`,
      );
      return;
    } else {
      const selectedPoolPairToSet = {
        joined: pairSymbolsJoined,
        underlyingTokenSymbol,
        collateralTokenSymbol,
      };
      set((prev) => ({
        ...prev,
        selectedOptionsPoolPair: selectedPoolPairToSet,
      }));
    }
  },
  setOptionsPool: (optionsPool: OptionsPool) => {
    set((prev) => ({
      ...prev,
      optionsPool,
    }));
  },
  ticksData: [],
  setTicksData: (ticksData: TickDataWithPremiums[]) => {
    set((prev) => ({
      ...prev,
      ticksData: ticksData,
    }));
  },
  selectedClammExpiry: 1200,
  updateSelectedExpiry: (expiry: number) => {
    set((prev) => ({
      ...prev,
      selectedClammExpiry: expiry,
    }));
  },
  isPut: false,
  setIsPut: (isPut: boolean) => {
    set((prev) => ({
      ...prev,
      isPut: isPut,
    }));
  },
  markPrice: 0,
  setMarkPrice: (price: number) => {
    set((prev) => ({
      ...prev,
      markPrice: price,
    }));
  },
  keys: DEFAULT_CLAMM_KEYS,
  setKeys: (keys: any) => {
    set((prev) => ({
      ...prev,
      keys: keys,
    }));
  },
  userClammPositions: {
    writePositions: [],
    optionsPositions: [],
    optionsPurchases: [],
    optionsExercises: [],
  },
  setUserClammPositions: (positionType, positions) => {
    const { userClammPositions } = get();
    const withNewPositions = {
      ...userClammPositions,
      [positionType]: positions,
    };

    set((prev) => ({
      ...prev,
      userClammPositions: withNewPositions,
    }));
  },
  updateOptionsPoolTickAndSqrtX96Price: (
    tick: number,
    sqrtX96Price: bigint,
  ) => {
    let { optionsPool } = get();
    if (!optionsPool) return;
    optionsPool.sqrtX96Price = sqrtX96Price;
    optionsPool.tick = tick;
    set((prev) => ({
      ...prev,
      optionsPool,
    }));
  },
  selectedClammStrike: undefined,
  setSelectedClammStrike: (
    selected: DepositStrike | PurchaseStrike | undefined,
  ) => {
    set((prev) => ({
      ...prev,
      selectedClammStrike: selected,
    }));
  },
  positionManagerAddress: zeroAddress,
  setPositionManagerAddress: (address: Address) => {
    set((prev) => ({
      ...prev,
      positionManagerAddress: address,
    }));
  },
  userAddress: zeroAddress,
  updateUserAddress: (address: Address) => {
    if (!address) return;
    set((prev) => ({
      ...prev,
      userAddress: address,
    }));
  },
  fullReload: async () => {},
  setFullReload: (fn: Function) => {
    set((prev) => ({
      ...prev,
      fullReload: fn,
    }));
  },
});
