import { StateCreator } from 'zustand';
import { BigNumber } from 'ethers';
import {
  AtlanticStraddle__factory,
  AtlanticStraddle,
  SSOVOptionPricing__factory,
  Addresses,
} from '@dopex-io/sdk';

import { WalletSlice } from 'store/Wallet';
import { CommonSlice } from 'store/Vault/common';

import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';

export interface StraddlesData {
  straddlesContract: AtlanticStraddle | undefined;
  currentEpoch: number;
  currentExpiry: BigNumber;
  underlying: string;
  usd: string;
  isVaultReady: boolean;
  isEpochExpired: boolean;
  blackoutPeriodBeforeExpiry: BigNumber;
}

export interface StraddlesEpochData {
  startTime: BigNumber;
  expiry: BigNumber;
  usdDeposits: BigNumber;
  activeUsdDeposits: BigNumber;
  settlementPrice: BigNumber;
  underlyingPurchased: BigNumber;
  usdPremiums: BigNumber;
  usdFunding: BigNumber;
  totalSold: BigNumber;
  currentPrice: BigNumber;
  straddlePrice: BigNumber;
  purchaseFee: BigNumber;
  straddlePremium: BigNumber;
  straddleFunding: BigNumber;
  aprPremium: string;
  aprFunding: BigNumber;
  volatility: BigNumber;
}

