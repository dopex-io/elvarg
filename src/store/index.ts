import create from 'zustand';
import { devtools } from 'zustand/middleware';

import { WalletSlice, createWalletSlice } from './Wallet';
import { AssetsSlice, createAssetsSlice } from './Assets';
import { FarmingSlice, createFarmingSlice } from './Farming';
import { SsovV3Slice, createSsovV3Slice } from './Ssov';

type T = WalletSlice & AssetsSlice & FarmingSlice & SsovV3Slice; // & SsovSlice;

export const useBoundStore = create<T>()(
  devtools((...a) => ({
    ...createWalletSlice(...a),
    ...createAssetsSlice(...a),
    ...createFarmingSlice(...a),
    ...createSsovV3Slice(...a),
  }))
);
