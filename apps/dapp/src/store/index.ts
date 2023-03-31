import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { AssetsSlice, createAssetsSlice } from './Assets';
import { DpxBondsSlice, createDpxBondsSlice } from './Bonds';
import { FarmingSlice, createFarmingSlice } from './Farming';
import { NftsSlice, createNftsSlice } from './Nfts';
import { DuelSlice, createDuelSlice } from './Duel';
import { PortfolioSlice, createPortfolioSlice } from './Portfolio';
import { TokenSaleSlice, createTokenSaleSlice } from './TokenSale';
import { AtlanticPoolsSlice, createAtlanticsSlice } from './Vault/atlantics';
import { GmxSlice, createGmxSlice } from './Vault/atlantics/gmx';
import { CommonSlice, createCommonSlice } from './Vault/common';
import { RateVaultSlice, createRateVaultSlice } from './Vault/ir';
import { OlpSlice, createOlpSlice } from './Vault/olp';
import { OptionScalpSlice, createOptionScalpSlice } from './Vault/scalps';
import { SsovV3Slice, createSsovV3Slice } from './Vault/ssov';
import { StraddlesSlice, createStraddlesSlice } from './Vault/straddles';
import { VeDPXSlice, createVedpxSlice } from './VeDPX';
import { WalletSlice, createWalletSlice } from './Wallet';

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
  AtlanticPoolsSlice;

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
  }))
);
