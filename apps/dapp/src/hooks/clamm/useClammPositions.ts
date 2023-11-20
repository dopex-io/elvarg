import { create } from 'zustand';

import {
  LPPositionsResponse,
  OptionsPositionsResponse,
} from 'utils/clamm/varrock/types';

type ClammPositions = {
  buyPositions: OptionsPositionsResponse[];
  lpPositions: LPPositionsResponse[];
  setBuyPositions: (positions: OptionsPositionsResponse[]) => void;
  setLPPositions: (positions: LPPositionsResponse[]) => void;
  updateBuyPositions?: () => Promise<void>;
  updateLPPositions?: () => Promise<void>;
  setUpdateBuyPositions: (update: () => Promise<void>) => void;
  setUpdateLPPositions: (update: () => Promise<void>) => void;
};

const useClammPositions = create<ClammPositions>((set, get) => ({
  buyPositions: [],
  lpPositions: [],
  setBuyPositions(positions) {
    set((prev) => ({
      ...prev,
      buyPositions: positions,
    }));
  },
  setLPPositions(positions) {
    set((prev) => ({
      ...prev,
      lpPositions: positions,
    }));
  },
  setUpdateBuyPositions(update) {
    set((prev) => ({
      ...prev,
      updateBuyPositions: update,
    }));
  },
  setUpdateLPPositions(update) {
    set((prev) => ({
      ...prev,
      updateLPPositions: update,
    }));
  },
}));

export default useClammPositions;
