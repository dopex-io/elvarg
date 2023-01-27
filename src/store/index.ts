import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { WalletSlice, createWalletSlice } from './Wallet';
import { TokenSaleSlice, createTokenSaleSlice } from './TokenSale';
import { PortfolioSlice, createPortfolioSlice } from './Portfolio';
import { AssetsSlice, createAssetsSlice } from './Assets';
import { FarmingSlice, createFarmingSlice } from './Farming';
import { NftsSlice, createNftsSlice } from './Nfts';
import { DuelSlice, createDuelSlice } from './Duel';
import { CommonSlice, createCommonSlice } from './Vault/common';
import { SsovV3Slice, createSsovV3Slice } from './Vault/ssov';
import { RateVaultSlice, createRateVaultSlice } from './Vault/ir';
import { VeDPXSlice, createVedpxSlice } from './VeDPX';
import { StraddlesSlice, createStraddlesSlice } from './Vault/straddles';
import { DpxBondsSlice, createDpxBondsSlice } from './Bonds';
import { AtlanticPoolsSlice, createAtlanticsSlice } from './Vault/atlantics';
import { GmxSlice, createGmxSlice } from './Vault/atlantics/gmx';
import { OlpSlice, createOlpSlice } from './Vault/olp';

type T = WalletSlice &
  TokenSaleSlice &
  PortfolioSlice &
  AssetsSlice &
  FarmingSlice &
  NftsSlice &
  DuelSlice &
  CommonSlice &
  SsovV3Slice &
  RateVaultSlice &
  VeDPXSlice &
  StraddlesSlice &
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
    ...createDuelSlice(...a),
    ...createCommonSlice(...a),
    ...createSsovV3Slice(...a),
    ...createRateVaultSlice(...a),
    ...createVedpxSlice(...a),
    ...createStraddlesSlice(...a),
    ...createDpxBondsSlice(...a),
    ...createOlpSlice(...a),
    ...createAtlanticsSlice(...a),
    ...createGmxSlice(...a),
  }))
);
