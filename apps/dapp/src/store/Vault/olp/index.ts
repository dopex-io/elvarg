import { StateCreator } from 'zustand';
import { BigNumber } from 'ethers';
import orderBy from 'lodash/orderBy';
import { SsovLp, SsovLp__factory, Addresses } from '@dopex-io/sdk';

import { WalletSlice } from 'store/Wallet';
import { CommonSlice } from 'store/Vault/common';

import oneEBigNumber from 'utils/math/oneEBigNumber';
import { getCurrentTime } from 'utils/contracts';
import {
  ASC,
  DECIMALS_STRIKE,
  DECIMALS_TOKEN,
  DECIMALS_USD,
  DESC,
  ZERO_ADDRESS,
  PERCENT,
} from '../../../constants';

export interface OlpDataInterface {
  olpContract: SsovLp | undefined;
  underlyingSymbol: string;
  underlying: string;
  ssov: string | undefined;
  usd: string;
  currentEpoch: BigNumber;
  expiries: BigNumber[];
  epochs: BigNumber[];
  hasPut: boolean;
  hasCall: boolean;
  isPut: boolean;
}

export interface OlpEpochDataInterface {
  totalLiquidityPerStrike: BigNumber[];
  lpPositions: LpPosition[];
  strikes: BigNumber[];
  strikeToUtilization: Record<string, BigNumber>;
  strikeTokens: string[];
  optionTokens: OptionTokenInfoInterface[];
  isEpochExpired: boolean;
  expiry: BigNumber;
}

export interface OlpUserDataInterface {
  userPositions: LpPosition[] | undefined;
}

export interface OptionTokenInfoInterface {
  ssov: string;
  strike: BigNumber;
  usdLiquidity: BigNumber;
  underlyingLiquidity: BigNumber;
}

export interface LpPositionInterface {
  lpId: BigNumber;
  epoch: BigNumber;
  strike: BigNumber;
  usdLiquidity: BigNumber;
  usdLiquidityUsed: BigNumber;
  underlyingLiquidity: BigNumber;
  underlyingLiquidityUsed: BigNumber;
  discount: BigNumber;
  purchased: BigNumber;
  buyer: string;
  killed: boolean;
}

export interface LpPosition {
  idx: number;
  lpId: BigNumber;
  epoch: BigNumber;
  strike: BigNumber;
  usdLiquidity: BigNumber;
  usdLiquidityUsed: BigNumber;
  underlyingLiquidity: BigNumber;
  underlyingLiquidityUsed: BigNumber;
  discount: BigNumber;
  purchased: BigNumber;
  expiry: BigNumber;
  premium: BigNumber;
  underlyingPremium: BigNumber;
  impliedVol: BigNumber;
  buyer: string;
}

export interface OlpSlice {
  olpData?: OlpDataInterface;
  olpEpochData?: OlpEpochDataInterface;
  olpUserData?: OlpUserDataInterface;
  selectedPositionIdx?: number;
  updateOlp: Function;
  updateOlpEpochData: Function;
  updateOlpUserData: Function;
  getOlpContract: Function;
  setSelectedPositionIdx: Function;
}

export const createOlpSlice: StateCreator<
  OlpSlice & WalletSlice & CommonSlice,
  [['zustand/devtools', never]],
  [],
  OlpSlice
