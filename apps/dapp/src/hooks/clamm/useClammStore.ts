import { Address } from 'viem';

import { create } from 'zustand';

import { getTokenSymbol } from 'utils/token';

export type OptionMarket = {
  deprecated: boolean;
  ticker: string;
  address: Address;
  callToken: {
    address: Address;
    decimals: number;
    symbol: string;
  };
  putToken: {
    address: Address;
    decimals: number;
    symbol: string;
  };
  pairName: string;
  primePool: Address;
  dpFee: Address;
  optionsPricing: Address;
  tokenURIFetcher: Address;
  totalPremium: string;
  totalVolume: string;
  totalFees: string;
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
  selectedOptionsMarket: OptionMarket | null;
  setSelectedOptionsMarket: (marketPair: string) => void;
  optionMarkets: Map<string, OptionMarket>;
  initialize: (response: OptionMarket[], chainId: number) => void;

  selectedAMM: string;
  setSelectedAMM: (amm: string) => void;

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
  selectedAMM: '',
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
  optionMarkets: new Map<string, OptionMarket>(),
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
  setSelectedAMM(amm) {
    const { selectedOptionsMarket } = get();
    set((prev) => ({
      ...prev,
      selectedAMM: amm,
    }));
  },
  selectedOptionsMarket: null,
  setSelectedOptionsMarket: (pairName: string) => {
    const marketToSelect = get().optionMarkets.get(pairName);
    if (marketToSelect) {
      set((prev) => ({
        ...prev,
        selectedOptionsMarket: marketToSelect,
      }));
    }
  },
  initialize: (initialData: OptionMarket[], chainId: number) => {
    const marketsMapping = new Map<string, OptionMarket>();
    if (!initialData.length) return;
    initialData.forEach(
      ({
        callToken,
        address,
        putToken,
        tokenURIFetcher,
        primePool,
        dpFee,
        optionsPricing,
        totalFees,
        totalPremium,
        totalVolume,
        ticker,
        deprecated,
      }) => {
        marketsMapping.set(
          `${getTokenSymbol({
            address: callToken.address,
            chainId,
          })}-${getTokenSymbol({
            address: putToken.address,
            chainId,
          })}`,
          {
            deprecated,
            ticker,
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
            pairName: `${getTokenSymbol({
              address: callToken.address,
              chainId,
            })}-${getTokenSymbol({
              address: putToken.address,
              chainId,
            })}`,
            address,
            tokenURIFetcher,
            primePool,
            dpFee,
            optionsPricing,
            totalFees,
            totalPremium,
            totalVolume,
          },
        );
      },
    );

    set((prev) => ({
      ...prev,
      optionMarkets: marketsMapping,
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
