import { StateCreator } from 'zustand';
import { SsovV4Put__factory } from 'mocks/factories/SsovV4Put__factory';
import axios from 'axios';

import { WalletSlice } from 'store/Wallet';
import { CommonSlice } from 'store/Vault/common';
import { BigNumber } from 'ethers';
const LENDING_URL = 'http://localhost:5001/api/v2/lending';
const BASE_STATS_URL = 'http://localhost:3001/fetchCollateralBorrowingAmount';

export interface SsovLendingData {
  underlyingSymbol: string;
  symbol: string;
  chainId: number;
  address: string;
  expiry: BigNumber;
  totalSupply: number;
  totalBorrow: number;
  tokenPrice: number;
  aprs: number[];
  strikes: number[];
  optionTokens: string[];
}

export interface LendingStats {
  totalSupply: number;
  totalBorrow: number;
  timestamp: number;
}
export interface SsovLendingSlice {
  getSsovLendingContract: Function;
  // updateSsovLendingData: Function;
  // updateSsovLendingStats: Function;
  lendingData: SsovLendingData[];
  // lendingStats: LendingStats[];
  selectedAssetIdx: number;
  setSelectedAssetIdx: (idx: number) => void;
}

export const createSsovLending: StateCreator<
  WalletSlice & CommonSlice & SsovLendingSlice,
  [['zustand/devtools', never]],
  [],
  SsovLendingSlice
> = (set, get) => ({
  getSsovLendingContract: (ssovAddress: string) => {
    const { provider, selectedAssetIdx } = get();
    if (!provider) return;
    // const ssovAddress = lendingData[selectedAssetIdx]?.address || '';
    try {
      return SsovV4Put__factory.connect(ssovAddress, provider);
    } catch (err) {
      console.log(err);
      throw new Error('Fail to get ssov lending contract');
    }
  },
  updateSsovLendingData: async () => {
    const { chainId } = get();
    const ssovLendingData = await axios.get(LENDING_URL);
    const ssovs: SsovLendingData[] = ssovLendingData.data[chainId] || [];

    set((prevState) => ({
      ...prevState,
      lendingData: ssovs,
    }));
  },
  // updateSsovLendingStats: async () => {
  //   // const lendingStats = await axios.get(`${BASE_STATS_URL}?chainId=${chainId}`);
  // const lendingStats = `
  //   {
  //     "data": [
  //       {
  //         "totalSupply": 674529,
  //         "totalBorrow": 0,
  //         "timestamp": 1675038259
  //       }
  //     ]
  //   }
  // `;
  //   const stats: LendingStats[] = JSON.parse(lendingStats).data;

  //   set((prevState) => ({
  //     ...prevState,
  //     lendingStats: stats,
  //   }));
  // },
  lendingData: [],
  // lendingStats: [],
  // getLendingStats: async () => {
  //   const { updateSsovLendingStats } = get();
  //   updateSsovLendingStats();
  // },
  selectedAssetIdx: 0,
  setSelectedAssetIdx: (idx: number) =>
    set((prevState) => ({
      ...prevState,
      selectedAssetIdx: idx,
    })),
});
