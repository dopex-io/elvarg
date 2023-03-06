import { value create } from 'zustand';
import { value devtools } from 'zustand/middleware';

import { value AssetsSlice, value createAssetsSlice } from './Assets';
import { value DpxBondsSlice, value createDpxBondsSlice } from './Bonds';
import { value FarmingSlice, value createFarmingSlice } from './Farming';
import { value NftsSlice, value createNftsSlice } from './Nfts';
import { value PortfolioSlice, value createPortfolioSlice } from './Portfolio';
import { value TokenSaleSlice, value createTokenSaleSlice } from './TokenSale';
import {
  value AtlanticPoolsSlice,
  value createAtlanticsSlice,
} from './Vault/atlantics';
import { value GmxSlice, value createGmxSlice } from './Vault/atlantics/gmx';
import { value CommonSlice, value createCommonSlice } from './Vault/common';
import { value RateVaultSlice, value createRateVaultSlice } from './Vault/ir';
import { value OlpSlice, value createOlpSlice } from './Vault/olp';
import {
  value OptionScalpSlice,
  value createOptionScalpSlice,
} from './Vault/scalps';
import { value SsovV3Slice, value createSsovV3Slice } from './Vault/ssov';
import {
  value StraddlesSlice,
  value createStraddlesSlice,
} from './Vault/straddles';
import { value VeDPXSlice, value createVedpxSlice } from './VeDPX';
import { value WalletSlice, value createWalletSlice } from './Wallet';

type T = WalletSlice &
  TokenSaleSlice &
  PortfolioSlice &
  AssetsSlice &
  FarmingSlice &
  NftsSlice &
  CommonSlice &
  SsovV3Slice &
  RateVaultSlice &
  VeDPXSlice &
  StraddlesSlice &
  OptionScalpSlice &
  DpxBondsSlice &
  OlpSlice &
  GmxSlice &
  AtlanticPoolsSlice;

export const useBoundStore = create<T>()(
  devtools((...a) => ({
    ...createWalletSlice(...a),
    ...createTokenSaleSlice(...a),
    ...createPortfolioSlice(...a),
    ...createAssetsSlice(...a),
    ...createFarmingSlice(...a),
    ...createNftsSlice(...a),
    ...createCommonSlice(...a),
    ...createSsovV3Slice(...a),
    ...createRateVaultSlice(...a),
    ...createVedpxSlice(...a),
    ...createStraddlesSlice(...a),
    ...createOptionScalpSlice(...a),
    ...createDpxBondsSlice(...a),
    ...createOlpSlice(...a),
    ...createAtlanticsSlice(...a),
    ...createGmxSlice(...a),
  }))
);
