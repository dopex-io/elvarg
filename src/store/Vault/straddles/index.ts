import { StateCreator } from 'zustand';
import { BigNumber } from 'ethers';
import {
  AtlanticStraddle__factory,
  Addresses,
  AtlanticStraddle,
} from '@dopex-io/sdk';

import { WalletSlice } from 'store/Wallet';
import { CommonSlice } from 'store/Vault/common';

import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';

export interface StraddlesData {
  straddlesContract: AtlanticStraddle | undefined;
  currentEpoch: number;
  underlying: string;
  usd: string;
  isVaultReady: boolean;
  isEpochExpired: boolean;
}

export interface StraddlesEpochData {
  startTime: BigNumber;
  expiry: BigNumber;
  usdDeposits: BigNumber;
  activeUsdDeposits: BigNumber | string;
  settlementPrice: BigNumber | string;
  underlyingPurchased: BigNumber | string;
  usdPremiums: BigNumber | string;
  usdFunding: BigNumber | string;
  totalSold: BigNumber | string;
  currentPrice: BigNumber | string;
  straddlePrice: BigNumber | string;
  purchaseFee: BigNumber | string;
  straddlePremium: BigNumber | string;
  straddleFunding: BigNumber | string;
  aprPremium: string;
  aprFunding: BigNumber | string;
  volatility: string;
}

export interface WritePosition {
  epoch: number;
  usdDeposit: BigNumber;
  rollover: BigNumber;
  pnl: BigNumber;
  id: number;
}

export interface StraddlePosition {
  epoch: number;
  amount: BigNumber;
  apStrike: BigNumber;
  exercised: boolean;
  id: number;
  pnl: BigNumber;
}

export interface StraddlesUserData {
  writePositions?: WritePosition[];
  straddlePositions?: StraddlePosition[];
}

export interface StraddlesSlice {
  straddlesData?: StraddlesData | undefined;
  straddlesEpochData?: StraddlesEpochData | undefined;
  straddlesUserData?: StraddlesUserData | undefined;
  updateStraddlesEpochData: Function;
  updateStraddlesUserData: Function;
  updateStraddles: Function;
  setSelectedPoolName?: Function;
  getStraddlesContract: Function;
  getStraddlesWritePosition: Function;
  getStraddlePosition: Function;
}

export const createStraddlesSlice: StateCreator<
  StraddlesSlice & WalletSlice & CommonSlice,
  [['zustand/devtools', never]],
  [],
  StraddlesSlice
