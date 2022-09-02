import create from 'zustand';
import { devtools } from 'zustand/middleware';

import { WalletSlice, createWalletSlice } from './Wallet';
import { AssetsSlice, createAssetsSlice } from './Assets';
import { FarmingSlice, createFarmingSlice } from './Farming';
import { VeDPXSlice, createVedpxSlice } from './VeDPX';
import { SsovV3Slice, createSsovV3Slice } from './Vault/ssov';
import { RateVaultSlice, createRateVaultSlice } from './Vault/ir';
import { StraddlesSlice, createStraddlesSlice } from './Vault/straddles';
import { CommonSlice, createCommonSlice } from './Vault/common';

type T = WalletSlice &
  AssetsSlice &
  FarmingSlice &
  VeDPXSlice &
  SsovV3Slice &
  RateVaultSlice &
  StraddlesSlice &
  CommonSlice;

export const useBoundStore = create<T>()(
  devtools((...a) => ({
    ...createWalletSlice(...a),
    ...createAssetsSlice(...a),
    ...createFarmingSlice(...a),
    ...createVedpxSlice(...a),
    ...createCommonSlice(...a),
    ...createSsovV3Slice(...a),
    ...createRateVaultSlice(...a),
    ...createStraddlesSlice(...a),
  }))
);
