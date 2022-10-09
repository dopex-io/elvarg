import { StateCreator } from 'zustand';
import { BigNumber } from 'ethers';
import { orderBy } from 'lodash';

// import { Addresses } from '@dopex-io/sdk';
import { StraddleLp } from 'mocks/StraddleLp';
import { StraddleLp__factory } from 'mocks/factories/StraddleLp__factory';

import { WalletSlice } from 'store/Wallet';
import { CommonSlice } from 'store/Vault/common';
import { getCurrentTime } from 'utils/contracts';
import oneEBigNumber from 'utils/math/oneEBigNumber';
import { DECIMALS_TOKEN, PERCENT, DESC } from '../../../constants/index';

// For Goerli test net
const SLP: string = '0xE9Cfd9F1637d9bD851074be89586a481402A3986';
const TOKEN: string = '0xf54fcf65ada818b878eb9119d7ab38c708af8fa5';

export interface SlpDataInterface {
  slpContract: StraddleLp | undefined;
  tokenName: string;
  underlying: string;
  straddle: string;
  usd: string;
  currentEpoch: BigNumber;
  expiries: BigNumber[];
}

export interface LpPositionInterface {
  lpId: BigNumber;
  epoch: BigNumber;
  strike: BigNumber;
  usdLiquidity: BigNumber;
  usdLiquidityUsed: BigNumber;
  markup: BigNumber;
  purchased: BigNumber;
  seller: string;
  killed: boolean;
}

export interface WritePositionInterface {
  lpId: BigNumber;
  epoch: BigNumber;
  strike: BigNumber;
  liquidity: BigNumber;
  liquidityUsed: BigNumber;
  markup: BigNumber;
  purchased: BigNumber;
  expiry: BigNumber;
  premium: BigNumber;
  underlyingPremium: BigNumber;
  impliedVol: BigNumber;
  seller: string;
}

export interface PurchaseReceiptInterface {
  receiptId: BigNumber;
  epoch: BigNumber;
  strike: BigNumber;
  amount: BigNumber;
  buyer: string;
  settled: boolean;
}

export interface PurchasePositionInterface {
  receiptId: BigNumber;
  epoch: BigNumber;
  strike: BigNumber;
  amount: BigNumber;
  pnl: BigNumber;
  canSettle: boolean;
}

export interface LiquidityInterface {
  write: BigNumber;
  purchase: BigNumber;
}

export interface slpEpochDataInterface {
  lpPositions: WritePositionInterface[];
  liquidity: LiquidityInterface[];
  strikes: BigNumber[];
  currentPrice: BigNumber;
  isEpochExpired: boolean;
  expiry: BigNumber;
}

export interface SlpUserLpData {
  positions: WritePositionInterface[] | undefined;
}

export interface SlpUserPurchaseData {
  positions: PurchasePositionInterface[];
}

export interface SlpSlice {
  getSlpContract: Function;
  slpData?: SlpDataInterface;
  slpEpochData?: slpEpochDataInterface;
  slpUserProvideLpData?: SlpUserLpData;
  slpUserPurchaseData?: SlpUserPurchaseData;
  selectedLpPositionIdx?: number;
  setSelectedLpPositionIdx: Function;
  selectedPurchaseIdx?: number;
  setSelectedPurchaseIdx: Function;
  updateSlp: Function;
  updateSlpEpochData: Function;
  updateSlpUserProvideLpData: Function;
  updateSlpUserPurchaseData: Function;
}

export const createSlpSlice: StateCreator<
  SlpSlice & WalletSlice & CommonSlice,
  [['zustand/devtools', never]],
  [],
  SlpSlice
