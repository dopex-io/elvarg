import { BigNumber } from 'ethers';

import {
  OptionScalps__factory,
  OptionScalpsLimitOrderManager__factory,
  OptionScalpsLp,
  OptionScalpsLp__factory,
} from '@dopex-io/sdk';
import graphSdk from 'graphql/graphSdk';
import queryClient from 'queryClient';
import { StateCreator } from 'zustand';

import { CommonSlice } from 'store/Vault/common';
import { WalletSlice } from 'store/Wallet';

export interface optionScalpData {
  optionScalpContract: any | undefined;
  limitOrdersContract: any | undefined;
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

export interface ScalpOrder {
  transactionHash: string;
  id: number;
  isOpen: boolean;
  isShort: boolean;
  size: BigNumber;
  timeframe: BigNumber;
  collateral: BigNumber;
  price: BigNumber;
  target: BigNumber;
  expiry: BigNumber | null;
  filled: boolean;
  type: string;
}

export interface optionScalpUserData {
  scalpPositions?: ScalpPosition[];
  scalpOrders?: ScalpOrder[];
  coolingPeriod: {
    quote: number;
    base: number;
  };
}

export interface OptionScalpSlice {
  optionScalpData?: optionScalpData | undefined;
  optionScalpUserData?: optionScalpUserData;
  updateOptionScalpUserData: Function;
  getScalpPositions: Function;
  getScalpOrders: Function;
  getScalpOpenOrder: Function;
  getScalpCloseOrder: Function;
  updateOptionScalp: Function;
  getUserPositionData: Function;
  setSelectedPoolName?: Function;
  getLimitOrdersContract: Function;
  getOptionScalpContract: Function;
  getOptionScalpsBaseLpContract: Function;
  getOptionScalpsQuoteLpContract: Function;
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

    const optionScalpsAddress =
      contractAddresses['OPTION-SCALPS'][selectedPoolName];

