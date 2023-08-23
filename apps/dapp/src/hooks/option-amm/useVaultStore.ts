import { Address } from 'viem';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { AmmDuration } from 'constants/optionAmm/markets';

export interface VaultState {
  address: Address;
  underlyingSymbol: string;
  duration: AmmDuration;
  lp: Address;
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
      lp: '0x',
      underlyingSymbol: 'UNKNOWN',
      duration: 'WEEKLY',
      collateralTokenAddress: '0x',
    },
    update: (vault: VaultState) => set({ vault }),
    activeStrikeIndex: 2,
    setActiveStrikeIndex: (index: number) =>
      set((prevState) => ({ ...prevState, activeStrikeIndex: index })),
  })),
);

export default useVaultStore;