> = (set, get) => ({
  getSlpContract: () => {
    const { selectedPoolName, provider } = get();

    if (!selectedPoolName || !provider) return;

    // TODO: Addresses[CHAIN_ID].SLP[selectedPoolName].Vault
    return StraddleLp__factory.connect(SLP, provider);
  },
  updateSlp: async () => {
    const { getSlpContract, selectedPoolName, setSelectedEpoch } = get();

    const slpContract = getSlpContract();

    try {
      const [addresses, expiries, currentEpoch] = await Promise.all([
        slpContract.addresses(),
        slpContract.getStraddleExpiries(),
        slpContract.getStraddleEpoch(),
      ]);

      setSelectedEpoch(expiries.length > 0 ? expiries.length : 0);

      set((prevState) => ({
        ...prevState,
        slpData: {
          slpContract: slpContract,
          tokenName: selectedPoolName,
          underlying: TOKEN,
          straddle: addresses.straddle,
          usd: addresses.usd,
          currentEpoch: currentEpoch,
          expiries: expiries,
        },
      }));
    } catch (err) {
      console.log(err);
    }
  },
  slpEpochData: {
    lpPositions: [],
    liquidity: [],
    strikes: [],
    currentPrice: BigNumber.from(0),
    isEpochExpired: false,
    expiry: BigNumber.from(0),
  },
  updateSlpEpochData: async () => {
    const { getSlpContract, selectedEpoch, slpData } = get();

    const slpContract = getSlpContract();

    try {
      const currentPrice: BigNumber = await slpContract.getStraddleAssetPrice();
      const strikes: BigNumber[] = await slpContract.getEpochStrikes(
        selectedEpoch
      );
      const lpPositionsPromise: Promise<LpPositionInterface[]>[] = [];
      const liquidityPromise: Promise<LiquidityInterface>[] = [];

      strikes.map((strike) => {
        lpPositionsPromise.push(slpContract.getAllLpPositions(strike));
        liquidityPromise.push(
          slpContract.getEpochStrikeLiquidity(selectedEpoch, strike)
        );
      });

      const allLpPositions = await Promise.all(lpPositionsPromise);

      const writePositions = await Promise.all(
        allLpPositions
          .flat()
          .filter((pos) => !pos.killed)
          .map(async (pos) => {
            let impliedVol: BigNumber = await slpContract.getStraddleVolatility(
              pos.strike
            );
            impliedVol = impliedVol.mul(PERCENT.add(pos.markup)).div(PERCENT);

            const premium: BigNumber = await slpContract.calculatePremium(
              pos.strike,
              oneEBigNumber(DECIMALS_TOKEN),
              impliedVol
            );

            return {
              lpId: pos.lpId,
              epoch: pos.epoch,
              strike: pos.strike,
              liquidity: pos.usdLiquidity,
              liquidityUsed: pos.usdLiquidityUsed,
              markup: pos.markup,
              purchased: pos.purchased,
              expiry: expiry,
              premium: premium,
              underlyingPremium: premium,
              impliedVol: impliedVol,
              seller: pos.seller,
            };
          })
      );

      const strikeLiquidity = await Promise.all(liquidityPromise);
      const expiry: BigNumber =
        slpData?.expiries[selectedEpoch - 1] || BigNumber.from(0);

      set((prevState) => ({
        ...prevState,
        slpEpochData: {
          lpPositions: orderBy(
            writePositions,
            [
              function (pos) {
                return pos.strike.toNumber();
              },
              function (pos) {
                return pos.markup.toNumber();
              },
            ],
            [DESC, DESC]
          ),
          liquidity: strikeLiquidity,
          strikes: orderBy(
            strikes,
            [
              function (strike) {
                return strike.toNumber();
              },
            ],
            DESC
          ),
          currentPrice: currentPrice,
          isEpochExpired: expiry.lt(BigNumber.from(getCurrentTime().toFixed())),
          expiry: expiry,
        },
      }));
    } catch (err) {
      console.log(err);
    }
  },
  slpUserProvideLpData: {
    positions: [],
  },
  updateSlpUserProvideLpData: async () => {
    const { accountAddress, slpEpochData } = get();

    try {
      const userPositions = slpEpochData?.lpPositions.filter(
        (pos) => pos.seller === accountAddress
      );

      set((prevState) => ({
        ...prevState,
        slpUserProvideLpData: {
          positions: userPositions,
        },
      }));
    } catch (err) {
      console.log(err);
    }
  },
  slpUserPurchaseData: {
    positions: [],
  },
  updateSlpUserPurchaseData: async () => {
    const { accountAddress, getSlpContract, slpEpochData, selectedEpoch } =
      get();

    const slpContract = getSlpContract();

    try {
      const purchaseReceiptsPromise: Promise<PurchaseReceiptInterface[]>[] = [];
      slpEpochData?.strikes.map((strike) => {
        purchaseReceiptsPromise.push(
          slpContract.getUserPurchasePositions(strike, accountAddress)
        );
      });

      const purchaseReceipts = (
        await Promise.all(purchaseReceiptsPromise)
      ).flat();

      const purchasePositions: PurchasePositionInterface[] = await Promise.all(
        purchaseReceipts
          .filter((receipt) => !receipt.settled)
          .map(async (receipt) => {
            return {
              receiptId: receipt.receiptId,
              epoch: receipt.epoch,
              strike: receipt.strike,
              amount: receipt.amount,
              pnl: await slpContract.calculatePutOptionPnl(
                receipt.epoch,
                receipt.strike,
                receipt.amount
              ),
              canSettle: await slpContract.hasEpochExpired(receipt.epoch),
            };
          })
      );

      set((prevState) => ({
        ...prevState,
        slpUserPurchaseData: {
          positions: purchasePositions.filter(
            (pos) => pos.epoch.toNumber() === selectedEpoch
          ),
        },
      }));
    } catch (err) {
      console.log(err);
    }
  },
  selectedLpPositionIdx: 0,
  setSelectedLpPositionIdx: (idx: number) =>
    set((prevState) => ({
      ...prevState,
      selectedLpPositionIdx: idx,
    })),
  selectedPurchaseIdx: 0,
  setSelectedPurchaseIdx: (idx: number) =>
    set((prevState) => ({
      ...prevState,
      selectedPurchaseIdx: idx,
    })),
});
