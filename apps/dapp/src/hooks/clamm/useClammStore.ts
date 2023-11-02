import { Address } from 'viem';

import { OptionsPoolsAPIResponse } from 'pages/v2/clamm/utils/varrock/getOptionsPools';
import { create } from 'zustand';

export type OptionsPool = {
  pairName: string;
  pairTicker: string;
  callToken: {
    symbol: string;
    address: Address;
    decimals: number;
  };
  putToken: {
    symbol: string;
    address: Address;
    decimals: number;
  };
  optionsPoolAddress: Address;
  tokenURIFetcher: Address;
  ttls: string[];
  ivs: string[];
  primePool: Address;
};

type TokenBalances = {
  callToken: bigint;
  putToken: bigint;
};

type ClammStore = {
  selectedOptionsPool: OptionsPool | null;
  setSelectedOptionsPool: any;
  optionsPools: Map<string, OptionsPool>;
  initialize: (response: OptionsPoolsAPIResponse) => void;

  isPut: boolean;
  setIsPut: (setAs: boolean) => void;

  isTrade: boolean;
  setIsTrade: (setAs: boolean) => void;

  selectedTTL: number;
  setSelectedTTL: (TTL: number) => void;

  tokenBalances: TokenBalances;

  setTokenBalances: (tokenBalances: TokenBalances) => void;

  markPrice: number;
  setMarkPrice: (price: number) => void;

  tick: number;
  setTick: (tick: number) => void;
};
const useClammStore = create<ClammStore>((set, get) => ({
  isPut: false,
  isTrade: false,
  markPrice: 0,
  selectedTTL: 86400,
  tick: 0,
  tokenBalances: {
    callToken: 0n,
    putToken: 0n,
  },
  setTokenBalances: (tokenBalances: TokenBalances) => {
    set((prev) => ({
      ...prev,
      tokenBalances,
    }));
  },
  setSelectedTTL: (TTL: number) => {
    set((prev) => ({
      ...prev,
      selectedTTL: TTL,
    }));
  },
  optionsPools: new Map<string, OptionsPool>(),
  setIsTrade: (setAs: boolean) => {
    set((prev) => ({
      ...prev,
      isTrade: setAs,
    }));
  },
  setIsPut: (setAs: boolean) => {
    set((prev) => ({
      ...prev,
      isPut: setAs,
    }));
  },
  selectedOptionsPool: null,
  setSelectedOptionsPool: (pairName: string) => {
    const poolToSelect = get().optionsPools.get(pairName);
    if (poolToSelect) {
      set((prev) => ({
        ...prev,
        selectedOptionsPool: poolToSelect,
      }));
    }
  },
  initialize: (initialData: OptionsPoolsAPIResponse) => {
    const poolsMapping = new Map<string, OptionsPool>();
    if (!initialData.length) return;
    initialData.forEach(
      ({
        callToken,
        optionsPoolAddress,
        pairName,
        pairTicker,
        putToken,
        ivs,
        tokenURIFetcher,
        ttls,
        primePool,
      }) => {
        poolsMapping.set(pairName, {
          callToken: callToken,
          optionsPoolAddress: optionsPoolAddress,
          pairName: pairName,
          pairTicker: pairTicker,
          putToken: putToken,
          ivs,
          tokenURIFetcher,
          ttls,
          primePool,
        });
      },
    );

    set((prev) => ({
      ...prev,
      optionsPools: poolsMapping,
      selectedOptionsPool:
        initialData.length > 0 ? poolsMapping.entries().next().value[1] : null,
    }));
  },
  setMarkPrice(price) {
    set((prev) => ({
      ...prev,
      markPrice: price,
    }));
  },
  setTick(tick) {
    set((prev) => ({
      ...prev,
      tick: tick,
    }));
  },
}));
export default useClammStore;
