import { StateCreator } from 'zustand';
import {
  GmxReader__factory,
  GmxReader,
  GmxVault__factory,
  GmxVault,
} from '@dopex-io/sdk';

import { WalletSlice } from 'store/Wallet';

export interface GmxSlice {
  gmxReader?: GmxReader;
  updateGmxReader: Function;
  gmxVault?: GmxVault;
  updateGmxVault: Function;
}

export const createGmxSlice: StateCreator<
  WalletSlice & GmxSlice,
  [['zustand/devtools', never]],
  [],
  GmxSlice
> = (set, get) => ({
  updateGmxReader: async () => {
    const { contractAddresses, provider } = get();

    if (!contractAddresses || !provider) return;

    set((prevState) => ({
      ...prevState,
      gmxReader: GmxReader__factory.connect(
        contractAddresses['GMX-READER'],
        provider
      ),
    }));
  },
  updateGmxVault: async () => {
    const { contractAddresses, provider } = get();

    if (!contractAddresses || !provider) return;

    set((prevState) => ({
      ...prevState,
      gmxVault: GmxVault__factory.connect(
        contractAddresses['GMX-VAULT'],
        provider
      ),
    }));
  },
});