    return OptionScalps__factory.connect(optionScalpsAddress, provider);
  },
  getLimitOrdersContract: () => {
    const { selectedPoolName, provider, contractAddresses } = get();

    if (!selectedPoolName || !provider) return;

    const optionScalpsAddress =
      contractAddresses['OPTION-SCALPS']['LIMIT'][selectedPoolName];

    return OptionScalpsLimitOrderManager__factory.connect(
      optionScalpsAddress,
      provider
    );
  },
  getOptionScalpsQuoteLpContract: () => {
    const { selectedPoolName, provider, contractAddresses } = get();

    if (!selectedPoolName || !provider) return;

    return OptionScalpsLp__factory.connect(
      contractAddresses['OPTION-SCALPS']['LP'][selectedPoolName]['QUOTE'],
      provider
    );
  },
  getOptionScalpsBaseLpContract: () => {
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
  getScalpPositions: async () => {
    const {
      accountAddress,
      provider,
      getOptionScalpContract,
      getScalpPosition,
      calcPnl,
      calcLiqPrice,
    } = get();

    const optionScalpContract = await getOptionScalpContract();

    if (!optionScalpContract) return;

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

    return scalpPositions;
  },
  // @ts-ignore TODO: FIX
  getScalpOpenOrder: async (id: BigNumber, hash: string) => {
    const { getLimitOrdersContract, getOptionScalpContract, optionScalpData } =
      get();

    if (!optionScalpData) return;

    const limitOrdersContract = await getLimitOrdersContract();
    const optionScalpContract = await getOptionScalpContract();

    try {
      const openOrder = await limitOrdersContract.callStatic.openOrders(id);

      const ticks = await limitOrdersContract.callStatic.getNFTPositionTicks(
        openOrder['nftPositionId']
      );

      const tick = (ticks[0] + ticks[1]) / 2;

      const price = BigNumber.from(Math.round(1.0001 ** tick * 10 ** 18));

      let target;

      if (openOrder['isShort']) {
        target = BigNumber.from(Math.round(1.0001 ** ticks[1] * 10 ** 18));
      } else {
        target = BigNumber.from(Math.round(1.0001 ** ticks[0] * 10 ** 18));
      }

      const maxFundingTime = await limitOrdersContract.maxFundingTime();

      const expiry = openOrder['timestamp'].add(maxFundingTime);
      const timeframe = await optionScalpContract.timeframes(
        openOrder['timeframeIndex']
      );

      const positions = openOrder['size']
        .mul(BigNumber.from(10 ** optionScalpData?.quoteDecimals.toNumber()))
        .div(price);

      if (openOrder['cancelled'] === false)
        return {
          transactionHash: hash,
          id: id,
          isOpen: true,
          isShort: openOrder['isShort'],
          size: openOrder['size'],
          timeframe: timeframe,
          collateral: openOrder['collateral'],
          price: price,
          target: target,
          expiry: expiry,
          filled: openOrder['filled'],
          positions: positions,
          type: 'open',
        };

      return;
    } catch (e) {
      console.log(e);
      return;
    }
  },
  // @ts-ignore TODO: FIX
  getScalpCloseOrder: async (id: BigNumber, hash: string) => {
    const { getLimitOrdersContract, getOptionScalpContract, optionScalpData } =
      get();

    if (!optionScalpData) return;

    const limitOrdersContract = await getLimitOrdersContract();
    const optionScalpContract = await getOptionScalpContract();

    try {
      const scalpPosition = await optionScalpContract.scalpPositions(id);
      const closeOrder = await limitOrdersContract.closeOrders(id);

      const ticks = await limitOrdersContract.callStatic.getNFTPositionTicks(
        closeOrder['nftPositionId']
      );

      const tick = (ticks[0] + ticks[1]) / 2;

      const price = BigNumber.from(Math.round(1.0001 ** tick * 10 ** 18));

      let target;

      if (scalpPosition['isShort']) {
        target = BigNumber.from(Math.round(1.0001 ** ticks[0] * 10 ** 18));
      } else {
        target = BigNumber.from(Math.round(1.0001 ** ticks[1] * 10 ** 18));
      }

      const positions = scalpPosition['size']
        .mul(BigNumber.from(10 ** optionScalpData.quoteDecimals.toNumber()))
        .div(price);

      if (scalpPosition['size'].gt(0))
        return {
          transactionHash: hash,
          id: id,
          isOpen: false,
          isShort: scalpPosition['isShort'],
          size: scalpPosition['size'],
          timeframe: scalpPosition['timeframe'],
          collateral: scalpPosition['collateral'],
          price: price,
          target: target,
          expiry: null,
          positions: positions,
          type: 'close',
        };
    } catch (e) {
      console.log(e);
      return;
    }
  },
  getScalpOrders: async () => {
    const {
      accountAddress,
      provider,
      getScalpOpenOrder,
      getScalpCloseOrder,
      getLimitOrdersContract,
    } = get();

    if (!accountAddress) return;

    const limitOrdersContract = await getLimitOrdersContract();

    const openOrdersIndexes: any = [];
    const openOrdersPromises: any[] = [];
    const closeOrdersIndexes: any = [];
    const closeOrdersPromises: any[] = [];

    const blockNumber = await provider.getBlockNumber();

    const openOrdersEvents = await limitOrdersContract?.queryFilter(
      limitOrdersContract.filters.CreateOpenOrder(null, accountAddress),
      72264883,
      blockNumber
    );

    const closeOrdersEvents = await limitOrdersContract?.queryFilter(
      limitOrdersContract.filters.CreateCloseOrder(null, accountAddress),
      72264883,
      blockNumber
    );

    const openOrdersTransactionsHashes: string[] = [];
    const closeOrdersTransactionsHashes: string[] = [];

    for (let i in openOrdersEvents) {
      if (!openOrdersIndexes.includes(Number(openOrdersEvents[i]['args'][0]))) {
        openOrdersIndexes.push(openOrdersEvents[i]['args'][0]);
        openOrdersTransactionsHashes.push(
          openOrdersEvents[i]['transactionHash']
        );
      }
    }

    for (let i in closeOrdersEvents) {
      if (
        !closeOrdersIndexes.includes(Number(closeOrdersEvents[i]['args'][0]))
      ) {
        closeOrdersIndexes.push(closeOrdersEvents[i]['args'][0]);
        closeOrdersTransactionsHashes.push(
          closeOrdersEvents[i]['transactionHash']
        );
      }
    }

    for (let i in openOrdersIndexes) {
      openOrdersPromises.push(
        // @ts-ignore TODO: FIX
        getScalpOpenOrder(openOrdersIndexes[i], openOrdersTransactionsHashes[i])
      );
    }

    for (let i in closeOrdersIndexes) {
      closeOrdersPromises.push(
        // @ts-ignore TODO: FIX
        getScalpCloseOrder(
          closeOrdersIndexes[i],
          // @ts-ignore TODO: FIX
          closeOrdersTransactionsHashes[i]
        )
      );
    }

    const openOrders: ScalpOrder[] = await Promise.all(openOrdersPromises);

    const closeOrders: ScalpOrder[] = await Promise.all(closeOrdersPromises);

    return openOrders.concat(closeOrders).filter((_) => _); // filter out null
  },
  updateOptionScalpUserData: async () => {
    const {
      accountAddress,
      getOptionScalpsBaseLpContract,
      getOptionScalpsQuoteLpContract,
      getScalpPositions,
      getScalpOrders,
    } = get();

    const scalpPositions = await getScalpPositions();
    const scalpOrders = await getScalpOrders();
    const quoteLpContract = await getOptionScalpsQuoteLpContract();
    const baseLpContract = await getOptionScalpsBaseLpContract();

    if (!quoteLpContract) return;

    const [quoteCoolingPeriod, baseCoolingPeriod] = await Promise.all([
      quoteLpContract.lockedUsers(accountAddress),
      baseLpContract.lockedUsers(accountAddress),
    ]);

    set((prevState) => ({
      ...prevState,
      optionScalpUserData: {
        ...prevState.optionScalpUserData,
        scalpPositions: scalpPositions,
        scalpOrders: scalpOrders,
        coolingPeriod: {
          quote: Number(quoteCoolingPeriod),
          base: Number(baseCoolingPeriod),
        },
      },
    }));
  },
  getUserPositionData: async () => {
    const userPositionData = await queryClient.fetchQuery({
      queryKey: ['getTraderStats'],
      queryFn: () => graphSdk.getTraderStats(),
    });

    if (!userPositionData) return;
    return userPositionData.traderStats;
  },
  updateOptionScalp: async () => {
    const {
      getOptionScalpContract,
      getLimitOrdersContract,
      getOptionScalpsQuoteLpContract,
      getOptionScalpsBaseLpContract,
      selectedPoolName,
    } = get();

    const optionScalpContract = getOptionScalpContract();

    if (!optionScalpContract) return;

    const limitOrdersContract = getLimitOrdersContract();
    const quoteLpContract = getOptionScalpsQuoteLpContract();
    const baseLpContract = getOptionScalpsBaseLpContract();

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
      quoteLpContract!['totalSupply'](),
      baseLpContract!['totalSupply'](),
    ]);

    let totalQuoteAvailable = BigNumber.from('0');
    let totalBaseAvailable = BigNumber.from('0');

    try {
      totalQuoteAvailable = await quoteLpContract!['totalAvailableAssets']();
    } catch (e) {}

    try {
      totalBaseAvailable = await baseLpContract!['totalAvailableAssets']();
    } catch (e) {}

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

    const baseLpAPR = totalBaseDeposits.gt(0)
      ? totalBaseDeposits
          .sub(baseSupply)
          .mul(365)
          .div(daysSinceComp)
          .mul(100)
          .div(totalBaseDeposits)
      : BigNumber.from(0);

    const quoteLpAPR = totalQuoteDeposits.gt(0)
      ? totalQuoteDeposits
          .sub(quoteSupply)
          .mul(365)
          .div(daysSinceComp)
          .mul(100)
          .div(totalQuoteDeposits)
      : BigNumber.from(0);

    set((prevState) => ({
      ...prevState,
      optionScalpData: {
        optionScalpContract: optionScalpContract,
        limitOrdersContract: limitOrdersContract,
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
        quoteSymbol: 'USDC',
        baseSymbol: baseSymbol,
        inverted: selectedPoolName === 'BTC',
      },
    }));
  },
});