> = (set, get) => ({
  getOlpContract: () => {
    const { selectedPoolName, provider } = get();

    if (!selectedPoolName || !provider) return;

    try {
      return SsovLp__factory.connect(
        Addresses[42161].OLP.SsovLp[selectedPoolName],
        provider
      );
    } catch (err) {
      console.log(err);
      throw Error('unable to create address');
    }
  },
  updateOlp: async () => {
    const {
      getOlpContract,
      setSelectedEpoch,
      selectedIsPut,
      selectedPoolName,
    } = get();

    // selectedPoolName e.g., DPX-MONTHLY
    const tokenSymbol: string =
      selectedPoolName.split('-')[0]?.toUpperCase() || '';
    const tokenAddress = Addresses[42161][tokenSymbol];
    const olpContract = getOlpContract();

    try {
      const [ssovPutAddress, ssovCallAddress] = await Promise.all([
        olpContract.getTokenVaultRegistry(tokenAddress, true),
        olpContract.getTokenVaultRegistry(tokenAddress, false),
      ]);

      const hasPut = ssovPutAddress !== ZERO_ADDRESS;
      const hasCall = ssovCallAddress !== ZERO_ADDRESS;

      let isPut: boolean = selectedIsPut;
      if (hasPut && !hasCall) {
        isPut = true;
      }

      const ssov = isPut ? ssovPutAddress : ssovCallAddress;

      const [addresses, expiries, epochs, currentEpoch] = await Promise.all([
        olpContract.addresses(),
        olpContract.getSsovEpochExpiries(ssov),
        olpContract.getSsovEpochs(ssov),
        olpContract.getSsovEpoch(ssov),
      ]);

      setSelectedEpoch(expiries.length > 0 ? expiries.length - 1 : 0);

      set((prevState) => ({
        ...prevState,
        olpData: {
          olpContract: olpContract,
          underlyingSymbol: tokenSymbol,
          underlying: tokenAddress,
          ssov: ssov,
          usd: addresses.usd,
          currentEpoch: currentEpoch,
          expiries: expiries,
          epochs: epochs,
          hasPut: hasPut,
          hasCall: hasCall,
          isPut: isPut,
        },
      }));
    } catch (err) {
      console.log(err);
    }
  },
  olpEpochData: {
    totalLiquidityPerStrike: [],
    lpPositions: [],
    strikes: [],
    strikeToUtilization: {},
    strikeTokens: [],
    optionTokens: [],
    isEpochExpired: false,
    expiry: BigNumber.from(0),
  },
  updateOlpEpochData: async () => {
    const { getOlpContract, selectedEpoch, olpData } = get();

    const olpContract = getOlpContract();

    try {
      const ssov = olpData?.ssov;

      const [strikes, strikeTokens] = await Promise.all([
        olpContract.getSsovEpochStrikes(ssov, olpData?.epochs[selectedEpoch]),
        olpContract.getSsovOptionTokens(ssov, olpData?.epochs[selectedEpoch]),
      ]);

      const strikeTokensInfoPromise: Promise<OptionTokenInfoInterface>[] = [];
      const lpPositionsPromise: Promise<LpPositionInterface[]>[] = [];

      strikeTokens.map((token: string) => {
        strikeTokensInfoPromise.push(olpContract.getOptionTokenInfo(token));
        lpPositionsPromise.push(olpContract.getAllLpPositions(token));
      });

      const strikeTokenLpPositions = await Promise.all(lpPositionsPromise);
      const strikeTokensInfo = await Promise.all(strikeTokensInfoPromise);
      const currentPrice = await olpContract?.getSsovUnderlyingPrice(ssov);
      const totalLiquidityPerStrike = strikeTokensInfo.map(
        ({ usdLiquidity, underlyingLiquidity }) => {
          const underLiqToUsd = underlyingLiquidity
            .mul(currentPrice)
            .mul(oneEBigNumber(DECIMALS_USD))
            .div(oneEBigNumber(DECIMALS_STRIKE))
            .div(oneEBigNumber(DECIMALS_TOKEN));
          return usdLiquidity.add(underLiqToUsd);
        }
      );

      const expiry = olpData?.expiries[selectedEpoch] || BigNumber.from(0);
      const strikeToUtilization: Record<string, BigNumber> = {};

      const allLpPositions: LpPosition[] = await Promise.all(
        strikeTokenLpPositions
          .flat()
          .filter(({ killed }) => !killed)
          .map(async (pos, idx) => {
            let impliedVol: BigNumber = await olpContract?.getSsovVolatility(
              olpData?.ssov,
              pos?.strike
            );
            impliedVol = impliedVol.mul(PERCENT.sub(pos.discount)).div(PERCENT);
            const premium: BigNumber = await olpContract?.calculatePremium(
              olpData?.isPut,
              pos.strike,
              expiry,
              oneEBigNumber(DECIMALS_TOKEN),
              impliedVol,
              olpData?.ssov
            );
            const underlyingPremium: BigNumber =
              await olpContract?.getPremiumInUnderlying(olpData?.ssov, premium);
            const underlyingUsedinUsd = pos.underlyingLiquidity
              .mul(currentPrice)
              .mul(oneEBigNumber(DECIMALS_USD))
              .div(oneEBigNumber(DECIMALS_STRIKE))
              .div(oneEBigNumber(DECIMALS_TOKEN));
            strikeToUtilization[pos.strike.toString()] = strikeToUtilization[
              pos.strike.toString()
            ]
              ? strikeToUtilization[pos.strike.toString()]!.add(
                  pos.usdLiquidityUsed.add(underlyingUsedinUsd)
                )
              : pos.usdLiquidityUsed.add(underlyingUsedinUsd);
            return {
              ...pos,
              idx: idx,
              expiry: expiry,
              premium: premium,
              underlyingPremium: underlyingPremium,
              impliedVol: impliedVol,
            };
          })
      );

      set((prevState) => ({
        ...prevState,
        olpEpochData: {
          totalLiquidityPerStrike: totalLiquidityPerStrike,
          lpPositions: orderBy(
            allLpPositions,
            [
              function (pos) {
                return pos.strike.toNumber();
              },
              function (pos) {
                return pos.discount.toNumber();
              },
            ],
            olpData?.isPut ? [DESC, ASC] : [ASC, ASC]
          ).map((pos, idx) => ({ ...pos, idx: idx })),
          strikes: strikes,
          strikeToUtilization: strikeToUtilization,
          strikeTokens: strikeTokens,
          optionTokens: strikeTokensInfo,
          isEpochExpired: expiry.lt(BigNumber.from(getCurrentTime().toFixed())),
          expiry: expiry,
        },
      }));
    } catch (err) {
      console.log(err);
    }
  },
  olpUserData: {
    userPositions: [],
  },
  updateOlpUserData: async () => {
    try {
      const { accountAddress, olpEpochData } = get();

      const currentPositions = olpEpochData?.lpPositions.filter(
        ({ buyer }) => buyer === accountAddress
      );

      set((prevState) => ({
        ...prevState,
        olpUserData: {
          userPositions: currentPositions,
        },
      }));
    } catch (err) {
      console.log(err);
    }
  },
  selectedPositionIdx: 0,
  setSelectedPositionIdx: (idx: number) =>
    set((prevState) => ({
      ...prevState,
      selectedPositionIdx: idx,
    })),
});
