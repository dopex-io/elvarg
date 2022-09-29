import create from 'zustand';
import { devtools } from 'zustand/middleware';

import { WalletSlice, createWalletSlice } from './Wallet';
import { TokenSaleSlice, createTokenSaleSlice } from './TokenSale';
import { AssetsSlice, createAssetsSlice } from './Assets';
import { FarmingSlice, createFarmingSlice } from './Farming';
import { NftsSlice, createNftsSlice } from './Nfts';
import { CommonSlice, createCommonSlice } from './Vault/common';
import { SsovV3Slice, createSsovV3Slice } from './Vault/ssov';
import { RateVaultSlice, createRateVaultSlice } from './Vault/ir';
import { VeDPXSlice, createVedpxSlice } from './VeDPX';
import { StraddlesSlice, createStraddlesSlice } from './Vault/straddles';
import { DpxBondsSlice, createDpxBondsSlice } from './Bonds';
import { AtlanticPoolsSlice, createAtlanticsSlice } from './Vault/atlantics';

type T = WalletSlice &
  TokenSaleSlice &
  AssetsSlice &
  FarmingSlice &
  NftsSlice &
  CommonSlice &
  SsovV3Slice &
  RateVaultSlice &
  VeDPXSlice &
  StraddlesSlice &
  DpxBondsSlice &
  AtlanticPoolsSlice;

export const useBoundStore = create<T>()(
  devtools((...a) => ({
    ...createWalletSlice(...a),
    ...createTokenSaleSlice(...a),
    ...createAssetsSlice(...a),
    ...createFarmingSlice(...a),
    ...createNftsSlice(...a),
    ...createCommonSlice(...a),
    ...createSsovV3Slice(...a),
    ...createRateVaultSlice(...a),
    ...createVedpxSlice(...a),
    ...createStraddlesSlice(...a),
    ...createDpxBondsSlice(...a),
    ...createAtlanticsSlice(...a),
  }))
);
