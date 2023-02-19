import { StateCreator } from 'zustand';
import axios from 'axios';
import { BigNumber } from 'ethers';

import { WalletSlice } from 'store/Wallet';
import { CommonSlice } from 'store/Vault/common';

import { DOPEX_API_BASE_URL } from 'constants/env';

export interface ISsovLendingData {
  underlyingSymbol: string;
  collateralTokenAddress: string;
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
  id: number;
  expiry: number;
  epoch: number;
  strike: string;
  supplied: string;
  borrowed: string;
}

export interface IDebtPosition extends IRawDebtPosition {
  underlyingSymbol: string;
}

export interface SsovLendingSlice {
  // getSsovLendingContract: Function;
  userDebtPositions: (IDebtPosition | null)[];
  getSsovLending: Function;
  // updateSsovLendingStats: Function;
  lendingData: ISsovLendingData[];
  lendingStats: LendingStats[];
  selectedAssetIdx: number;
  assetToContractAddress: Map<string, string>;
  ssovLendingTotalCollat: number;
  ssovLendingTotalBorrowing: number;
  setSelectedAssetIdx: (idx: number) => void;
}

export const createSsovLending: StateCreator<
  WalletSlice & CommonSlice & SsovLendingSlice,
  [['zustand/devtools', never]],
  [],
  SsovLendingSlice
> = (set, get) => ({
  assetToContractAddress: new Map(),
  ssovLendingTotalCollat: 0,
  ssovLendingTotalBorrowing: 0,
  getSsovLending: async () => {
    const { chainId } = get();
    const accountAddress = '0x9d16d832dD97eD9684DaE9CD30234bB7028EBfDf';
    const lendingUrl = `${DOPEX_API_BASE_URL}/v2/lending`;

    const lendingData: ISsovLendingData[] = await axios
      .get(lendingUrl)
      .then((payload) => payload.data[chainId])
      .catch((err) => console.log(err));

    const debts = await Promise.all(
      lendingData.map(async (asset) => {
        const { underlyingSymbol } = asset;
        return await axios
          .get(
            `${lendingUrl}/debts?symbol=${underlyingSymbol.toLowerCase()}&owner=${accountAddress}`
          )
          .then((payload) => {
            const rawDebts: IRawDebtPosition[] = payload.data.debts;
            return rawDebts.map(
              (debt) =>
                ({
                  ...debt,
                  underlyingSymbol: underlyingSymbol,
                } as IDebtPosition)
            );
          })
          .catch((err) => {
            console.log(err);
            return null;
          });
      })
    );

    const { totalCollatTvl, totalBorrowingTvl } = await axios
      .get(`${lendingUrl}/tvl`)
      .then((payload) => payload.data)
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
      userDebtPositions: debts.flat(),
      assetToContractAddress: assetToContractAddress,
      ssovLendingTotalCollat: totalCollatTvl,
      ssovLendingTotalBorrowing: totalBorrowingTvl,
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
