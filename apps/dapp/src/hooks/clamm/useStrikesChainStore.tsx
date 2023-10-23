import { StrikesChainAPIResponse } from 'pages/v2/clamm/utils/varrock/getStrikesChain';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type StrikesChain = StrikesChainAPIResponse;
export interface StrikesChainStore {
  selectedStrikes: Map<number, number>;
  selectStrike: (index: number, strike: any) => void;
  deselectStrike: (index: number) => void;
  initialize: (data: StrikesChainAPIResponse) => void;
  strikesChain: StrikesChain;
}

const useStrikesChainStore = create<StrikesChainStore>((set) => ({
  strikesChain: [],
  initialize: (data: StrikesChain) => {
    console.log(data);
    set((prev) => ({
      ...prev,
      strikesChain: data,
    }));
  },
  selectedStrikes: new Map(),
  selectStrike: (index: number, strike: number) => {
    set((prev) => {
      const selectedStrikes = new Map(prev.selectedStrikes);
      selectedStrikes.set(index, strike);
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
}));

export default useStrikesChainStore;
