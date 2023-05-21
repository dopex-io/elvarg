import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import { AssetsSlice, createAssetsSlice } from './Assets';
import { DpxBondsSlice, createDpxBondsSlice } from './Bonds';
import { DuelSlice, createDuelSlice } from './Duel';
import { FarmingSlice, createFarmingSlice } from './Farming';
import { NftsSlice, createNftsSlice } from './Nfts';
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
import { VaultsSlice, createVaultsSlice } from './Vault/vault';
import { ZdteSlice, createZdteSlice } from './Vault/zdte';
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
  AtlanticPoolsSlice &
  ZdteSlice &
  VaultsSlice;

export const useBoundStore = create<T>()(
  persist(
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
      ...createVaultsSlice(...a),
    })),
    {
      partialize: (state) => ({
        filter: state.filter,
      }),
      name: 'app.dopex.io/vaults/cache',
    }
  )
);
