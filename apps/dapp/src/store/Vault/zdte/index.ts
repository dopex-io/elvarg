import { BigNumber } from 'ethers';

import {
  ERC20__factory,
  ZdteLP__factory,
  ZdtePositionMinter__factory,
  Zdte__factory,
} from '@dopex-io/sdk';
import graphSdk from 'graphql/graphSdk';
import { reverse } from 'lodash';
import queryClient from 'queryClient';
import { StateCreator } from 'zustand';

import { CommonSlice } from 'store/Vault/common';
import { WalletSlice } from 'store/Wallet';

import { getContractReadableAmount, getCurrentTime } from 'utils/contracts';
import { getUserReadableAmount } from 'utils/contracts';
import { formatAmount } from 'utils/general';
import { getDelta } from 'utils/math/blackScholes/greeks';
import oneEBigNumber from 'utils/math/oneEBigNumber';

import { DECIMALS_STRIKE, DECIMALS_TOKEN, DECIMALS_USD } from 'constants/index';

export const ZDTE: string = '0xd01e0ec59fb8cfbf64857de839e5c6e23c82511a';
const SECONDS_IN_A_YEAR = 86400 * 365;

export interface OptionsTableData {
  strike: number;
  premium: number | string;
  iv: number | string;
  delta: number | string;
  breakeven: number | string;
  disable: boolean;
}

export interface IStaticZdteData {
  zdteAddress: string;
  // dpx, weth
  baseTokenAddress: string;
  baseTokenSymbol: string;
  baseLpContractAddress: string;
  baseLpSymbol: string;
  // usdc
  quoteTokenAddress: string;
  quoteTokenSymbol: string;
  quoteLpContractAddress: string;
  quoteLpSymbol: string;
}

export interface IZdteData {
  tokenPrice: number;
  nearestStrike: number;
  step: number;
  strikes: OptionsTableData[];
  failedToFetch: boolean;
  baseLpTokenLiquidity: BigNumber;
  baseLpAssetBalance: BigNumber;
  baseLpTotalAsset: BigNumber;
  quoteLpTokenLiquidity: BigNumber;
  quoteLpAssetBalance: BigNumber;
  quoteLpTotalAsset: BigNumber;
  openInterest: BigNumber;
  expiry: number;
}

export interface IZdteUserData {
  userBaseLpBalance: BigNumber;
  userQuoteLpBalance: BigNumber;
  userBaseTokenBalance: BigNumber;
  userQuoteTokenBalance: BigNumber;
  canWithdrawBase: boolean;
  canWithdrawQuote: boolean;
}

export interface IZdteRawPurchaseData {
  isOpen: boolean;
  isPut: boolean;
  isSpread: boolean;
  positions: BigNumber;
  longStrike: BigNumber;
  shortStrike: BigNumber;
  longPremium: BigNumber;
  shortPremium: BigNumber;
  fees: BigNumber;
  pnl: BigNumber;
  openedAt: BigNumber;
  expiry: BigNumber;
  markPrice: BigNumber;
  positionId: BigNumber;
  cost: BigNumber;
}

export interface IZdtePurchaseData extends IZdteRawPurchaseData {
  livePnl: BigNumber;
}

export interface IZdteExpiredData extends IZdteRawPurchaseData {
  pnl: BigNumber;
  settlementPrice: BigNumber;
}

export interface ISpreadPair {
  longStrike: number;
  shortStrike: number;
  premium: BigNumber;
  fees: BigNumber;
}

export interface IExpiryInfo {
  begin: boolean;
  expiry: BigNumber;
  settlementPrice: BigNumber;
  startId: string;
  count: BigNumber;
  lastProccessedId: BigNumber;
}

export interface IDepositInfo {
  amount: BigNumber;
  expiry: BigNumber;
}

