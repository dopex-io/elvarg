import { BigNumber, utils } from 'ethers';

import { ERC20__factory } from '@dopex-io/sdk';
import graphSdk from 'graphql/graphSdk';
import { ZdteLP__factory } from 'mocks/factories/ZdteLP__factory';
import { ZdtePositionMinter__factory } from 'mocks/factories/ZdtePositionMinter__factory';
import { Zdte__factory } from 'mocks/factories/Zdte__factory';
import queryClient from 'queryClient';
import { StateCreator } from 'zustand';

import { CommonSlice } from 'store/Vault/common';
import { WalletSlice } from 'store/Wallet';

import { getContractReadableAmount, getCurrentTime } from 'utils/contracts';
import { getUserReadableAmount } from 'utils/contracts';
import { getDelta } from 'utils/math/blackScholes/greeks';
import oneEBigNumber from 'utils/math/oneEBigNumber';

import { DECIMALS_STRIKE, DECIMALS_TOKEN, DECIMALS_USD } from 'constants/index';

export const ZDTE: string = '0x73136bfb1cdb9e424814011d00e11989c3a82d38';
const SECONDS_IN_A_YEAR = 86400 * 365;
const ONE_DAY = 86400;

export interface OptionsTableData {
  strike: number;
  premium: number;
  iv: number;
  delta: number;
  breakeven: number;
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
  baseLpTokenLiquidty: BigNumber;
  baseLpAssetBalance: BigNumber;
  quoteLpTokenLiquidty: BigNumber;
  quoteLpAssetBalance: BigNumber;
  openInterest: BigNumber;
  expiry: number;
}

export interface IZdteUserData {
  userBaseLpBalance: BigNumber;
  userQuoteLpBalance: BigNumber;
  userBaseWithdrawable: BigNumber;
  userQuoteWithdrawable: BigNumber;
  userBaseTokenBalance: BigNumber;
  userQuoteTokenBalance: BigNumber;
}

export interface IZdtePurchaseData {
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
  cost: BigNumber;
  livePnl: BigNumber;
  positionId: BigNumber;
}

export interface ISpreadPair {
  longStrike: number;
  shortStrike: number;
  premium: BigNumber;
  fees: BigNumber;
}

export interface IExpiryInfo {
  begin: boolean;
  expired: boolean;
  expiry: BigNumber;
  settlementPrice: BigNumber;
  startId: string;
  count: BigNumber;
}

export interface IDepositInfo {
  amount: BigNumber;
  expiry: BigNumber;
}

export interface ZdteSlice {
  getZdteContract: Function;
  getQuoteLpContract: Function;
  getBaseLpContract: Function;
  updateExpireStats: Function;
  userZdteLpData?: IZdteUserData;
  updateUserZdteLpData: Function;
  userZdtePurchaseData?: IZdtePurchaseData[];
  updateUserZdtePurchaseData: Function;
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

    if (!getBaseLpContract || !getQuoteLpContract || !accountAddress) return;

