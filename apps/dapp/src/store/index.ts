import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { AssetsSlice, createAssetsSlice } from './Assets';
import { createDpxBondsSlice, DpxBondsSlice } from './Bonds';
import { createDuelSlice, DuelSlice } from './Duel';
import { createFarmingSlice, FarmingSlice } from './Farming';
import { createNftsSlice, NftsSlice } from './Nfts';
import { createPortfolioSlice, PortfolioSlice } from './Portfolio';
import { createTokenSaleSlice, TokenSaleSlice } from './TokenSale';
import { AtlanticPoolsSlice, createAtlanticsSlice } from './Vault/atlantics';
import { createGmxSlice, GmxSlice } from './Vault/atlantics/gmx';
import { ClammSlice, createClammSlice } from './Vault/clamm';
import { CommonSlice, createCommonSlice } from './Vault/common';
import { createRateVaultSlice, RateVaultSlice } from './Vault/ir';
import { createOlpSlice, OlpSlice } from './Vault/olp';
import { createOptionScalpSlice, OptionScalpSlice } from './Vault/scalps';
import { createSsovV3Slice, SsovV3Slice } from './Vault/ssov';
import { createStraddlesSlice, StraddlesSlice } from './Vault/straddles';
import { createZdteSlice, ZdteSlice } from './Vault/zdte';
import { createVedpxSlice, VeDPXSlice } from './VeDPX';
import { createWalletSlice, WalletSlice } from './Wallet';

type T = WalletSlice &
  TokenSaleSlice &
  PortfolioSlice &
  AssetsSlice &
  FarmingSlice &
  DuelSlice &
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
  AtlanticPoolsSlice &
  ZdteSlice &
  ClammSlice;

export const useBoundStore = create<T>()(
  devtools((...a) => ({
    ...createWalletSlice(...a),
    ...createTokenSaleSlice(...a),
    ...createPortfolioSlice(...a),
    ...createAssetsSlice(...a),
    ...createFarmingSlice(...a),
    ...createDuelSlice(...a),
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
    ...createZdteSlice(...a),
    ...createClammSlice(...a),
  })),
);