export interface ZdteSlice {
  getZdteContract: Function;
  getQuoteLpContract: Function;
  getBaseLpContract: Function;
  userZdteLpData?: IZdteUserData;
  updateUserZdteLpData: Function;
  userPurchaseData?: IZdteRawPurchaseData[];
  getUserPurchaseData: Function;
  userZdtePurchaseData?: IZdtePurchaseData[];
  updateUserZdtePurchaseData: Function;
  userZdteExpiredData?: IZdteExpiredData[];
  updateUserZdteExpiredData: Function;
  zdteData?: IZdteData;
  updateStaticZdteData: Function;
  staticZdteData?: IStaticZdteData;
  updateZdteData: Function;
  selectedSpreadPair?: ISpreadPair;
  setSelectedSpreadPair: Function;
  focusTrade?: boolean;
  setFocusTrade: Function;
  setTextInputRef: Function;
  textInputRef?: any;
  subgraphVolume?: string;
  updateVolumeFromSubgraph: Function;
  expireStats?: IExpiryInfo[];
}

export const createZdteSlice: StateCreator<
  ZdteSlice & WalletSlice & CommonSlice,
  [['zustand/devtools', never]],
  [],
  ZdteSlice
> = (set, get) => ({
  getZdteContract: () => {
    const { selectedPoolName, provider } = get();

    if (!selectedPoolName || !provider) return;

    try {
      // Addresses[42161].ZDTE[selectedPoolName],
      return Zdte__factory.connect(ZDTE, provider);
    } catch (err) {
      console.error(err);
      throw Error('fail to create address');
    }
  },
  getBaseLpContract: async () => {
    const { selectedPoolName, provider, getZdteContract } = get();

    if (!selectedPoolName || !provider) return;

    try {
      const baseLpTokenAddress = await getZdteContract().baseLp();
      return ZdteLP__factory.connect(baseLpTokenAddress, provider);
    } catch (err) {
      console.error(err);
      throw Error('fail to create baseLp address');
    }
  },
  getQuoteLpContract: async () => {
    const { selectedPoolName, provider, getZdteContract } = get();

    if (!selectedPoolName || !provider) return;

    try {
      const quoteLpTokenAddress = await getZdteContract().quoteLp();
      return ZdteLP__factory.connect(quoteLpTokenAddress, provider);
    } catch (err) {
      console.error(err);
      throw Error('fail to create quoteLp address');
    }
  },
  updateUserZdteLpData: async () => {
    const {
      getBaseLpContract,
      getQuoteLpContract,
      accountAddress,
      provider,
      getZdteContract,
    } = get();

    if (
      !getBaseLpContract ||
      !getQuoteLpContract ||
      !accountAddress ||
      !getZdteContract
    )
      return;

    try {
      const [baseLpContract, quoteLpContract, zdteContract] = await Promise.all(
        [getBaseLpContract(), getQuoteLpContract(), getZdteContract()]
      );

      const [
        userBaseLpBalance,
        userQuoteLpBalance,
        baseTokenAddress,
        quoteTokenAddress,
        withdrawBaseTime,
        withdrawQuoteTime,
      ] = await Promise.all([
        baseLpContract.balanceOf(accountAddress),
        quoteLpContract.balanceOf(accountAddress),
        zdteContract.base(),
        zdteContract.quote(),
        baseLpContract.lockedUsers(accountAddress),
        quoteLpContract.lockedUsers(accountAddress),
      ]);

      const baseTokenContract = ERC20__factory.connect(
        baseTokenAddress,
        provider
      );
      const quoteTokenContract = ERC20__factory.connect(
        quoteTokenAddress,
        provider
      );

      const [userBaseTokenBalance, userQuoteTokenBalance] = await Promise.all([
        baseTokenContract.balanceOf(accountAddress),
        quoteTokenContract.balanceOf(accountAddress),
      ]);

      set((prevState) => ({
        ...prevState,
        userZdteLpData: {
          userBaseLpBalance: userBaseLpBalance,
          userBaseTokenBalance: userBaseTokenBalance,
          userQuoteLpBalance: userQuoteLpBalance,
          userQuoteTokenBalance: userQuoteTokenBalance,
          canWithdrawBase: withdrawBaseTime.toNumber() <= getCurrentTime(),
          canWithdrawQuote: withdrawQuoteTime.toNumber() <= getCurrentTime(),
        },
      }));
    } catch (err) {
      console.error(err);
      throw Error('fail to update userZdteLpData');
    }
  },
  getUserPurchaseData: async () => {
    try {
      const { accountAddress, getZdteContract, provider } = get();

      if (!accountAddress || !getZdteContract || !provider) return;

      const zdteContract = await getZdteContract();
      const zdteMinterAddress = await zdteContract.zdtePositionMinter();

      const zdteMinter = ZdtePositionMinter__factory.connect(
        zdteMinterAddress,
        provider
      );

      const numTokens = await zdteMinter.balanceOf(accountAddress);

      const ranges = Array.from({ length: numTokens.toNumber() }, (_, i) => i);

      const positions = await Promise.all(
        ranges.map(async (i) => {
          const tokenId = await zdteMinter.tokenOfOwnerByIndex(
            accountAddress,
            i
          );
          const zdtePosition = await zdteContract.zdtePositions(tokenId);
          const cost = zdtePosition.longPremium
            .add(zdtePosition.fees)
            .sub(zdtePosition.shortPremium);
          return {
            positionId: tokenId,
            cost: cost,
            ...zdtePosition,
          } as IZdteRawPurchaseData;
        })
      );
      set((prevState) => ({
        ...prevState,
        userPurchaseData: positions,
      }));
    } catch (err) {
      console.error(err);
      throw new Error('fail to getUserPurchaseData');
    }
  },
  updateUserZdtePurchaseData: async () => {
    try {
      const { userPurchaseData, getZdteContract } = get();

      if (!getZdteContract || !userPurchaseData) return;

      const zdteContract = await getZdteContract();

      const purchaseData = await Promise.all(
        userPurchaseData?.map(async (pos: IZdteRawPurchaseData) => {
          const livePnl = await zdteContract.calcPnl(pos.positionId);
          return {
            ...pos,
            livePnl: livePnl,
          } as IZdtePurchaseData;
        })
      );
      set((prevState) => ({
        ...prevState,
        userZdtePurchaseData: purchaseData.filter((p) => p.isOpen),
      }));
    } catch (err) {
      console.error(err);
      throw new Error('fail to update userZdtePurchaseData');
    }
  },
  updateUserZdteExpiredData: async () => {
    try {
      const { userPurchaseData, getZdteContract } = get();
      if (!userPurchaseData || !getZdteContract) return;

      const zdteContract = await getZdteContract();
      const positions = await Promise.all(
        userPurchaseData
          .filter((p) => !p.isOpen)
          .map(async (pos: IZdteRawPurchaseData) => {
            const ei: IExpiryInfo = await zdteContract.expiryInfo(pos.expiry);
            const pnl = await zdteContract.calcPnl(pos.positionId);
            return {
              ...pos,
              pnl: pnl,
              settlementPrice: ei.settlementPrice,
            } as IZdteExpiredData;
          })
      );

      set((prevState) => ({
        ...prevState,
        userZdteExpiredData: reverse(positions),
      }));
    } catch (err) {
      console.error(err);
      throw new Error('fail to update userZdteExpiredData');
    }
  },
  updateZdteData: async () => {
    const {
      selectedPoolName,
      getZdteContract,
      updateUserZdteLpData,
      updateUserZdtePurchaseData,
      getBaseLpContract,
      getQuoteLpContract,
    } = get();

    if (!selectedPoolName || !getZdteContract) return;

    try {
      await updateUserZdteLpData();
      await updateUserZdtePurchaseData();

      const [zdteContract, baseLpContract, quoteLpContract] = await Promise.all(
        [getZdteContract(), getBaseLpContract(), getQuoteLpContract()]
      );

      const [
        markPrice,
        strikeIncrement,
        maxOtmPercentage,
        baseLpTokenLiquidity,
        quoteLpTokenLiquidity,
        expiry,
        openInterestAmount,
      ] = await Promise.all([
        zdteContract.getMarkPrice(),
        zdteContract.strikeIncrement(),
        zdteContract.maxOtmPercentage(),
        zdteContract.baseLpTokenLiquidity(),
        zdteContract.quoteLpTokenLiquidity(),
        zdteContract.getCurrentExpiry(),
        zdteContract.openInterestAmount(),
      ]);

      const step = getUserReadableAmount(strikeIncrement, DECIMALS_STRIKE);
      const tokenPrice = getUserReadableAmount(markPrice, DECIMALS_STRIKE);

      const upper = tokenPrice * (1 + maxOtmPercentage / 100);
      const upperRound = Math.ceil(upper / step) * step;
      const lower = tokenPrice * (1 - maxOtmPercentage / 100);
      const lowerRound = Math.floor(lower / step) * step;

      const strikes: OptionsTableData[] = [];
      let numFailures: number = 0;

      for (
        let strike = upperRound - step;
        strike > lowerRound;
        strike -= step
      ) {
        let normalizedPremium = 0;
        let normalizedIv = 0;
        let failedToFetch: boolean = false;

        try {
          const [premium, iv] = await Promise.all([
            zdteContract.calcPremiumCustom(
              strike <= tokenPrice,
              getContractReadableAmount(strike, DECIMALS_STRIKE),
              oneEBigNumber(DECIMALS_TOKEN)
            ),
            zdteContract.getVolatility(
              getContractReadableAmount(strike, DECIMALS_STRIKE)
            ),
          ]);
          normalizedPremium = getPremiumUsdPrice(premium);
          normalizedIv = iv.toNumber();
        } catch (err) {
          failedToFetch = true;
          numFailures += 1;
          console.error(`Fail to fetch vol for strike: ${strike}`);
        }

        // s - Current price of the underlying
        // k - Strike price
        // t - Time to expiration in years
        // v - Volatility as a decimal
        // r - Annual risk-free interest rate as a decimal
        // callPut - The type of option to be priced - "call" or "put"
        const tte = (expiry.toNumber() - Date.now() / 1000) / SECONDS_IN_A_YEAR;
        const delta = getDelta(
          tokenPrice,
          strike,
          tte,
          normalizedIv / 100,
          0,
          strike <= tokenPrice ? 'put' : 'call'
        );

        strikes.push({
          strike: strike,
          premium: failedToFetch ? '...' : normalizedPremium,
          iv: failedToFetch ? '...' : normalizedIv,
          breakeven: failedToFetch
            ? '...'
            : strike + normalizedPremium * (strike <= tokenPrice ? 1 : -1),
          delta: failedToFetch ? '...' : delta,
          disable:
            failedToFetch ||
            strike == upperRound - step ||
            strike == lowerRound + step,
        });
      }

      const [
        baseLpAssetBalance,
        baseLpTotalAsset,
        quoteLpAssetBalance,
        quoteLpTotalAsset,
      ] = await Promise.all([
        baseLpContract.totalAvailableAssets(),
        baseLpContract.totalAssets(),
        quoteLpContract.totalAvailableAssets(),
        quoteLpContract.totalAssets(),
      ]);

      const openInterest = openInterestAmount
        .mul(markPrice)
        .mul(2)
        .div(oneEBigNumber(DECIMALS_STRIKE));
      const nearestStrike = roundToNearestStrikeIncrement(tokenPrice, step);

      set((prevState) => ({
        ...prevState,
        zdteData: {
          tokenPrice,
          nearestStrike,
          step,
          strikes,
          failedToFetch: numFailures > 1,
          baseLpAssetBalance,
          baseLpTotalAsset,
          baseLpTokenLiquidity,
          quoteLpAssetBalance,
          quoteLpTotalAsset,
          quoteLpTokenLiquidity,
          openInterest,
          expiry: expiry.toNumber(),
        },
      }));
    } catch (err) {
      console.error(err);
      throw new Error('fail to update zdteData');
    }
  },
  updateStaticZdteData: async () => {
    const {
      selectedPoolName,
      provider,
      getZdteContract,
      getBaseLpContract,
      getQuoteLpContract,
    } = get();

    if (!selectedPoolName || !provider || !getZdteContract) return;

    try {
      const [zdteContract, baseLpContract, quoteLpContract] = await Promise.all(
        [getZdteContract(), getBaseLpContract(), getQuoteLpContract()]
      );

      const zdteAddress = zdteContract.address;
      const baseLpContractAddress = baseLpContract.address;
      const quoteLpContractAddress = quoteLpContract.address;

      const [baseLpSymbol, quoteLpSymbol, baseTokenAddress, quoteTokenAddress] =
        await Promise.all([
          baseLpContract.symbol(),
          quoteLpContract.symbol(),
          zdteContract.base(),
          zdteContract.quote(),
        ]);

      const baseTokenContract = ERC20__factory.connect(
        baseTokenAddress,
        provider
      );
      const quoteTokenContract = ERC20__factory.connect(
        quoteTokenAddress,
        provider
      );

      const [baseTokenSymbol, quoteTokenSymbol] = await Promise.all([
        baseTokenContract.symbol(),
        quoteTokenContract.symbol(),
      ]);

      set((prevState) => ({
        ...prevState,
        staticZdteData: {
          zdteAddress,
          baseLpContractAddress,
          baseLpSymbol,
          baseTokenAddress,
          baseTokenSymbol,
          quoteTokenAddress,
          quoteTokenSymbol,
          quoteLpContractAddress,
          quoteLpSymbol,
        },
      }));
    } catch (err) {
      console.error(err);
      throw new Error('fail to update static zdte data');
    }
  },
  setSelectedSpreadPair: (pair: ISpreadPair) => {
    const { getZdteContract } = get();

    if (!getZdteContract) return;

    try {
      set((prevState) => ({
        ...prevState,
        selectedSpreadPair: pair,
      }));
    } catch (err) {
      console.error(err);
      throw new Error('fail to update selected spread pair');
    }
  },
  setFocusTrade: (focus: boolean) => {
    set((prevState) => ({
      ...prevState,
      focusTrade: focus,
    }));
  },
  setTextInputRef: (ref: boolean) => {
    set((prevState) => ({
      ...prevState,
      textInputRef: ref,
    }));
  },
  updateVolumeFromSubgraph: async () => {
    let subgraphVolume = '...';
    try {
      const payload = await queryClient.fetchQuery({
        queryKey: ['getZdteSpreadTradesFromTimestamp'],
        queryFn: () =>
          graphSdk.getZdteSpreadTradesFromTimestamp({
            fromTimestamp: (new Date().getTime() / 1000 - 86400).toFixed(0),
          }),
      });
      const _twentyFourHourVolume = payload.trades
        ? payload.trades.reduce((acc, trade, _index) => {
            if (trade.amount) {
              return acc.add(BigNumber.from(trade.amount));
            }
            return acc;
          }, BigNumber.from(0))
        : BigNumber.from(0);

      subgraphVolume = formatAmount(
        getUserReadableAmount(_twentyFourHourVolume),
        3
      );
    } catch (err) {
      console.error(err);
    }

    set((prevState) => ({
      ...prevState,
      subgraphVolume: subgraphVolume,
    }));
  },
});

function getPremiumUsdPrice(value: BigNumber): number {
  return value.mul(1000).div(oneEBigNumber(DECIMALS_USD)).toNumber() / 1000;
}

function roundToNearestStrikeIncrement(
  num: number,
  strikeIncrement: number
): number {
  return Math.round(num / strikeIncrement) * strikeIncrement;
}
