import { StateCreator } from 'zustand';
import { BigNumber } from 'ethers';
import { orderBy } from 'lodash';

// import { Addresses } from '@dopex-io/sdk';
import { OptionLP } from 'mocks/OptionLP';
import { OptionLP__factory } from 'mocks/factories/OptionLP__factory';

import { WalletSlice } from 'store/Wallet';
import { CommonSlice } from 'store/Vault/common';
import oneEBigNumber from 'utils/math/oneEBigNumber';
import { getCurrentTime } from 'utils/contracts';
import {
  ASC,
  DECIMALS_TOKEN,
  DECIMALS_USD,
  DESC,
  NULL,
  PERCENT,
} from '../../../constants';

// For Goerli test net
const OLP: string = '0xa1AFAF737E89575a6E4F51fa8e18c7D3b38823DC';
const TOKEN: string = '0xF54fcf65adA818b878eB9119D7aB38c708AF8fa5';

export interface OlpDataInterface {
  olpContract: OptionLP | undefined;
  tokenName: string;
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
  tokenLiquidity: BigNumber;
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

    // TODO: Addresses[CHAIN_ID].OLP[selectedPoolName].Vault
    try {
      return OptionLP__factory.connect(OLP, provider);
    } catch (err) {
      throw Error('unable to create address');
    }
  },
  updateOlp: async () => {
    const {
      getOlpContract,
      selectedPoolName,
      setSelectedEpoch,
      selectedIsPut,
    } = get();

    const olpContract = getOlpContract();

    try {
      const hasPut =
        (await olpContract.getTokenVaultRegistry(TOKEN, true)) !== NULL;
      const hasCall =
        (await olpContract.getTokenVaultRegistry(TOKEN, false)) !== NULL;

      let isPut: boolean = selectedIsPut;

      if (hasPut && !hasCall) {
        isPut = true;
      }

      const ssov = await olpContract.getTokenVaultRegistry(TOKEN, isPut);

      const [addresses, expiries, epochs, currentEpoch] = await Promise.all([
        olpContract.addresses(),
        olpContract.getSsovEpochExpiries(ssov),
        olpContract.getSsovEpochs(ssov),
        olpContract.getSsovEpoch(ssov),
      ]);

      setSelectedEpoch(expiries.length > 0 ? expiries.length : 0);

      set((prevState) => ({
        ...prevState,
        olpData: {
          olpContract: olpContract,
          tokenName: selectedPoolName,
          underlying: TOKEN,
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
        olpContract.getSsovEpochStrikes(
          ssov,
          olpData?.epochs[selectedEpoch - 1]
        ),
        olpContract.getSsovOptionTokens(
          ssov,
          olpData?.epochs[selectedEpoch - 1]
        ),
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

      const totalLiquidityPerStrike: BigNumber[] = [];
      strikeTokenLpPositions.map((tokens) => {
        const totalLpUsdLiquidity = tokens.reduce(
          (prev, position) => prev.add(position.usdLiquidity),
          BigNumber.from(0)
        );
        const totalLpUnderlyingLiquidity = tokens.reduce(
          (prev, position) => prev.add(position.underlyingLiquidity),
          BigNumber.from(0)
        );
        const totalLpUnderlyingLiquidityInUsd = totalLpUnderlyingLiquidity
          .mul(oneEBigNumber(DECIMALS_USD))
          .div(currentPrice)
          .div(oneEBigNumber(DECIMALS_TOKEN));
        totalLiquidityPerStrike.push(
          totalLpUsdLiquidity.add(totalLpUnderlyingLiquidityInUsd)
        );
      });

      const expiry = olpData?.expiries[selectedEpoch - 1] || BigNumber.from(0);

      const allLpPositions: LpPosition[] = await Promise.all(
        strikeTokenLpPositions
          .flat()
          .filter((pos) => !pos.killed)
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
            return {
              idx: idx,
              lpId: pos.lpId,
              epoch: pos.epoch,
              strike: pos.strike,
              usdLiquidity: pos.usdLiquidity,
              usdLiquidityUsed: pos.usdLiquidityUsed,
              underlyingLiquidity: pos.underlyingLiquidity,
              underlyingLiquidityUsed: pos.underlyingLiquidityUsed,
              discount: pos.discount,
              purchased: pos.purchased,
              expiry: expiry,
              premium: premium,
              underlyingPremium: underlyingPremium,
              impliedVol: impliedVol,
              buyer: pos.buyer,
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
          ),
          strikes: strikes,
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
        (pos) => pos.buyer === accountAddress
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
