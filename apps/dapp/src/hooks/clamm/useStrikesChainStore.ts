import { Address } from 'viem';

import { create } from 'zustand';

import { getTokenSymbol } from 'utils/token';

export type StrikesChainMappingArray = Record<string, StrikesChainItem[]>[];

export type StrikesChainItem = {
  totalLiquidity: string;
  availableLiquidity: string;
  token: {
    address: Address;
    decimals: number;
    symbol: string;
  };
  utilization: string;
  apr: string;
  handler: {
    name: string;
    deprecated: boolean;
    handler: string;
    pool: string;
  };
  meta: {
    totalTokenLiquidity: string;
    availableTokenLiquidity: string;
    tickLower: number;
    tickUpper: number;
    totalLiquidity: string;
    availableLiquidity: string;
  };
};

export type StrikesChain = StrikesChainItem[];

export type SelectedStrike = {
  ttl: string;
  strike: number;
  isCall: boolean;
  amount0: number;
  amount1: string;
  tokenSymbol: string;
  tokenDecimals: number;
  meta: StrikeMeta;
};

type StrikeMeta = {
  totalTokenLiquidity: bigint;
  availableTokenLiquidity: bigint;
  tickLower: number;
  tickUpper: number;
  totalLiquidity: bigint;
  availableLiquidity: bigint;
};
export interface StrikesChainStore {
  reset: () => void;
  selectedStrikes: Map<number, SelectedStrike>;
  selectStrike: (index: number, strike: SelectedStrike) => void;
  deselectStrike: (index: number) => void;
  initialize: (data: StrikesChainMappingArray, chainId: number) => void;
  strikesChain: Map<string, StrikesChainItem[]>;
  updateStrikes: () => void;
  setUpdateStrikes: (fn: () => void) => void;
}

const useStrikesChainStore = create<StrikesChainStore>((set) => ({
  updateStrikes: () => {},
  strikesChain: new Map(),
  selectedStrikesErrors: new Map(),
  initialize: (data: StrikesChainMappingArray, chainId: number) => {
    if (!data['forEach']) return;
    const _strikesChain = new Map<string, StrikesChainItem[]>();
    data.forEach((each) => {
      const strike = Object.keys(each)[0];
      _strikesChain.set(strike, each[strike]);
    });
    set((prev) => ({
      ...prev,
      strikesChain: _strikesChain,
    }));
  },
  selectedStrikes: new Map(),
  selectStrike: (index: number, strikeData: SelectedStrike) => {
    set((prev) => {
      const selectedStrikes = new Map(prev.selectedStrikes);
      selectedStrikes.set(index, strikeData);
      return {
        ...prev,
        selectedStrikes: selectedStrikes,
      };
    });
  },
  deselectStrike: (index: number) => {
    set((prev) => {
      const selectedStrikes = new Map(prev.selectedStrikes);
      selectedStrikes.delete(index);

      return {
        ...prev,
        selectedStrikes: selectedStrikes,
      };
    });
  },
  reset: () => {
    set((prev) => ({
      ...prev,
      selectedStrikes: new Map(),
    }));
  },
  setUpdateStrikes(fn) {
    set((prev) => ({
      ...prev,
      updateStrikes: fn,
    }));
  },
}));

export default useStrikesChainStore;
