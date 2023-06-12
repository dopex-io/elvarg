import { BigNumber } from 'ethers';

import {
  ERC20__factory,
  Zdte__factory,
  ZdteLP__factory,
  ZdtePositionMinter__factory,
} from '@dopex-io/sdk';
import graphSdk from 'graphql/graphSdk';
import { reverse } from 'lodash';
import queryClient from 'queryClient';
import { StateCreator } from 'zustand';

import { CommonSlice } from 'store/Vault/common';
import { WalletSlice } from 'store/Wallet';

import {
  getContractReadableAmount,
  getUserReadableAmount,
} from 'utils/contracts';
import getCurrentTime from 'utils/date/getCurrentTime';
import { formatAmount } from 'utils/general';
import { getDelta } from 'utils/math/blackScholes/greeks';
import oneEBigNumber from 'utils/math/oneEBigNumber';

import { DECIMALS_STRIKE, DECIMALS_TOKEN, DECIMALS_USD } from 'constants/index';

export const ZDTE: string = '0x0a9efaddab01c0a00edfaf24377460fafba9411d';
export const ZDTE_ARB: string = '0xebf0ac8896fddeec5b8592f4c9eb5b8ea3d4dc82';

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
  baseLpValue: BigNumber;
  baseLpAssetBalance: BigNumber;
  baseLpTotalAsset: BigNumber;
  quoteLpTokenLiquidity: BigNumber;
  quoteLpAssetBalance: BigNumber;
  quoteLpTotalAsset: BigNumber;
  quoteLpValue: BigNumber;
  openInterest: BigNumber;
  expiry: number;
  maxLongStrikeVolAdjust: BigNumber;
  minLongStrikeVolAdjust: BigNumber;
}

export interface IZdteUserData {
  userBaseLpBalance: BigNumber;
  userQuoteLpBalance: BigNumber;
  userBaseTokenBalance: BigNumber;
  userQuoteTokenBalance: BigNumber;
  canWithdrawBase: boolean;
  canWithdrawQuote: boolean;
}

