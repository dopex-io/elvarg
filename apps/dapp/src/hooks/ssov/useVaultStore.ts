import { Abi } from 'viem';

import { SsovV3Router__factory } from '@dopex-io/sdk';
import { SsovDuration } from 'types/ssov';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface VaultState {
  address: string;
  base: string;
  isPut: boolean;
  duration: SsovDuration;
  currentEpoch: number;
  underlyingPrice: number;
}

interface Props {
  abi: Abi;
  vault: VaultState;
  update: (vault: VaultState) => void;
  activeStrikeIndex: number;
  setActiveStrikeIndex: (index: number) => void;
}

const useVaultStore = create<Props>()(
  devtools((set) => ({
    vault: {
      address: 'UNKNOWN',
      isPut: false,
      base: 'UNKNOWN',
      duration: 'WEEKLY',
      currentEpoch: 0,
      underlyingPrice: 0,
    },
    abi: SsovV3Router__factory.abi,
    update: (vault: VaultState) => set({ vault }),
    activeStrikeIndex: 0,
    setActiveStrikeIndex: (index: number) =>
      set((prevState) => ({ ...prevState, activeStrikeIndex: index })),
  }))
);

export default useVaultStore;
