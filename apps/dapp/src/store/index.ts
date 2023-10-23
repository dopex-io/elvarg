import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { AssetsSlice, createAssetsSlice } from './Assets';
import { createDpxBondsSlice, DpxBondsSlice } from './Bonds';
import { createDuelSlice, DuelSlice } from './Duel';
import { createFarmingSlice, FarmingSlice } from './Farming';
import { createNftsSlice, NftsSlice } from './Nfts';
import { createPortfolioSlice, PortfolioSlice } from './Portfolio';
import {
  createDpxusdBondingSlice,
  DpxusdBondingSlice,
} from './RdpxV2/dpxeth-bonding';
import { APPSlice, createAppSlice } from './RdpxV2/perpetual-pools';
import { createTokenSaleSlice, TokenSaleSlice } from './TokenSale';
import { CommonSlice, createCommonSlice } from './Vault/common';
import { createRateVaultSlice, RateVaultSlice } from './Vault/ir';
import { createOlpSlice, OlpSlice } from './Vault/olp';
import { createOptionScalpSlice, OptionScalpSlice } from './Vault/scalps';
import { createSsovV3Slice, SsovV3Slice } from './Vault/ssov';
import { createStraddlesSlice, StraddlesSlice } from './Vault/straddles';
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
  APPSlice &
  DpxusdBondingSlice;

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
    ...createAppSlice(...a),
    ...createDpxusdBondingSlice(...a),
    ...createOlpSlice(...a),
  })),
);