export interface WritePosition {
  epoch: BigNumber;
  usdDeposit: BigNumber;
  rollover: BigNumber;
  premiumFunding: BigNumber;
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
  straddlesEpochData?: StraddlesEpochData;
  straddlesUserData?: StraddlesUserData;
  updateStraddlesEpochData: Function;
  updateStraddlesUserData: Function;
  updateStraddles: Function;
  setSelectedPoolName?: Function;
  getStraddlesContract: Function;
  getOptionPricingContract: Function;
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
    aprFunding: BigNumber.from('0'),
    volatility: BigNumber.from('0'),
  },
  straddlesUserData: {},
  updateStraddlesEpochData: async () => {
    const { selectedEpoch, getStraddlesContract } = get();

    const straddlesContract: AtlanticStraddle = getStraddlesContract();

    if (selectedEpoch === null || !straddlesContract) return;

    const epochData = await straddlesContract!['epochData'](
      Math.max(selectedEpoch, 1)
    );

    const epochCollectionsData = await straddlesContract![
      'epochCollectionsData'
    ](selectedEpoch);
    const currentPrice = await straddlesContract!['getUnderlyingPrice']();
    const usdFunding = epochCollectionsData['usdFunding'];
    const usdPremiums = epochCollectionsData['usdPremiums'];
    const totalSold = epochCollectionsData['totalSold'];

    let straddlePrice: BigNumber;
    let aprFunding: BigNumber;
    let volatility: BigNumber;
    let purchaseFee: BigNumber;
    let straddlePremium: BigNumber;
    let straddleFunding: BigNumber;

    const timeToExpiry =
      epochData['expiry'].toNumber() - new Date().getTime() / 1000;

    try {
      const newData = await Promise.all([
        straddlesContract!['calculatePremium'](
          true,
          currentPrice,
          currentPrice,
          getContractReadableAmount(1, 18),
          epochData['expiry']
        ),
        straddlesContract!['apFundingPercent'](),
        straddlesContract!['purchaseFeePercent'](),
        straddlesContract!['getVolatility'](currentPrice),
        straddlesContract!['calculateApFunding'](
          currentPrice,
          getContractReadableAmount(1, 18),
          BigNumber.from(Math.round(timeToExpiry))
        ),
      ]);

      straddlePremium = newData[0].mul(BigNumber.from(2));
      aprFunding = newData[1].div(1e6);
      purchaseFee = newData[2]
        .mul(currentPrice)
        .mul(BigNumber.from(2))
        .mul(1e10);
      volatility = newData[3];
      straddleFunding = newData[4].mul(BigNumber.from(2));
    } catch (e) {
      straddlePremium = BigNumber.from('0');
      aprFunding = BigNumber.from('0');
      purchaseFee = BigNumber.from('0');
      volatility = BigNumber.from('0');
      straddleFunding = BigNumber.from('0');
    }

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

    straddlePrice = straddlePremium.add(straddleFunding).add(purchaseFee);

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
    try {
      const [straddlePositionsIndexes, writePositionsIndexes] =
        await Promise.all([
          straddlesContract['straddlePositionsOfOwner'](accountAddress),
          straddlesContract['writePositionsOfOwner'](accountAddress),
        ]);

      straddlePositionsIndexes.map((straddlePositionsIndex: BigNumber) =>
        straddlePositionsPromises.push(
          getStraddlePosition(straddlePositionsIndex)
        )
      );
      writePositionsIndexes.map((writePositionsIndex: BigNumber) =>
        writePositionsPromises.push(
          getStraddlesWritePosition(writePositionsIndex)
        )
      );
    } catch (e) {
      console.log(e);
    }

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

    const params = window.location.search.split('?epoch=');

    if (params.length === 2) currentEpoch = Number(params[1]!);

    const addresses = await straddlesContract!['addresses']();

    const underlying = addresses['underlying'];

    const usd = addresses['usd'];

    const isVaultReady = await straddlesContract!['isVaultReady'](currentEpoch);

    const blackOut = await straddlesContract!['blackoutPeriodBeforeExpiry']();

    const epochData = await straddlesContract!['epochData'](currentEpoch);

    setSelectedEpoch(currentEpoch);

    set((prevState) => ({
      ...prevState,
      straddlesData: {
        usd: usd,
        underlying: underlying,
        currentEpoch: Number(currentEpoch),
        currentExpiry: epochData.expiry,
        straddlesContract: straddlesContract,
        isVaultReady: isVaultReady,
        isEpochExpired: isEpochExpired,
        blackoutPeriodBeforeExpiry: blackOut,
      },
    }));
  },
  getStraddlesContract: () => {
    const { selectedPoolName, provider, chainId } = get();

    if (!selectedPoolName || !provider || !chainId) return;

    if (!Addresses[chainId]['STRADDLES'].Vault[selectedPoolName]) return;

    return AtlanticStraddle__factory.connect(
      Addresses[chainId]['STRADDLES'].Vault[selectedPoolName],
      provider
    );
  },
  getOptionPricingContract: () => {
    const { selectedPoolName, provider, chainId } = get();

    if (!selectedPoolName || !provider || !chainId) return;

    return SSOVOptionPricing__factory.connect(
      Addresses[chainId]['STRADDLES'].OPTION_PRICING,
      provider
    );
  },
  getStraddlesWritePosition: async (id: BigNumber) => {
    const {
      getStraddlesContract,
      accountAddress,
      straddlesEpochData,
      straddlesData,
    } = get();
    const straddlesContract = getStraddlesContract();

    try {
      const owner = await straddlesContract!['ownerOf'](id);
      if (owner !== accountAddress) throw 'Invalid owner';

      const data = await straddlesContract!['writePositions'](id);

      const totalPremiumFunding = straddlesEpochData!.usdPremiums.add(
        straddlesEpochData!.usdFunding
      );
      const premiumFunding =
        data['epoch'].toNumber() === straddlesData?.currentEpoch
          ? data.usdDeposit
              .mul(totalPremiumFunding)
              .div(straddlesEpochData!.usdDeposits)
          : BigNumber.from(0);

      return {
        id: id,
        epoch: data['epoch'],
        usdDeposit: data['usdDeposit'],
        rollover: data['rollover'],
        premiumFunding: premiumFunding,
      };
    } catch {
      return {
        usdDeposit: BigNumber.from('0'),
      };
    }
  },
  getStraddlePosition: async (id: BigNumber) => {
    const {
      accountAddress,
      getStraddlesContract,
      getOptionPricingContract,
      straddlesEpochData,
    } = get();

    const straddlesContract = getStraddlesContract();
    const optionsPricingContract = getOptionPricingContract();

    try {
      const owner = await straddlesContract!['ownerOf'](id);
      if (owner !== accountAddress) throw 'Invalid owner';

      const data = await straddlesContract!['straddlePositions'](id);
      const currentPrice = straddlesEpochData!.currentPrice;
      const volatility = straddlesEpochData!.volatility;
      const timeToExpiry = straddlesEpochData!.expiry;
      const strike = data['apStrike'];
      const amount = data['amount'];

      let [callPnl, putPnl] = await Promise.all([
        optionsPricingContract?.getOptionPrice(
          false,
          timeToExpiry,
          strike,
          currentPrice,
          volatility
        ),
        optionsPricingContract?.getOptionPrice(
          true,
          timeToExpiry,
          strike,
          currentPrice,
          volatility
        ),
      ]);

      // live pnl = 0.5 * BS(call) + 0.5 * BS(put)
      callPnl = callPnl ? callPnl.div(BigNumber.from(2)) : BigNumber.from(0);
      putPnl = putPnl ? putPnl.div(BigNumber.from(2)) : BigNumber.from(0);
      const pnl: BigNumber = callPnl.add(putPnl);

      return {
        id: id,
        epoch: data['epoch'],
        amount: amount,
        apStrike: strike,
        pnl: pnl.mul(amount).div(BigNumber.from(1e8)),
      };
    } catch (err) {
      console.log(err);
      return {
        amount: BigNumber.from('0'),
      };
    }
  },
});
