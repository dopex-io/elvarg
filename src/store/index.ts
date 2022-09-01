import create from 'zustand';
import { devtools } from 'zustand/middleware';

import { WalletSlice, createWalletSlice } from './Wallet';
import { AssetsSlice, createAssetsSlice } from './Assets';
import { FarmingSlice, createFarmingSlice } from './Farming';
import { SsovV3Slice, createSsovV3Slice } from './Ssov';
import { RateVaultSlice, createRateVaultSlice } from './Vault/ir';
import { CommonSlice, createCommonSlice } from './Vault/common';

type T = WalletSlice &
  AssetsSlice &
  FarmingSlice &
  SsovV3Slice &
  RateVaultSlice &
  CommonSlice;

export const useBoundStore = create<T>()(
  devtools((...a) => ({
    ...createWalletSlice(...a),
    ...createAssetsSlice(...a),
    ...createFarmingSlice(...a),
    ...createCommonSlice(...a),
    ...createSsovV3Slice(...a),
    ...createRateVaultSlice(...a),
  }))
);
