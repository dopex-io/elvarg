import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface StrikesChainStore {
  selectedStrikes: Map<number, number>;
  selectStrike: Function;
  deselectStrike: Function;
  toggleSelect: Function;
}

const useStrikesChainStore = create<StrikesChainStore>((set) => ({
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
  toggleSelect: (index: number, strike: number) => {
    set((prev) => {
      const selectedStrikes = new Map(prev.selectedStrikes);
      if (selectedStrikes.has(index)) {
        selectedStrikes.delete(index);
      } else {
        selectedStrikes.set(index, strike);
      }
      return {
        ...prev,
        selectedStrikes: selectedStrikes,
      };
    });
  },
}));

export default useStrikesChainStore;
