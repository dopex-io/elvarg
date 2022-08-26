import create from 'zustand';
import { /* persist, */ devtools } from 'zustand/middleware';

import { WalletSlice, createWalletSlice } from './Wallet';
import { AssetsSlice, createAssetsSlice } from './Assets';
import { FarmingSlice, createFarmingSlice } from './Farming';

type T = WalletSlice & AssetsSlice & FarmingSlice;

export const useBoundStore = create<T>()(
  devtools((...a) => ({
    ...createWalletSlice(...a),
    ...createAssetsSlice(...a),
    ...createFarmingSlice(...a),
  }))
);
