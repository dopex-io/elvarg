import { StateCreator } from 'zustand';
import { BigNumber } from 'ethers';
// import { Addresses } from '@dopex-io/sdk';
import { OptionLP } from 'mocks/OptionLP';
import { OptionLP__factory } from 'mocks/factories/OptionLP__factory';

import { WalletSlice } from 'store/Wallet';
import { CommonSlice } from 'store/Vault/common';

// For Goerli test net
const OLP: string = '0xaad25870e0569398c181276dbbb52b26db7e9bc8';
const TOKEN: string = '0xf54fcf65ada818b878eb9119d7ab38c708af8fa5';

export interface OlpDataInterface {
  olpContract: OptionLP | undefined;
  tokenName: string;
  underlying: string;
  ssov: string;
  usd: string;
  currentEpoch: BigNumber;
  expiries: BigNumber[];
}

export interface OlpEpochDataInterface {
  totalLiquidityPerStrike: BigNumber[];
  lpPositions: LpPositionInterface[];
  strikes: BigNumber[];
  strikeTokens: string[];
  optionTokens: OptionTokenInfoInterface[];
  isEpochExpired: boolean;
  expiry: BigNumber;
}

export interface OlpUserDataInterface {
  userPositions: LpPositionInterface[];
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
  liquidity: BigNumber;
  liquidityUsed: BigNumber;
  discount: BigNumber;
  purchased: BigNumber;
  buyer: string;
  killed: boolean;
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
    return OptionLP__factory.connect(OLP, provider);
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
      const ssov = await olpContract.getTokenVaultRegistry(
        TOKEN,
        selectedIsPut
      );

      const [usd, expiries, currentEpoch] = await Promise.all([
        olpContract.addresses(),
        olpContract.getSsovEpochExpiries(ssov),
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
          usd: usd,
          currentEpoch: currentEpoch,
          expiries: expiries,
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
    const { getOlpContract, selectedEpoch, selectedIsPut, olpData } = get();

    const olpContract = getOlpContract();

    try {
      const ssov = await olpContract.getTokenVaultRegistry(
        TOKEN,
        selectedIsPut
      );

      const [strikes, strikeTokens] = await Promise.all([
        olpContract.getSsovEpochStrikes(ssov, selectedEpoch),
        olpContract.getSsovOptionTokens(ssov, selectedEpoch),
      ]);

      const strikeTokensInfoPromise: Promise<OptionTokenInfoInterface>[] = [];
      const lpPositionsPromise: Promise<LpPositionInterface[]>[] = [];

      strikeTokens.map((token: string) => {
        strikeTokensInfoPromise.push(olpContract.getOptionTokenInfo(token));
        lpPositionsPromise.push(olpContract.getAllLpPositions(token));
      });

      const strikeTokenLpPositions = await Promise.all(lpPositionsPromise);
      const strikeTokensInfo = await Promise.all(strikeTokensInfoPromise);

      const totalLiquidityPerStrike: BigNumber[] = [];
      strikeTokenLpPositions.map((tokens) => {
        const totalLpLiquidity = tokens.reduce(
          (prev, position) => prev.add(position.liquidity),
          BigNumber.from(0)
        );
        totalLiquidityPerStrike.push(totalLpLiquidity);
      });

      const expiry = olpData?.expiries[selectedEpoch - 1] || BigNumber.from(0);

      set((prevState) => ({
        ...prevState,
        olpEpochData: {
          totalLiquidityPerStrike: totalLiquidityPerStrike,
          lpPositions: strikeTokenLpPositions
            .flat()
            .filter((position) => !position.killed),
          strikes: strikes,
          strikeTokens: strikeTokens,
          optionTokens: strikeTokensInfo,
          expiry: expiry,
          isEpochExpired: expiry.lt(
            BigNumber.from((new Date().getTime() / 1000).toFixed())
          ),
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
      const { accountAddress, getOlpContract, olpEpochData } = get();

      const olpContract = getOlpContract();

      const lpPositionsPromise: Promise<LpPositionInterface[]>[] = [];
      olpEpochData?.strikeTokens?.map((token) => {
        lpPositionsPromise.push(
          olpContract.getUserLpPositions(accountAddress, token)
        );
      });

      const currentPositions: LpPositionInterface[] = (
        await Promise.all(lpPositionsPromise)
      ).flat();

      set((prevState) => ({
        ...prevState,
        olpUserData: {
          userPositions: currentPositions.filter(
            (position) => !position.killed
          ),
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
