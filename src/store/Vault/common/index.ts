import { StateCreator } from 'zustand';

export interface CommonSlice {
  selectedEpoch: number | null;
  setSelectedEpoch: Function;
  selectedPoolName: string;
  setSelectedPoolName: Function;
}

export const createCommonSlice: StateCreator<
  CommonSlice,
  [['zustand/devtools', never]],
  [],
  CommonSlice
> = (set, _) => ({
  selectedEpoch: 0,
  setSelectedEpoch: (epoch: number) =>
    set((prevState) => ({ ...prevState, selectedEpoch: epoch })),
  selectedPoolName: '',
  setSelectedPoolName: (selectedPoolName: string) =>
    set((prevState) => ({ ...prevState, selectedPoolName })),
});
