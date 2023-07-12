import { Address } from 'viem';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { SsovDuration } from 'types/ssov';

export interface VaultState {
  address: Address;
  underlyingSymbol: string;
  isPut: boolean;
  duration: SsovDuration;
  collateralTokenAddress: Address;
}

interface Props {
  vault: VaultState;
  update: (vault: VaultState) => void;
  activeStrikeIndex: number;
  setActiveStrikeIndex: (index: number) => void;
}

const useVaultStore = create<Props>()(
  devtools((set) => ({
    vault: {
      address: '0x',
      underlyingSymbol: 'UNKNOWN',
      isPut: false,
      duration: 'WEEKLY',
      collateralTokenAddress: '0x',
    },
    update: (vault: VaultState) => set({ vault }),
    activeStrikeIndex: 0,
    setActiveStrikeIndex: (index: number) =>
      set((prevState) => ({ ...prevState, activeStrikeIndex: index })),
  }))
);

export default useVaultStore;
