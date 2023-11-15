import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { AssetsSlice, createAssetsSlice } from './Assets';
import { createDuelSlice, DuelSlice } from './Duel';
import { createNftsSlice, NftsSlice } from './Nfts';
import { createWalletSlice, WalletSlice } from './Wallet';

type T = WalletSlice & AssetsSlice & DuelSlice & NftsSlice;

export const useBoundStore = create<T>()(
  devtools((...a) => ({
    ...createWalletSlice(...a),
    ...createAssetsSlice(...a),
    ...createDuelSlice(...a),
    ...createNftsSlice(...a),
  })),
);
