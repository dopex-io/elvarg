import { StrikesChainAPIResponse } from 'pages/v2/clamm/utils/varrock/getStrikesChain';
import { create } from 'zustand';

type StrikesChain = StrikesChainAPIResponse;
export type SelectedStrike = {
  ttl: string;
  strike: number;
  isCall: boolean;
  amount0: number;
  amount1: number;
  tokenSymbol: string;
  tokenDecimals: number;
  meta: StrikeMeta;
};

type StrikeMeta = {
  tickLower: number;
  tickUpper: number;
  amount0: bigint;
  amount1: bigint;
};
export interface StrikesChainStore {
  reset: () => void;
  selectedStrikes: Map<number, SelectedStrike>;
  selectStrike: (index: number, strike: SelectedStrike) => void;
  deselectStrike: (index: number) => void;
  initialize: (data: StrikesChain) => void;
  strikesChain: StrikesChain;
  selectedStrikesErrors: Map<
    number,
    {
      isError: boolean;
      message: string;
    }
  >;
  setSelectedStrikesError: (key: number, error: SelectedStrikeError) => void;
}

type SelectedStrikeError = {
  isError: boolean;
  message: string;
};

const useStrikesChainStore = create<StrikesChainStore>((set) => ({
  strikesChain: [],
  selectedStrikesErrors: new Map(),
  initialize: (data: StrikesChain) => {
    set((prev) => ({
      ...prev,
      strikesChain: data,
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
  setSelectedStrikesError(key: number, error: SelectedStrikeError) {
    set((prev) => {
      const strikeError = new Map(prev.selectedStrikesErrors);
      strikeError.set(key, error);
      return {
        ...prev,
        selectedStrikesErrors: strikeError,
      };
    });
  },
  reset: () => {
    set((prev) => ({
      ...prev,
      selectedStrikes: new Map(),
    }));
  },
}));

export default useStrikesChainStore;
