import { BigNumber } from 'ethers';
import {
  OptionScalpsLp,
  OptionScalpsLp__factory,
  OptionScalps__factory,
} from '@dopex-io/sdk';
import { ApolloQueryResult } from '@apollo/client';

import { optionScalpsGraphClient } from 'graphql/apollo';

import {
  GetTraderStatsDocument,
  GetTraderStatsQuery,
} from 'graphql/generated/optionScalps';

import { StateCreator } from 'zustand';

import { CommonSlice } from 'store/Vault/common';
import { WalletSlice } from 'store/Wallet';

export interface optionScalpData {
  optionScalpContract: any | undefined;
  quoteLpContract: OptionScalpsLp;
  baseLpContract: OptionScalpsLp;
  minimumMargin: BigNumber;
  feeOpenPosition: BigNumber;
  minimumAbsoluteLiquidationThreshold: BigNumber;
  maxSize: BigNumber;
  maxOpenInterest: BigNumber;
  longOpenInterest: BigNumber;
  shortOpenInterest: BigNumber;
  markPrice: BigNumber;
  totalQuoteDeposits: BigNumber;
  totalQuoteAvailable: BigNumber;
  totalBaseDeposits: BigNumber;
  totalBaseAvailable: BigNumber;
  quoteLpValue: BigNumber;
  baseLpValue: BigNumber;
  quoteLpAPR: BigNumber;
  baseLpAPR: BigNumber;
  quoteDecimals: BigNumber;
  baseDecimals: BigNumber;
  quoteSymbol: string;
  baseSymbol: string;
  inverted: boolean;
}

export interface ScalpPosition {
  id: BigNumber;
  isOpen: boolean;
  isShort: boolean;
  size: BigNumber;
  positions: BigNumber;
  amountBorrowed: BigNumber;
  amountOut: BigNumber;
  entry: BigNumber;
  margin: BigNumber;
  premium: BigNumber;
  fees: BigNumber;
  pnl: BigNumber;
  openedAt: BigNumber;
  timeframe: BigNumber;
  liquidationPrice: BigNumber;
}
export interface optionScalpUserData {
  scalpPositions?: ScalpPosition[];
  coolingPeriod: {
    quote: number;
    base: number;
  };
}

export interface OptionScalpSlice {
  optionScalpData?: optionScalpData | undefined;
  optionScalpUserData?: optionScalpUserData;
  updateOptionScalpUserData: Function;
  updateOptionScalp: Function;
  getUserPositionData: Function;
  setSelectedPoolName?: Function;
  getOptionScalpContract: Function;
  getBaseLpContract: Function;
  getQuoteLpContract: Function;
  getScalpPosition: Function;
  calcPnl: Function;
  calcLiqPrice: Function;
  uniWethPrice: BigNumber;
  uniArbPrice: BigNumber;
  setUniWethPrice: Function;
  setUniArbPrice: Function;
}

export const createOptionScalpSlice: StateCreator<
  OptionScalpSlice & WalletSlice & CommonSlice,
  [['zustand/devtools', never]],
  [],
  OptionScalpSlice
