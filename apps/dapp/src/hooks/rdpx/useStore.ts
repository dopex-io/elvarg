import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const rdpxV2Actions = ['bond', 'lp' /*, 'stake' , 'farm' */] as const;
export type RdpxV2State = (typeof rdpxV2Actions)[number];

interface Props {
  state: RdpxV2State;
  update: (state: RdpxV2State) => void;
}

const useStore = create<Props>()(
  devtools((set) => ({
    state: 'bond',
    update: (state: RdpxV2State) => set({ state }),
  })),
);

export default useStore;
