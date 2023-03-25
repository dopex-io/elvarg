import { BigNumber } from 'ethers';

import {
  Addresses,
  AtlanticStraddle,
  AtlanticStraddleV2,
  AtlanticStraddleV2__factory,
  AtlanticStraddle__factory,
  SSOVOptionPricing__factory,
} from '@dopex-io/sdk';
import { StateCreator } from 'zustand';

import { CommonSlice } from 'store/Vault/common';
import { WalletSlice } from 'store/Wallet';

import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';

export interface StraddlesData {
  straddlesContract: AtlanticStraddle | AtlanticStraddleV2 | undefined;
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
    const { selectedEpoch, getStraddlesContract, chainId } = get();

    const straddlesContract = getStraddlesContract();

    if (selectedEpoch === null || !straddlesContract) return;

    // Make all calls
    let [epochData, x, currentPrice] = await Promise.all([
      straddlesContract!['epochData'](Math.max(selectedEpoch, 1)),
      chainId !== 137
        ? straddlesContract!['epochCollectionsData'](selectedEpoch)
        : () => {},
      straddlesContract!['getUnderlyingPrice'](),
    ]);

    let usdFunding: BigNumber;
    let usdPremiums: BigNumber;
    let totalSold: BigNumber;

    if (chainId === 137) {
      usdFunding = epochData['usdFunding'];
      usdPremiums = epochData['usdPremiums'];
      totalSold = epochData['totalSold'];
    } else {
      usdFunding = x['usdFunding'];
      usdPremiums = x['usdPremiums'];
      totalSold = x['totalSold'];
    }

    let straddlePrice: BigNumber;
    let aprFunding: BigNumber;
    let volatility: BigNumber;
    let purchaseFee: BigNumber;
    let straddlePremium: BigNumber;
    let straddleFunding: BigNumber;

    const timeToExpiry =
      epochData['expiry'].toNumber() - new Date().getTime() / 1000;

    try {
      if (chainId === 137) {
        const newData = await Promise.all([
          straddlesContract!['calculatePremium'](
            true,
            currentPrice,
            currentPrice,
            getContractReadableAmount(1, 18),
            epochData['expiry']
          ),
          straddlesContract!['vaultVariables'](),
          straddlesContract!['getVolatility'](currentPrice),
          straddlesContract!['calculateApFunding'](
            currentPrice,
            getContractReadableAmount(1, 18),
            BigNumber.from(Math.round(timeToExpiry))
          ),
        ]);

        straddlePremium = newData[0].mul(BigNumber.from(2));
        aprFunding = newData[1].apFundingPercent.div(1e6);
        purchaseFee = newData[1].purchaseFeePercent
          .mul(currentPrice)
          .mul(BigNumber.from(2))
          .mul(1e10);
        volatility = newData[2];
        straddleFunding = newData[3].mul(BigNumber.from(2));
      } else {
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
      }
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
    const { setSelectedEpoch, getStraddlesContract, chainId } = get();

    const straddlesContract = getStraddlesContract();

    try {
      let isEpochExpired: boolean;

      // Make all epoch agnostic calls first
      // x below could be vaultVariables or blackoutPeriodBeforeExpiry
      let [currentEpoch, addresses, x] = await Promise.all([
        straddlesContract!['currentEpoch'](),
        straddlesContract!['addresses'](),
        chainId === 137
          ? straddlesContract!['vaultVariables']()
          : straddlesContract!['blackoutPeriodBeforeExpiry'](),
      ]);

      // Make all epoch calls
      // y below could be epochStatus or isEpochExpired
      // z is isVaultReady is the version is 1
      let [y, z, epochData] = await Promise.all([
        chainId === 137
          ? straddlesContract!['epochStatus'](currentEpoch)
          : straddlesContract!['isEpochExpired'](currentEpoch),
        chainId === 137
          ? () => {}
          : straddlesContract!['isVaultReady'](currentEpoch),
        straddlesContract!['epochData'](currentEpoch),
      ]);

      if (chainId === 137) {
        // Epoch Status 3 = Expired
        if (y === 3) currentEpoch = currentEpoch + 1;
      } else {
        if (y) currentEpoch = currentEpoch + 1;
      }

      const params = window.location.search.split('?epoch=');

      let _selectedEpoch = currentEpoch;

      if (params.length === 2) _selectedEpoch = Number(params[1]!);

      const underlying = addresses['underlying'];

      const usd = addresses['usd'];
      let isVaultReady: boolean;

      if (chainId === 137) {
        isVaultReady = y === 1;
      } else {
        isVaultReady = z;
      }

      let blackOut: BigNumber;

      if (chainId === 137) {
        blackOut = x.blackoutPeriodBeforeExpiry;
      } else {
        blackOut = x;
      }

      setSelectedEpoch(_selectedEpoch);

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
    } catch (err) {
      console.log(err);
      return;
    }
  },
  getStraddlesContract: () => {
    const { selectedPoolName, provider, chainId } = get();

    if (!selectedPoolName || !provider || !chainId) return;

    if (!Addresses[chainId]['STRADDLES'].Vault[selectedPoolName]) return;

    if (chainId === 137)
      return AtlanticStraddleV2__factory.connect(
        Addresses[chainId]['STRADDLES'].Vault[selectedPoolName],
        provider
      );

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
      const [owner, data] = await Promise.all([
        straddlesContract!['ownerOf'](id),
        straddlesContract!['writePositions'](id),
      ]);

      if (owner !== accountAddress) throw 'Invalid owner';

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
      const [owner, data] = await Promise.all([
        straddlesContract!['ownerOf'](id),
        straddlesContract!['straddlePositions'](id),
      ]);

      if (owner !== accountAddress) throw 'Invalid owner';

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
