import { Address } from 'viem';

import { OptionsPoolsAPIResponse } from 'pages/v2/clamm/utils/varrock/getOptionsPools';
import { create } from 'zustand';

export type OptionsPool = {
  pairName: string;
  pairTicker: string;
  callToken: {
    symbol: string;
    address: Address;
  };
  putToken: {
    symbol: string;
    address: Address;
  };
  optionsPoolAddress: Address;
  handlers: {
    handlerName: string;
    handlerAddress: Address;
    dexName: string;
    pairAddress: Address;
  }[];
};

type ClammStore = {
  selectedOptionsPool: OptionsPool | null;
  setSelectedOptionsPool: any;
  optionsPools: Map<string, OptionsPool>;
  initialize: (response: OptionsPoolsAPIResponse) => void;
};
const useClammStore = create<ClammStore>((set, get) => ({
  optionsPools: new Map<string, OptionsPool>(),
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
  initialize: (initialData: OptionsPoolsAPIResponse) => {
    const poolsMapping = new Map<string, OptionsPool>();
    initialData.forEach(
      ({
        callToken,
        handlers,
        optionsPoolAddress,
        pairName,
        pairTicker,
        putToken,
      }) => {
        poolsMapping.set(pairName, {
          callToken: callToken,
          handlers: handlers.map(
            ({ dexName, handlerAddress, handlerName, pairAddress }) => ({
              dexName: dexName,
              pairAddress: pairAddress,
              handlerAddress: handlerAddress,
              handlerName: handlerName,
            }),
          ),
          optionsPoolAddress: optionsPoolAddress,
          pairName: pairName,
          pairTicker: pairTicker,
          putToken: putToken,
        });
      },
    );
    set((prev) => ({
      ...prev,
      optionsPools: poolsMapping,
      selectedOptionsPool: poolsMapping.entries().next().value ?? null,
    }));
  },
}));
export default useClammStore;
