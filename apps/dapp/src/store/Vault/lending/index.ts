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
  strike: number;
  supplied: string;
  borrowed: string;
}

export interface IRawSsovPosition {
  id: number;
  epoch: number;
  strike: number;
  collateralAmount: string;
}

export interface IDebtPosition extends IRawDebtPosition {
  underlyingSymbol: string;
}

export interface ISsovPosition extends IRawSsovPosition {
  underlyingSymbol: string;
}

export interface SsovLendingSlice {
  // getSsovLendingContract: Function;
  userDebtPositions: IDebtPosition[];
  userSsovPositions: ISsovPosition[];
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
      .get(lendingUrl, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'X-Requested-With': 'XMLHttpRequest',
        },
      })
      .then((payload) => payload.data[chainId])
      .catch((err) => console.log(err));

    const debts = await Promise.all(
      lendingData.map(async (asset) => {
        const { underlyingSymbol } = asset;
        return await axios
          .get(
            `${lendingUrl}/debts?symbol=${underlyingSymbol.toLowerCase()}&owner=${accountAddress}`,
            {
              headers: {
                'Access-Control-Allow-Origin': '*',
                'X-Requested-With': 'XMLHttpRequest',
              },
            }
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
            return [];
          });
      })
    );

    const ssovPositions = await Promise.all(
      lendingData.map(async (asset) => {
        const { underlyingSymbol } = asset;
        return await axios
          .get(
            `${lendingUrl}/deposits?symbol=${underlyingSymbol.toLowerCase()}&owner=${accountAddress}`,
            {
              headers: {
                'Access-Control-Allow-Origin': '*',
                'X-Requested-With': 'XMLHttpRequest',
              },
            }
          )
          .then((payload) => {
            const rawPositions: IRawSsovPosition[] = payload.data.deposits;
            return rawPositions.map(
              (pos) =>
                ({
                  ...pos,
                  underlyingSymbol: underlyingSymbol,
                } as ISsovPosition)
            );
          })
          .catch((err) => {
            console.log(err);
            return [];
          });
      })
    );

    const { totalCollatTvl, totalBorrowingTvl } = await axios
      .get(`${lendingUrl}/tvl`, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'X-Requested-With': 'XMLHttpRequest',
        },
      })
      .then((payload) => payload.data)
      .catch((err) => console.log(err));

    // const lendingStats = await axios
    //   .get(BASE_STATS_URL)
    //   .then((payload) => payload.data)
    //   .catch((err) => console.log(err));

    const lendingStats: LendingStats[] = [];

    const assetToContractAddress = new Map();
    lendingData.forEach((asset: ISsovLendingData) => {
      assetToContractAddress.set(asset.underlyingSymbol, asset.address);
    });

    set((prevState) => ({
      ...prevState,
      lendingData: lendingData,
      lendingStats: lendingStats,
      userDebtPositions: debts.flat(),
      userSsovPositions: ssovPositions.flat(),
      assetToContractAddress: assetToContractAddress,
      ssovLendingTotalCollat: totalCollatTvl,
      ssovLendingTotalBorrowing: totalBorrowingTvl,
    }));
  },
  userDebtPositions: [],
  userSsovPositions: [],
  lendingData: [],
  lendingStats: [],
  selectedAssetIdx: 0,
  setSelectedAssetIdx: (idx: number) =>
    set((prevState) => ({
      ...prevState,
      selectedAssetIdx: idx,
    })),
});
