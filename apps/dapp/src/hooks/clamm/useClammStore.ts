import { Address } from 'viem';

import { create } from 'zustand';

import { OptionsPoolsAPIResponse } from 'utils/clamm/varrock/getOptionsPools';
import { getTokenSymbol } from 'utils/token';

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
  callTokenSymbol: string;
  putTokenSymbol: string;
  readableCallToken: string;
  readablePutToken: string;
};

type Addresses = {
  positionManager: Address;
  handler: Address;
};

type ClammStore = {
  selectedOptionsPool: OptionsPool | null;
  setSelectedOptionsPool: any;
  optionsPools: Map<string, OptionsPool>;
  initialize: (response: OptionsPoolsAPIResponse, chainId: number) => void;

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

  addresses: Addresses | null;
  setAddresses: (addresses: Addresses) => void;
};
const useClammStore = create<ClammStore>((set, get) => ({
  addresses: null,
  isPut: false,
  isTrade: true,
  markPrice: 0,
  selectedTTL: 86400,
  tick: 0,
  tokenBalances: {
    callToken: 0n,
    putToken: 0n,
    callTokenSymbol: '-',
    putTokenSymbol: '-',
    readableCallToken: '0',
    readablePutToken: '0',
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
  initialize: (initialData: OptionsPoolsAPIResponse, chainId: number) => {
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
          callToken: {
            ...callToken,
            symbol: getTokenSymbol({
              address: callToken.address,
              chainId,
            }),
          },
          putToken: {
            ...putToken,
            symbol: getTokenSymbol({
              address: putToken.address,
              chainId,
            }),
          },
          optionsPoolAddress: optionsPoolAddress,
          pairName: pairName,
          pairTicker: pairTicker,
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
  setAddresses(addresses) {
    set((prev) => ({
      ...prev,
      addresses: addresses,
    }));
  },
}));
export default useClammStore;
