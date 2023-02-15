import { StateCreator } from 'zustand';
import axios from 'axios';

import { WalletSlice } from 'store/Wallet';
import { CommonSlice } from 'store/Vault/common';
import { BigNumber } from 'ethers';
import { ARBITRUM_CHAIN_ID } from 'constants/index';
const LENDING_URL = 'http://localhost:5001/api/v2/lending';
const BASE_STATS_URL = 'http://localhost:3001/fetchCollateralBorrowingAmount';

export interface ISsovLendingData {
  underlyingSymbol: string;
  symbol: string;
  chainId: number;
  address: string;
  expiry: BigNumber;
  epoch: BigNumber;
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

export interface IRawDebtPosition {
  epoch: BigNumber;
  strike: BigNumber;
  supplied: BigNumber;
  borrowed: BigNumber;
}

export interface IDebtPosition extends IRawDebtPosition {
  underlyingSymbol: string;
  tokenId: BigNumber;
}

export interface SsovLendingSlice {
  // getSsovLendingContract: Function;
  userDebtPositions: IDebtPosition[];
  getSsovLending: Function;
  // updateSsovLendingStats: Function;
  lendingData: ISsovLendingData[];
  lendingStats: LendingStats[];
  selectedAssetIdx: number;
  assetToContractAddress: Map<string, string>;
  setSelectedAssetIdx: (idx: number) => void;
}

export const createSsovLending: StateCreator<
  WalletSlice & CommonSlice & SsovLendingSlice,
  [['zustand/devtools', never]],
  [],
  SsovLendingSlice
> = (set, get) => ({
  assetToContractAddress: new Map(),
  getSsovLending: async () => {
    const lendingData = await axios
      .get(LENDING_URL)
      .then((payload) => payload.data[ARBITRUM_CHAIN_ID])
      .catch((err) => console.log(err));

    // const lendingStats = await axios
    //   .get(BASE_STATS_URL)
    //   .then((payload) => payload.data)
    //   .catch((err) => console.log(err));

    const mockLendingStats = `
      {
        "data": [
          {
            "totalSupply": 674529,
            "totalBorrow": 674529,
            "timestamp": 1675038259
          },
          {
            "totalSupply": 709672,
            "totalBorrow": 709672,
            "timestamp": 1675175442
          },
          {
            "totalSupply": 714649,
            "totalBorrow": 714649,
            "timestamp": 1675256169
          },
          {
            "totalSupply": 813687,
            "totalBorrow": 813687,
            "timestamp": 1675305088
          }
        ]
      }
    `;
    const lendingStats: LendingStats[] = JSON.parse(mockLendingStats).data;

    const assetToContractAddress = new Map();
    lendingData.forEach((asset: ISsovLendingData) => {
      assetToContractAddress.set(asset.underlyingSymbol, asset.address);
    });

    set((prevState) => ({
      ...prevState,
      lendingData: lendingData,
      lendingStats: lendingStats,
      userDebtPositions: [
        {
          epoch: BigNumber.from(1),
          strike: BigNumber.from(1),
          supplied: BigNumber.from(1),
          borrowed: BigNumber.from(1),
          underlyingSymbol: 'ETH',
          tokenId: BigNumber.from(1),
        },
      ],
      assetToContractAddress: assetToContractAddress,
    }));
  },
  userDebtPositions: [],
  lendingData: [],
  lendingStats: [],
  selectedAssetIdx: 0,
  setSelectedAssetIdx: (idx: number) =>
    set((prevState) => ({
      ...prevState,
      selectedAssetIdx: idx,
    })),
});
