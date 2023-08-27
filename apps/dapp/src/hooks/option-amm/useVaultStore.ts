import { Address } from 'viem';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { AmmDuration } from 'constants/optionAmm/markets';

export interface VaultState {
  symbol: string;
  address: Address;
  underlyingSymbol: string;
  underlyingAddress: Address;
  duration: AmmDuration;
  isPut: boolean;
  lp: Address;
  collateralTokenAddress: Address;
  collateralSymbol: string;
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
      symbol: '',
      address: '0x',
      lp: '0x',
      underlyingAddress: '0x',
      underlyingSymbol: 'UNKNOWN',
      duration: 'WEEKLY',
      isPut: false,
      collateralTokenAddress: '0x',
      collateralSymbol: '0x',
    },
    update: (vault: VaultState) => set({ vault }),
    activeStrikeIndex: 2,
    setActiveStrikeIndex: (index: number) =>
      set((prevState) => ({ ...prevState, activeStrikeIndex: index })),
  })),
);

export default useVaultStore;
