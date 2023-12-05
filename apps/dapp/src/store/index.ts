import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { AssetsSlice, createAssetsSlice } from './Assets';
import { createDpxBondsSlice, DpxBondsSlice } from './Bonds';
import { createFarmingSlice, FarmingSlice } from './Farming';
import { createNftsSlice, NftsSlice } from './Nfts';
import { createPortfolioSlice, PortfolioSlice } from './Portfolio';
import { createTokenSaleSlice, TokenSaleSlice } from './TokenSale';
import { CommonSlice, createCommonSlice } from './Vault/common';
import { createOlpSlice, OlpSlice } from './Vault/olp';
import { createSsovV3Slice, SsovV3Slice } from './Vault/ssov';
import { createVedpxSlice, VeDPXSlice } from './VeDPX';
import { createWalletSlice, WalletSlice } from './Wallet';

type T = WalletSlice &
  TokenSaleSlice &
  PortfolioSlice &
  AssetsSlice &
  FarmingSlice &
  NftsSlice &
  CommonSlice &
  SsovV3Slice &
  VeDPXSlice &
  DpxBondsSlice &
  OlpSlice;

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
    ...createVedpxSlice(...a),
    ...createDpxBondsSlice(...a),
    ...createOlpSlice(...a),
  })),
);
