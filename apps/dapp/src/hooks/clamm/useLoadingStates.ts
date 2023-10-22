import { create } from 'zustand';

type LoadingStates = {
  loadingStates: Map<string, boolean>;
  setLoading: (key: string, setAs: boolean) => void;
  isLoading: (key: string) => boolean;
};

const useLoadingStates = create<LoadingStates>((set, get) => ({
  loadingStates: new Map<string, boolean>(),
  setLoading(key, setAs) {
    const newState = new Map(get().loadingStates);
    newState.set(key, setAs);
    set((prev) => ({
      ...prev,
      loadingStates: newState,
    }));
  },
  isLoading(key) {
    return Boolean(get().loadingStates.get(key));
  },
}));

export default useLoadingStates;