> = (set, get) => ({
  setUniWethPrice: (uniWethPrice: BigNumber) => {
    set((prevState) => ({ ...prevState, uniWethPrice }));
  },
  setUniArbPrice: (uniArbPrice: BigNumber) => {
    set((prevState) => ({ ...prevState, uniArbPrice }));
  },
  uniWethPrice: BigNumber.from(0),
  uniArbPrice: BigNumber.from(0),
  optionScalpUserData: {
    coolingPeriod: {
      quote: 0,
      base: 0,
    },
  },
  getOptionScalpContract: () => {
    const { selectedPoolName, provider, contractAddresses } = get();

    if (!selectedPoolName || !provider) return;
    return OptionScalps__factory.connect(
      contractAddresses['OPTION-SCALPS'][selectedPoolName],
      provider
    );
  },
  getQuoteLpContract: () => {
    const { selectedPoolName, provider, contractAddresses } = get();

    if (!selectedPoolName || !provider) return;

    return OptionScalpsLp__factory.connect(
      contractAddresses['OPTION-SCALPS']['LP'][selectedPoolName]['QUOTE'],
      provider
    );
  },
  getBaseLpContract: () => {
    const { selectedPoolName, provider, contractAddresses } = get();

    if (!selectedPoolName || !provider) return;

    return OptionScalpsLp__factory.connect(
      contractAddresses['OPTION-SCALPS']['LP'][selectedPoolName]['BASE'],
      provider
    );
  },
  getScalpPosition: async (id: BigNumber) => {
    const { getOptionScalpContract } = get();
    const optionScalpContract = getOptionScalpContract();
    return await optionScalpContract!['scalpPositions'](id);
  },
  calcPnl: async (id: BigNumber) => {
    const { getOptionScalpContract } = get();

    const optionScalpContract = getOptionScalpContract();
    return await optionScalpContract.calcPnl(id);
  },
  calcLiqPrice: (position: ScalpPosition) => {
    const { optionScalpData } = get();

    const divisor: BigNumber = BigNumber.from(
      10 ** optionScalpData!.quoteDecimals.toNumber()
    );

    const variation: BigNumber = position.margin
      .mul(divisor)
      .sub(
        optionScalpData!.minimumAbsoluteLiquidationThreshold.mul(position.size)
      )
      .div(position.positions);

    let price: BigNumber;

    if (position.isShort) {
      price = position.entry.add(variation);
    } else {
      price = position.entry.sub(variation);
    }

    return price;
  },
  updateOptionScalpUserData: async () => {
    const {
      accountAddress,
      provider,
      getOptionScalpContract,
      getScalpPosition,
      calcPnl,
      calcLiqPrice,
      getBaseLpContract,
      getQuoteLpContract,
    } = get();

    const optionScalpContract = await getOptionScalpContract();

    let scalpPositionsIndexes: any = [];
    let positionsOfOwner: any = [];

    try {
      positionsOfOwner = await optionScalpContract['positionsOfOwner'](
        accountAddress
      );

      for (let i in positionsOfOwner) {
        scalpPositionsIndexes.push(positionsOfOwner[i].toNumber());
      }
    } catch (err) {
      console.log(err);
    }

    const scalpPositionsPromises: any[] = [];

    const blockNumber = await provider.getBlockNumber();

    const events = await optionScalpContract?.queryFilter(
      optionScalpContract.filters.OpenPosition(null, null, accountAddress),
      72264883,
      blockNumber
    );

    for (let i in events) {
      if (
        !scalpPositionsIndexes.includes(Number(events[i]['args'][0])) &&
        events[i]['args'][2] === accountAddress
      ) {
        scalpPositionsIndexes.push(events[i]['args'][0]);
      }
    }

    const pnlsPromises: any[] = [];

    for (let i in scalpPositionsIndexes) {
      scalpPositionsPromises.push(getScalpPosition(scalpPositionsIndexes[i]));
      pnlsPromises.push(calcPnl(scalpPositionsIndexes[i]));
    }

    let scalpPositions: ScalpPosition[] = await Promise.all(
      scalpPositionsPromises
    );

    let pnls: BigNumber[] = await Promise.all(pnlsPromises);

    scalpPositions = scalpPositions.map((position, index) => ({
      ...position,
      id: scalpPositionsIndexes[index],
      pnl: position.isOpen
        ? pnls[index]!.sub(position.premium).sub(position.fees)
        : position.pnl,
      liquidationPrice: calcLiqPrice(position),
    }));

    scalpPositions.reverse();

    const [quoteCoolingPeriod, baseCoolingPeriod] = await Promise.all([
      getQuoteLpContract().lockedUsers(accountAddress),
      getBaseLpContract().lockedUsers(accountAddress),
    ]);

    set((prevState) => ({
      ...prevState,
      optionScalpUserData: {
        ...prevState.optionScalpUserData,
        scalpPositions: scalpPositions,
        coolingPeriod: {
          quote: Number(quoteCoolingPeriod),
          base: Number(baseCoolingPeriod),
        },
      },
    }));
  },
  getUserPositionData: async () => {
    const userPositionData: ApolloQueryResult<GetTraderStatsQuery> =
      await optionScalpsGraphClient.query({
        query: GetTraderStatsDocument,
        fetchPolicy: 'no-cache',
      });
    if (!userPositionData.data) return;
    return userPositionData.data.traderStats;
  },
  updateOptionScalp: async () => {
    const {
      getOptionScalpContract,
      getQuoteLpContract,
      getBaseLpContract,
      selectedPoolName,
    } = get();

    const optionScalpContract = getOptionScalpContract();
    const quoteLpContract = getQuoteLpContract();
    const baseLpContract = getBaseLpContract();

    const [
      minimumMargin,
      feeOpenPosition,
      minimumAbsoluteLiquidationThreshold,
      maxSize,
      maxOpenInterest,
      longOpenInterest,
      shortOpenInterest,
      markPrice,
      totalQuoteDeposits,
      totalBaseDeposits,
      totalQuoteAvailable,
      totalBaseAvailable,
      quoteSupply,
      baseSupply,
    ] = await Promise.all([
      optionScalpContract!['minimumMargin'](),
      optionScalpContract!['feeOpenPosition'](),
      optionScalpContract!['minimumAbsoluteLiquidationThreshold'](),
      optionScalpContract!['maxSize'](),
      optionScalpContract!['maxOpenInterest'](),
      optionScalpContract!['openInterest'](false),
      optionScalpContract!['openInterest'](true),
      optionScalpContract!['getMarkPrice'](),
      quoteLpContract!['totalAssets'](),
      baseLpContract!['totalAssets'](),
      quoteLpContract!['totalAvailableAssets'](),
      baseLpContract!['totalAvailableAssets'](),
      quoteLpContract!['totalSupply'](),
      baseLpContract!['totalSupply'](),
    ]);

    const quoteDecimals: BigNumber =
      selectedPoolName === 'ETH' || selectedPoolName === 'ARB'
        ? BigNumber.from('6')
        : BigNumber.from('18');
    const baseDecimals: BigNumber =
      selectedPoolName === 'ETH' || selectedPoolName === 'ARB'
        ? BigNumber.from('18')
        : BigNumber.from('8');

    const quoteLpValue: BigNumber = quoteSupply.gt(0)
      ? BigNumber.from((10 ** quoteDecimals.toNumber()).toString())
          .mul(totalQuoteDeposits)
          .div(quoteSupply)
      : BigNumber.from('0');

    const baseLpValue: BigNumber = baseSupply.gt(0)
      ? BigNumber.from((10 ** baseDecimals.toNumber()).toString())
          .mul(totalBaseDeposits)
          .div(baseSupply)
      : BigNumber.from('0');

    let quoteSymbol: string;
    let baseSymbol: string;

    if (selectedPoolName === 'ETH' || selectedPoolName === 'ARB') {
      quoteSymbol = 'USDC';
    }

    if (selectedPoolName === 'ETH') {
      baseSymbol = 'ETH';
    }

    if (selectedPoolName === 'ARB') {
      baseSymbol = 'ARB';
    }

    const compStartDate = new Date(1680300000000); // 4 APR 2023
    const today = new Date();

    const daysSinceComp = BigNumber.from(
      Math.ceil(
        (today.getTime() - compStartDate.getTime()) / (1000 * 3600 * 24)
      )
    );

    const baseLpAPR = totalBaseDeposits
      .sub(baseSupply)
      .mul(365)
      .div(daysSinceComp)
      .mul(100)
      .div(totalBaseDeposits);

    const quoteLpAPR = totalQuoteDeposits
      .sub(quoteSupply)
      .mul(365)
      .div(daysSinceComp)
      .mul(100)
      .div(totalQuoteDeposits);

    set((prevState) => ({
      ...prevState,
      optionScalpData: {
        optionScalpContract: optionScalpContract,
        quoteLpContract: quoteLpContract,
        baseLpContract: baseLpContract,
        minimumMargin: minimumMargin,
        feeOpenPosition: feeOpenPosition,
        minimumAbsoluteLiquidationThreshold:
          minimumAbsoluteLiquidationThreshold,
        maxSize: maxSize,
        maxOpenInterest: maxOpenInterest,
        longOpenInterest: longOpenInterest,
        shortOpenInterest: shortOpenInterest,
        markPrice: markPrice,
        totalQuoteDeposits: totalQuoteDeposits,
        totalBaseDeposits: totalBaseDeposits,
        totalQuoteAvailable: totalQuoteAvailable,
        totalBaseAvailable: totalBaseAvailable,
        quoteLpValue: quoteLpValue,
        baseLpValue: baseLpValue,
        quoteLpAPR: quoteLpAPR,
        baseLpAPR: baseLpAPR,
        quoteDecimals: quoteDecimals,
        baseDecimals: baseDecimals,
        quoteSymbol: quoteSymbol,
        baseSymbol: baseSymbol,
        inverted: selectedPoolName === 'BTC',
      },
    }));
  },
});
