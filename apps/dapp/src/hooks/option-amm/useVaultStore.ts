import { Address } from 'viem';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { AmmDuration, vaultZeroState } from 'constants/optionAmm/markets';

export interface VaultState {
  isPut: boolean;
  duration: AmmDuration;
  symbol: string;
  address: Address;
  lp: Address;
  underlyingSymbol: string;
  underlyingTokenAddress: Address;
  collateralSymbol: string;
  collateralTokenAddress: Address;
  portfolioManager: Address;
  positionMinter: Address;
}

interface Props {
  vault: VaultState;
  update: (vault: VaultState) => void;
  activeStrikeIndex: number;
  setActiveStrikeIndex: (index: number) => void;
}

const useVaultStore = create<Props>()(
  devtools((set) => ({
    vault: vaultZeroState,
    update: (vault: VaultState) => set({ vault }),
    activeStrikeIndex: 2,
    setActiveStrikeIndex: (index: number) =>
      set((prevState) => ({ ...prevState, activeStrikeIndex: index })),
  })),
);

export default useVaultStore;