    try {
      const [baseLpContract, quoteLpContract, zdteContract] = await Promise.all(
        [getBaseLpContract(), getQuoteLpContract(), getZdteContract()]
      );

      const [
        userBaseLpBalance,
        userQuoteLpBalance,
        userBaseWithdrawalInfo,
        userQuoteWithdrawalInfo,
        baseTokenAddress,
        quoteTokenAddress,
      ] = await Promise.all([
        baseLpContract.balanceOf(accountAddress),
        quoteLpContract.balanceOf(accountAddress),
        zdteContract.getUserToBaseDepositInfo(accountAddress),
        zdteContract.getUserToQuoteDepositInfo(accountAddress),
        zdteContract.base(),
        zdteContract.quote(),
      ]);

      const currentTime = BigNumber.from(Math.round(getCurrentTime()));

      const userBaseWithdrawable = userBaseWithdrawalInfo.reduce(
        (acc: BigNumber, info: IDepositInfo) => {
          return info.expiry.lt(currentTime)
            ? acc.add(info.amount)
            : BigNumber.from(0);
        },
        BigNumber.from(0)
      );

      const userQuoteWithdrawable = userQuoteWithdrawalInfo.reduce(
        (acc: BigNumber, info: IDepositInfo) => {
          return info.expiry.lt(currentTime)
            ? acc.add(info.amount)
            : BigNumber.from(0);
        },
        BigNumber.from(0)
      );

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
          userBaseWithdrawable: userBaseWithdrawable,
          userQuoteWithdrawable: userQuoteWithdrawable,
          userQuoteLpBalance: userQuoteLpBalance,
          userQuoteTokenBalance: userQuoteTokenBalance,
        },
      }));
    } catch (err) {
      console.error(err);
      throw Error('fail to update userZdteLpData');
    }
  },
  userZdtePurchaseData: [],
  updateUserZdtePurchaseData: async () => {
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
          const livePnl = await zdteContract.calcPnl(tokenId);
          const realPnl = livePnl.sub(cost);
          return {
            ...zdtePosition,
            cost: cost,
            livePnl: realPnl,
            positionId: tokenId,
          } as IZdtePurchaseData;
        })
      );
      set((prevState) => ({
        ...prevState,
        userZdtePurchaseData: positions.filter((p) => p.isOpen),
      }));
    } catch (err) {
      console.error(err);
      throw new Error('fail to update userZdtePurchaseData');
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
        baseLpTokenLiquidty,
        quoteLpTokenLiquidty,
        expiry,
      ] = await Promise.all([
        zdteContract.getMarkPrice(),
        zdteContract.strikeIncrement(),
        zdteContract.maxOtmPercentage(),
        zdteContract.baseLpTokenLiquidty(),
        zdteContract.quoteLpTokenLiquidty(),
        zdteContract.getCurrentExpiry(),
      ]);

      const step = getUserReadableAmount(strikeIncrement, DECIMALS_STRIKE);
      const tokenPrice = getUserReadableAmount(markPrice, DECIMALS_STRIKE);

      const upper = tokenPrice * (1 + maxOtmPercentage / 100);
      const upperRound = Math.ceil(upper / step) * step;
      const lower = tokenPrice * (1 - maxOtmPercentage / 100);
      const lowerRound = Math.floor(lower / step) * step;

      const strikes: OptionsTableData[] = [];
      let failedToFetch: boolean = false;

      for (
        let strike = upperRound - step;
        strike > lowerRound;
        strike -= step
      ) {
        let normalizedPremium = 0;
        let normalizedIv = 0;
        try {
          const [premium, iv] = await Promise.all([
            zdteContract.calcPremium(
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
          premium: normalizedPremium,
          iv: normalizedIv,
          breakeven:
            strike + normalizedPremium * (strike <= tokenPrice ? 1 : -1),
          delta: delta,
          disable: strike == upperRound - step || strike == lowerRound + step,
        });
      }

      const [baseLpAssetBalance, quoteLpAssetBalance] = await Promise.all([
        baseLpContract.totalAvailableAssets(),
        quoteLpContract.totalAvailableAssets(),
      ]);

      const openInterest = baseLpTokenLiquidty
        .mul(markPrice)
        .div(oneEBigNumber(20))
        .add(quoteLpTokenLiquidty);
      const nearestStrike = roundToNearestStrikeIncrement(tokenPrice, step);

      set((prevState) => ({
        ...prevState,
        zdteData: {
          tokenPrice,
          nearestStrike,
          step,
          strikes,
          failedToFetch,
          baseLpAssetBalance,
          baseLpTokenLiquidty,
          quoteLpAssetBalance,
          quoteLpTokenLiquidty,
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
  setSelectedSpreadPair: async (pair: ISpreadPair) => {
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
  setFocusTrade: async (focus: boolean) => {
    set((prevState) => ({
      ...prevState,
      focusTrade: focus,
    }));
  },
  setTextInputRef: async (ref: boolean) => {
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
            return acc.add(BigNumber.from(trade ? trade?.amount : 0));
          }, BigNumber.from(0))
        : BigNumber.from(0);

      subgraphVolume = utils.formatEther(_twentyFourHourVolume);
    } catch (err) {
      console.error(err);
    }

    set((prevState) => ({
      ...prevState,
      subgraphVolume: subgraphVolume,
    }));
  },
  updateExpireStats: async () => {
    const { provider } = get();

    try {
      const zdteContract = Zdte__factory.connect(ZDTE, provider);
      const genesisExpiry = await zdteContract.genesisExpiry();
      const nextExpiry = await zdteContract.getCurrentExpiry();

      let expiryInfoArray: IExpiryInfo[] = [];

      for (
        let i = genesisExpiry.toNumber();
        i < nextExpiry.toNumber() + ONE_DAY;
        i = i + ONE_DAY
      ) {
        const ei = await zdteContract.expiryInfo(BigNumber.from(i));
        if (!ei.begin) {
          expiryInfoArray.push({
            ...ei,
            expiry: nextExpiry,
            startId: 'N/A',
          });
        } else {
          expiryInfoArray.push({
            ...ei,
            startId: ei.startId.toNumber().toString(),
          });
        }
      }
      set((prevState) => ({
        ...prevState,
        expireStats: expiryInfoArray,
      }));
    } catch (err) {
      console.error(err);
      throw new Error('fail to update expire stats');
    }
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