export interface IZdteSpreadPosition {
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

export interface IZdteOpenPositions extends IZdteSpreadPosition {
  livePnl: BigNumber;
  breakeven: BigNumber;
}

export interface IZdteClosedPositions extends IZdteSpreadPosition {
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
  userZdteSpreadPositions?: IZdteSpreadPosition[];
  updateUserZdteSpreadPositions: Function;
  userZdteOpenPositions?: IZdteOpenPositions[];
  updateUserZdteOpenPositions: Function;
  userZdteClosedPositions?: IZdteClosedPositions[];
  updateUserZdteClosedPositions: Function;
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
      const addr = selectedPoolName.toLowerCase() === 'arb' ? ZDTE_ARB : ZDTE;
      return Zdte__factory.connect(addr, provider);
    } catch (err) {
      console.error(err);
      throw Error('fail to create address');
    }
  },
  getBaseLpContract: async () => {
    const { selectedPoolName, provider, getZdteContract } = get();

    const zdteContract = getZdteContract();

    if (!selectedPoolName || !provider || !zdteContract) return;

    try {
      const baseLpTokenAddress = await zdteContract.baseLp();
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
      // throw Error('fail to update userZdteLpData');
    }
  },
  updateUserZdteSpreadPositions: async () => {
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
          } as IZdteSpreadPosition;
        })
      );
      set((prevState) => ({
        ...prevState,
        userZdteSpreadPositions: positions,
      }));
    } catch (err) {
      console.error(err);
      // throw new Error('fail to updateUserZdteSpreadPositions');
    }
  },
  updateUserZdteOpenPositions: async () => {
    try {
      const { userZdteSpreadPositions, getZdteContract } = get();

      if (!getZdteContract || !userZdteSpreadPositions) return;

      const zdteContract = await getZdteContract();

      const purchaseData = await Promise.all(
        userZdteSpreadPositions?.map(async (pos: IZdteSpreadPosition) => {
          const livePnl = await zdteContract.calcPnl(pos.positionId);
          const cost = pos.longPremium.sub(pos.shortPremium).add(pos.fees);
          const finalCost = cost
            .mul(oneEBigNumber(DECIMALS_TOKEN))
            .div(pos.positions || BigNumber.from(1))
            .mul(100);
          const breakeven =
            pos.longStrike > pos.shortStrike
              ? pos.longStrike.sub(finalCost)
              : pos.longStrike.add(finalCost);
          return {
            ...pos,
            livePnl: livePnl,
            breakeven: breakeven,
          } as IZdteOpenPositions;
        })
      );
      set((prevState) => ({
        ...prevState,
        userZdteOpenPositions: purchaseData.filter((p) => p.isOpen),
      }));
    } catch (err) {
      console.error(err);
      throw new Error('fail to update userZdteOpenPositions');
    }
  },
  updateUserZdteClosedPositions: async () => {
    try {
      const { userZdteSpreadPositions, getZdteContract } = get();
      if (!userZdteSpreadPositions || !getZdteContract) return;

      const zdteContract = await getZdteContract();
      const positions = await Promise.all(
        userZdteSpreadPositions
          .filter((p) => !p.isOpen)
          .map(async (pos: IZdteSpreadPosition) => {
            const ei: IExpiryInfo = await zdteContract.expiryInfo(pos.expiry);
            const pnl = await zdteContract.calcPnl(pos.positionId);
            return {
              ...pos,
              pnl: pnl,
              settlementPrice: ei.settlementPrice,
            } as IZdteClosedPositions;
          })
      );

      set((prevState) => ({
        ...prevState,
        userZdteClosedPositions: reverse(positions),
      }));
    } catch (err) {
      console.error(err);
      throw new Error('fail to update userZdteClosedPositions');
    }
  },
  updateZdteData: async () => {
    const {
      selectedPoolName,
      getZdteContract,
      getBaseLpContract,
      getQuoteLpContract,
    } = get();

    if (!selectedPoolName || !getZdteContract) return;

    try {
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
        maxLongStrikeVolAdjust,
        minLongStrikeVolAdjust,
      ] = await Promise.all([
        zdteContract.getMarkPrice(),
        zdteContract.strikeIncrement(),
        zdteContract.maxOtmPercentage(),
        zdteContract.baseLpTokenLiquidity(),
        zdteContract.quoteLpTokenLiquidity(),
        zdteContract.getCurrentExpiry(),
        zdteContract.openInterestAmount(),
        zdteContract.maxLongStrikeVolAdjust(),
        zdteContract.minLongStrikeVolAdjust(),
      ]);

      const step = getUserReadableAmount(strikeIncrement, DECIMALS_STRIKE);
      const tokenPrice = getUserReadableAmount(markPrice, DECIMALS_STRIKE);

      const upper = tokenPrice * (1 + maxOtmPercentage / 100);
      const upperRound = Math.round(Math.ceil(upper / step) * step * 100) / 100;
      const lower = tokenPrice * (1 - maxOtmPercentage / 100);
      const lowerRound =
        Math.round(Math.floor(lower / step) * step * 100) / 100;

      const strikes: OptionsTableData[] = [];
      let numFailures: number = 0;

      // let premiumsPromises = [];
      // let ivPromises = [];

      // for (
      //   let strike = upperRound - step;
      //   strike > lowerRound;
      //   strike -= step
      // ) {
      //   try {
      //     if (strike < 10) {
      //       strike = Math.round(strike * 100) / 100;
      //     }
      //     premiumsPromises.push(
      //       zdteContract.calcPremiumCustom(
      //         strike <= tokenPrice,
      //         getContractReadableAmount(strike, DECIMALS_STRIKE),
      //         oneEBigNumber(DECIMALS_TOKEN)
      //       )
      //     );
      //     ivPromises.push(
      //       zdteContract.getVolatility(
      //         getContractReadableAmount(strike, DECIMALS_STRIKE)
      //       )
      //     );
      //   } catch (e) {
      //     console.error('Fail to get volatility for ', strike);
      //   }
      // }

      // const ivs = await Promise.all(ivPromises);
      // const premiums = await Promise.all(premiumsPromises);

      // let i = 0;
      // for (
      //   let strike = upperRound - step;
      //   strike > lowerRound;
      //   strike -= step
      // ) {
      //   let normalizedPremium = 0;
      //   let normalizedIv = 0;
      //   let failedToFetch: boolean = false;

      //   if (strike < 10) {
      //     strike = Math.round(strike * 100) / 100;
      //   }

      //   try {
      //     normalizedPremium = getPremiumUsdPrice(premiums[i]);
      //     normalizedIv = ivs[i].toNumber();
      //   } catch (err) {
      //     failedToFetch = true;
      //     numFailures += 1;
      //     console.error(`Fail to fetch vol for strike: ${strike}`);
      //   }
      for (
        let strike = upperRound - step;
        strike > lowerRound;
        strike -= step
      ) {
        let normalizedPremium = 0;
        let normalizedIv = 0;
        let failedToFetch: boolean = false;

        if (strike < 10) {
          strike = Math.round(strike * 100) / 100;
        }

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
        // i++;
      }

      const [
        baseLpAssetBalance,
        baseLpTotalAsset,
        baseLpTotalSupply,
        quoteLpAssetBalance,
        quoteLpTotalAsset,
        quoteLpTotalSupply,
      ] = await Promise.all([
        baseLpContract.totalAvailableAssets(),
        baseLpContract.totalAssets(),
        baseLpContract.totalSupply(),
        quoteLpContract.totalAvailableAssets(),
        quoteLpContract.totalAssets(),
        quoteLpContract.totalSupply(),
      ]);

      const quoteLpValue = BigNumber.from(oneEBigNumber(DECIMALS_USD))
        .mul(quoteLpTotalAsset)
        .div(
          quoteLpTotalSupply.eq(BigNumber.from(0))
            ? BigNumber.from(1)
            : quoteLpTotalSupply
        );
      const baseLpValue = BigNumber.from(oneEBigNumber(DECIMALS_TOKEN))
        .mul(baseLpTotalAsset)
        .div(
          baseLpTotalSupply.eq(BigNumber.from(0))
            ? BigNumber.from(1)
            : baseLpTotalSupply
        );

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
          baseLpValue,
          quoteLpAssetBalance,
          quoteLpTotalAsset,
          quoteLpTokenLiquidity,
          quoteLpValue,
          openInterest,
          expiry: expiry.toNumber(),
          maxLongStrikeVolAdjust,
          minLongStrikeVolAdjust,
        },
      }));
    } catch (err) {
      console.error(err);
      // throw new Error('fail to update zdteData');
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
    const { zdteData, selectedPoolName } = get();

    if (!zdteData || !selectedPoolName) {
      return;
    }

    let subgraphVolume = '...';
    try {
      const payload = await queryClient.fetchQuery({
        queryKey: ['getZdteSpreadTradesFromTimestamp'],
        queryFn: () =>
          graphSdk.getZdteSpreadTradesFromTimestamp({
            fromTimestamp: (new Date().getTime() / 1000 - 86400).toFixed(0),
          }),
      });

      const _twentyFourHourVolume: { [key: string]: BigNumber } =
        payload.trades.reduce(
          (acc: { ETH: BigNumber; ARB: BigNumber }, trade, _index) => {
            const address = trade.id.split('#')[0]!;
            if (address.toLowerCase() === ZDTE_ARB.toLowerCase())
              return {
                ARB: acc.ARB.add(BigNumber.from(trade.amount)),
                ETH: acc.ETH,
              };
            else {
              return {
                ARB: acc.ARB,
                ETH: acc.ETH.add(BigNumber.from(trade.amount)),
              };
            }
          },
          { ETH: BigNumber.from(0), ARB: BigNumber.from(0) }
        );

      const asset: string = selectedPoolName.toUpperCase() || '';
      const volume: BigNumber =
        _twentyFourHourVolume[asset] || BigNumber.from(0);
      volume;

      subgraphVolume = `$${formatAmount(
        getUserReadableAmount(volume.mul(2), DECIMALS_TOKEN) *
          zdteData.tokenPrice,
        2,
        true
      )}`;
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
