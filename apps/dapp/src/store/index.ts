import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { AssetsSlice, createAssetsSlice } from './Assets';
import { DpxBondsSlice, createDpxBondsSlice } from './Bonds';
import { FarmingSlice, createFarmingSlice } from './Farming';
import { NftsSlice, createNftsSlice } from './Nfts';
import { PortfolioSlice, createPortfolioSlice } from './Portfolio';
import {
  DpxusdBondingSlice,
  createDpxusdBondingSlice,
} from './RdpxV2/dpxusd-bonding';
import { APPSlice, createAppSlice } from './RdpxV2/perpetual-pools';
import { TokenSaleSlice, createTokenSaleSlice } from './TokenSale';
import { AtlanticPoolsSlice, createAtlanticsSlice } from './Vault/atlantics';
import { GmxSlice, createGmxSlice } from './Vault/atlantics/gmx';
import { CommonSlice, createCommonSlice } from './Vault/common';
import { RateVaultSlice, createRateVaultSlice } from './Vault/ir';
import { OlpSlice, createOlpSlice } from './Vault/olp';
import { SsovV3Slice, createSsovV3Slice } from './Vault/ssov';
import { StraddlesSlice, createStraddlesSlice } from './Vault/straddles';
import { VeDPXSlice, createVedpxSlice } from './VeDPX';
import { WalletSlice, createWalletSlice } from './Wallet';

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
  DpxBondsSlice &
  APPSlice &
  DpxusdBondingSlice &
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
    ...createDpxBondsSlice(...a),
    ...createAppSlice(...a),
    ...createDpxusdBondingSlice(...a),
    ...createOlpSlice(...a),
    ...createAtlanticsSlice(...a),
    ...createGmxSlice(...a),
  }))
);
