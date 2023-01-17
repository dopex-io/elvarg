import { StateCreator } from 'zustand';

export interface CommonSlice {
  selectedEpoch: number | 1;
  setSelectedEpoch: Function;
  selectedPoolName: string;
  setSelectedPoolName: Function;
  isLoading: boolean;
  setIsLoading: Function;
  selectedIsPut: boolean | false;
  setSelectedIsPut: Function;
}

export const createCommonSlice: StateCreator<
  CommonSlice,
  [['zustand/devtools', never]],
  [],
  CommonSlice
> = (set, _) => ({
  selectedEpoch: 1,
  setSelectedEpoch: (epoch: number) =>
    set((prevState) => ({ ...prevState, selectedEpoch: epoch })),
  selectedPoolName: '',
  setSelectedPoolName: (selectedPoolName: string) =>
    set((prevState) => ({ ...prevState, selectedPoolName })),
  isLoading: false,
  setIsLoading: (condition: boolean) =>
    set((prevState) => ({
      ...prevState,
      isLoading: condition,
    })),
  selectedIsPut: false,
  setSelectedIsPut: (isPut: boolean) =>
    set((prevState) => ({
      ...prevState,
      selectedIsPut: isPut,
    })),
});
