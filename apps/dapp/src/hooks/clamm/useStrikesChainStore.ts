import { Address } from 'viem';

import { create } from 'zustand';

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
    hook: string;
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
  strike: number;
  tickLower: number;
  tickUpper: number;
};

export interface StrikesChainStore {
  reset: () => void;
  selectedStrikes: Map<string, SelectedStrike>;
  selectStrike: (index: string, strike: SelectedStrike) => void;
  deselectStrike: (index: string) => void;
  initialize: (data: StrikesChainMappingArray, chainId: number) => void;
  strikesChain: Map<string, StrikesChainItem[]>;
  updateStrikes: () => void;
  setUpdateStrikes: (fn: () => void) => void;
  getCollateralAvailable: (strike: string) => {
    hook: string;
    name: string;
    deprecated: boolean;
    handler: string;
    pool: string;
    availableLiquidity: bigint;
    availableTokenLiquidity: bigint;
  }[];
  getPurchasableStrikesChain: () => {
    strike: number;
    tickLower: number;
    tickUpper: number;
  }[];
}

const useStrikesChainStore = create<StrikesChainStore>((set, get) => ({
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
  selectStrike: (index: string, strikeData: SelectedStrike) => {
    set((prev) => {
      const selectedStrikes = new Map(prev.selectedStrikes);
      selectedStrikes.set(index, strikeData);
      return {
        ...prev,
        selectedStrikes: selectedStrikes,
      };
    });
  },
  deselectStrike: (index: string) => {
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
  getCollateralAvailable(strike: string) {
    const { strikesChain } = get();
    const strikesChainData = strikesChain.get(strike);
    const liquidityData = strikesChainData
      ? strikesChainData
          .map(
            ({
              meta: { availableTokenLiquidity, availableLiquidity, hook },
              handler,
            }) => ({
              hook,
              availableLiquidity: BigInt(availableLiquidity),
              availableTokenLiquidity: BigInt(availableTokenLiquidity),
              ...handler,
            }),
          )
          .filter(({ deprecated }) => !deprecated)
      : [];

    return liquidityData;
  },
  getPurchasableStrikesChain() {
    const { strikesChain } = get();
    const strikes: {
      strike: number;
      tickLower: number;
      tickUpper: number;
    }[] = Array.from(strikesChain).map(([strike, strikeData]) => ({
      strike: Number(strike),
      tickLower: strikeData[0].meta.tickLower,
      tickUpper: strikeData[0].meta.tickUpper,
    }));

    return strikes;
  },
}));

export default useStrikesChainStore;