> = (set, get) => ({
  straddlesEpochData: {
    startTime: BigNumber.from(new Date().getTime()),
    expiry: BigNumber.from('0'),
    usdDeposits: BigNumber.from('0'),
    activeUsdDeposits: BigNumber.from('0'),
    settlementPrice: BigNumber.from('0'),
    underlyingPurchased: BigNumber.from('0'),
    usdFunding: BigNumber.from('0'),
    usdPremiums: BigNumber.from('0'),
    totalSold: BigNumber.from('0'),
    currentPrice: BigNumber.from('0'),
    straddlePrice: BigNumber.from('0'),
    purchaseFee: BigNumber.from('0'),
    straddlePremium: BigNumber.from('0'),
    straddleFunding: BigNumber.from('0'),
    aprPremium: '',
    aprFunding: '',
    volatility: '',
  },
  straddlesUserData: {},
  updateStraddlesEpochData: async () => {
    const { selectedEpoch, getStraddlesContract } = get();

    const straddlesContract = getStraddlesContract();

    if (selectedEpoch === null || !straddlesContract) return;

    const epochData = await straddlesContract!['epochData'](
      Math.max(selectedEpoch || 1, 1)
    );

    const epochCollectionsData = await straddlesContract![
      'epochCollectionsData'
    ](selectedEpoch);
    const currentPrice = await straddlesContract!['getUnderlyingPrice']();
    const usdFunding = epochCollectionsData['usdFunding'];
    const usdPremiums = epochCollectionsData['usdPremiums'];
    const totalSold = epochCollectionsData['totalSold'];

    let straddlePrice: BigNumber | string;
    let aprFunding: BigNumber | string;
    let volatility: string;
    let purchaseFee: BigNumber | string;
    let straddlePremium: BigNumber | string;
    let straddleFunding: BigNumber | string;

    try {
      straddlePremium = await straddlesContract!['calculatePremium'](
        true,
        currentPrice,
        getContractReadableAmount(1, 18),
        epochData['expiry']
      );
    } catch (e) {
      straddlePremium = BigNumber.from('0');
    }

    try {
      aprFunding = await straddlesContract!['apFundingPercent']();
      aprFunding = BigNumber.from(aprFunding).div(1e6);
    } catch (e) {
      aprFunding = BigNumber.from('0');
    }

    aprFunding = aprFunding.toString();

    try {
      purchaseFee = await straddlesContract!['purchaseFeePercent']();
      purchaseFee = BigNumber.from(purchaseFee).mul(currentPrice).mul(1e10);
    } catch (e) {
      purchaseFee = BigNumber.from('0');
    }

    try {
      volatility = (
        await straddlesContract!['getVolatility'](currentPrice)
      ).toString();
    } catch (e) {
      volatility = '...';
    }

    const timeToExpiry =
      epochData['expiry'].toNumber() - new Date().getTime() / 1000;

    const normApr = usdPremiums
      .mul(BigNumber.from(365))
      .mul(BigNumber.from(100))
      .div(
        epochData['activeUsdDeposits'].isZero()
          ? 1
          : epochData['activeUsdDeposits']
      )
      .div(BigNumber.from(3))
      .toNumber();
    const aprPremium = normApr.toFixed(0);

    straddleFunding = currentPrice
      .mul(getContractReadableAmount(16, 18))
      .mul(BigNumber.from(Math.round(timeToExpiry)))
      .div(BigNumber.from(365 * 86400))
      .div(1e2);

    straddlePrice = BigNumber.from(straddlePremium)
      .add(straddleFunding)
      .add(purchaseFee);

    if (straddlePrice.lt(0)) straddlePrice = BigNumber.from(0);

    set((prevState) => ({
      ...prevState,
      straddlesEpochData: {
        activeUsdDeposits: epochData['activeUsdDeposits'],
        expiry: epochData['expiry'],
        settlementPrice: epochData['settlementPrice'],
        startTime: epochData['startTime'],
        underlyingPurchased: epochData['underlyingPurchased'],
        usdDeposits: epochData['usdDeposits'],
        usdFunding,
        totalSold,
        usdPremiums,
        currentPrice,
        straddlePrice,
        purchaseFee,
        straddlePremium,
        straddleFunding,
        aprPremium,
        aprFunding,
        volatility,
      },
    }));
  },
  updateStraddlesUserData: async () => {
    const {
      selectedEpoch,
      accountAddress,
      getStraddlesContract,
      getStraddlesWritePosition,
      getStraddlePosition,
    } = get();

    const straddlesContract = getStraddlesContract();

    if (selectedEpoch === null || !accountAddress || !straddlesContract) return;

    const straddlePositionsPromises: any[] = [];
    const writePositionsPromises: any[] = [];

    const straddlePositionsIndexes: BigNumber[] = await straddlesContract[
      'straddlePositionsOfOwner'
    ](accountAddress);
    const writePositionsIndexes: BigNumber[] = await straddlesContract[
      'writePositionsOfOwner'
    ](accountAddress);

    straddlePositionsIndexes.map((straddlePositionsIndex) =>
      straddlePositionsPromises.push(
        getStraddlePosition(straddlePositionsIndex)
      )
    );
    writePositionsIndexes.map((writePositionsIndex) =>
      writePositionsPromises.push(
        getStraddlesWritePosition(writePositionsIndex)
      )
    );

    const straddlePositions: StraddlePosition[] = await Promise.all(
      straddlePositionsPromises
    );
    const writePositions: WritePosition[] = await Promise.all(
      writePositionsPromises
    );

    set((prevState) => ({
      ...prevState,
      straddlesUserData: {
        ...prevState.straddlesUserData,
        straddlePositions: straddlePositions.filter(function (el) {
          return el && el['epoch'];
        }),
        writePositions: writePositions.filter(function (el) {
          return el && el['epoch'];
        }),
      },
    }));
  },
  updateStraddles: async () => {
    const { setSelectedEpoch, getStraddlesContract } = get();

    const straddlesContract = getStraddlesContract();

    let currentEpoch = 0;
    let isEpochExpired: boolean;

    try {
      currentEpoch = Number(await straddlesContract!['currentEpoch']());

      isEpochExpired = await straddlesContract!['isEpochExpired'](currentEpoch);
      if (isEpochExpired) currentEpoch = currentEpoch + 1;
    } catch (err) {
      console.log(err);
      return;
    }

    const addresses = await straddlesContract!['addresses']();

    const underlying = addresses['underlying'];

    const usd = addresses['usd'];

    const isVaultReady = await straddlesContract!['isVaultReady'](currentEpoch);

    setSelectedEpoch(currentEpoch);

    set((prevState) => ({
      ...prevState,
      straddlesData: {
        usd: usd,
        underlying: underlying,
        currentEpoch: Number(currentEpoch),
        straddlesContract: straddlesContract,
        isVaultReady: isVaultReady,
        isEpochExpired: isEpochExpired,
      },
    }));
  },

  getStraddlesContract: () => {
    const { selectedPoolName, provider } = get();

    if (!selectedPoolName || !provider) return;

    return AtlanticStraddle__factory.connect(
      Addresses[42161].STRADDLES[selectedPoolName].Vault,
      provider
    );
  },
  getStraddlesWritePosition: async (id: BigNumber) => {
    const { getStraddlesContract, accountAddress } = get();

    const straddlesContract = getStraddlesContract();

    try {
      const owner = await straddlesContract!['ownerOf'](id);
      if (owner !== accountAddress) throw 'Invalid owner';

      const data = await straddlesContract!['writePositions'](id);
      const pnl = await straddlesContract!['calculateWritePositionPnl'](id);
      return {
        id: id,
        epoch: data['epoch'],
        usdDeposit: data['usdDeposit'],
        rollover: data['rollover'],
        pnl: pnl,
      };
    } catch {
      return {
        usdDeposit: BigNumber.from('0'),
      };
    }
  },
  getStraddlePosition: async (id: BigNumber) => {
    const { accountAddress, getStraddlesContract } = get();

    const straddlesContract = getStraddlesContract();

    try {
      const owner = await straddlesContract!['ownerOf'](id);
      if (owner !== accountAddress) throw 'Invalid owner';

      const data = await straddlesContract!['straddlePositions'](id);
      const pnl = await straddlesContract!['calculateStraddlePositionPnl'](id);
      return {
        id: id,
        epoch: data['epoch'],
        amount: data['amount'],
        apStrike: data['apStrike'],
        pnl: pnl,
      };
    } catch {
      return {
        amount: BigNumber.from('0'),
      };
    }
  },
});
