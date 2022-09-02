import { StateCreator } from 'zustand';
import {
  VolatilityOracle,
  SSOVOptionPricing,
  RateVault__factory,
  CurveGaugesOracle__factory,
  RateVault,
} from '@dopex-io/sdk';
import { BigNumber, ethers } from 'ethers';

import { WalletSlice } from 'store/Wallet';
import { CommonSlice } from 'store/Vault/common';

export interface RateVaultData {
  rateVaultContract: any;
  currentEpoch: number;
  isCurrentEpochExpired: boolean;
  rateVaultOptionPricingContract?: SSOVOptionPricing;
  volatilityOracleContract?: VolatilityOracle;
}

export interface RateVaultEpochData {
  volatilities: BigNumber[];
  callsFees: BigNumber[];
  putsFees: BigNumber[];
  callsPremiumCosts: BigNumber[];
  putsPremiumCosts: BigNumber[];
  lpPrice: BigNumber;
  callsCosts: BigNumber[];
  putsCosts: BigNumber[];
  totalCallsPremiums: BigNumber;
  totalPutsPremiums: BigNumber;
  callsDeposits: BigNumber[];
  putsDeposits: BigNumber[];
  totalCallsPurchased: BigNumber;
  totalPutsPurchased: BigNumber;
  totalCallsDeposits: BigNumber;
  totalPutsDeposits: BigNumber;
  totalTokenDeposits: BigNumber;
  epochCallsPremium: BigNumber;
  epochPutsPremium: BigNumber;
  epochStartTimes: BigNumber;
  epochEndTimes: BigNumber;
  epochTimes: [BigNumber, BigNumber];
  isEpochExpired: boolean;
  isVaultReady: boolean;
  epochBalanceAfterUnstaking: BigNumber;
  crvToDistribute: BigNumber;
  rateAtSettlement: BigNumber;
  epochStrikes: BigNumber[];
  callsLeverages: BigNumber[];
  putsLeverages: BigNumber[];
  callsToken: string[];
  putsToken: string[];
  isBootstrapped: boolean;
  epochStrikeCallsPremium: BigNumber[];
  epochStrikePutsPremium: BigNumber[];
  curveLpPrice: BigNumber;
  rate: BigNumber;
}

export interface RateVaultUserData {
  userEpochStrikeDeposits: {
    amount: BigNumber;
    callLeverage: BigNumber;
    putLeverage: BigNumber;
    callLeverageIndex: number;
    putLeverageIndex: number;
    strike: BigNumber;
    strikeIndex: number;
  }[];
  userStrikePurchaseData: {
    callsPurchased: BigNumber;
    putsPurchased: BigNumber;
    strikeIndex: number;
    strike: BigNumber;
  }[];
}

export interface RateVaultSlice {
  rateVaultData?: RateVaultData;
  rateVaultEpochData?: RateVaultEpochData;
  rateVaultUserData?: RateVaultUserData;
  updateRateVaultEpochData: Function;
  updateRateVaultUserData: Function;
  updateRateVault: Function;
  getUserStrikePurchaseData: Function;
  getUserStrikeDeposits: Function;
  getRateVaultContract: Function;
  getGaugeOracle: Function;
  getTotalStrikeData?: Function;
  getCurrentRate: Function;
  calculatePremium: Function;
}

const initialRateVaultUserData = {
  userEpochStrikeDeposits: [],
  userStrikePurchaseData: [],
};

export const createRateVaultSlice: StateCreator<
  WalletSlice & CommonSlice & RateVaultSlice,
  [['zustand/devtools', never]],
  [],
  RateVaultSlice
> = (set, get) => ({
  rateVaultUserData: initialRateVaultUserData,
  updateRateVaultEpochData: async () => {
    const {
      selectedPoolName,
      selectedEpoch,
      getRateVaultContract,
      getCurrentRate,
      calculatePremium,
    } = get();

    const rateVaultContract: RateVault = getRateVaultContract();

    if (selectedEpoch === null || !selectedPoolName || !rateVaultContract)
      return;
    const lpPrice = await rateVaultContract['getLpPrice']();

    try {
      const promises = await Promise.all([
        rateVaultContract!['getEpochData'](Math.max(selectedEpoch || 0, 1)) ?? [
          [],
          [],
          [],
        ],
        rateVaultContract!['totalEpochData'](Math.max(selectedEpoch || 0, 1)),
        rateVaultContract!['getEpochLeverages'](
          Math.max(selectedEpoch || 0, 1)
        ) ?? [[], []],
        rateVaultContract!['getEpochPremiums'](Math.max(selectedEpoch || 0, 1)),
        rateVaultContract!['getEpochStrikes'](Math.max(selectedEpoch || 0, 1)),
      ]);

      const epochStrikes = promises[4];
      const epochCallsStrikeTokens = promises[0][1];
      const epochPutsStrikeTokens = promises[0][2];

      let epochTimes: [BigNumber, BigNumber];

      epochTimes = await rateVaultContract['getEpochTimes'](
        Math.max(selectedEpoch, 1)
      );

      const callsPremiumCostsPromises = [];
      const putsPremiumCostsPromises = [];
      const callsFeesPromises = [];
      const putsFeesPromises = [];
      const totalStrikesDataPromises = [];
      const curveLpPrice = await rateVaultContract['getLpPrice']();
      const rate = await getCurrentRate();
      const volatilitiesPromises = [];

      for (let i in epochStrikes) {
        const epochStrike = epochStrikes[i] ?? BigNumber.from(0);
        const volatility = rateVaultContract['getVolatility'](epochStrike);
        const callsPremium = calculatePremium(epochStrike, false);
        const putsPremium = calculatePremium(epochStrike, true);

        const callsPurchaseFee = rateVaultContract['calculatePurchaseFees'](
          rate,
          epochStrike,
          BigNumber.from('1000000000000000000'),
          false
        );

        const putsPurchaseFee = rateVaultContract['calculatePurchaseFees'](
          rate,
          epochStrike,
          BigNumber.from('1000000000000000000'),
          true
        );

        const totalEpochStrikeData = rateVaultContract!['totalStrikeData'](
          Math.max(selectedEpoch || 0, 1),
          epochStrike
        );

        volatilitiesPromises.push(volatility);
        if (epochStrike) {
          callsPremiumCostsPromises.push(callsPremium);
          putsPremiumCostsPromises.push(putsPremium);

          callsFeesPromises.push(callsPurchaseFee);
          putsFeesPromises.push(putsPurchaseFee);
          totalStrikesDataPromises.push(totalEpochStrikeData);
        }
      }

      const volatilities = await Promise.all(volatilitiesPromises);
      const totalStrikesData = await Promise.all(totalStrikesDataPromises);
      const callsPremiumCosts = await Promise.all(callsPremiumCostsPromises);
      const putsPremiumCosts = await Promise.all(putsPremiumCostsPromises);
      const callsFees = await Promise.all(callsFeesPromises);
      const putsFees = await Promise.all(putsFeesPromises);

      const callsLeverages = promises[2][0];
      const putsLeverages = promises[2][1];

      let totalCallsPremiums = BigNumber.from('0');
      let totalPutsPremiums = BigNumber.from('0');

      for (let i in promises[3][0]) {
        totalCallsPremiums = totalCallsPremiums.add(
          promises[3][0][i] || BigNumber.from('0')
        );
        totalPutsPremiums = totalPutsPremiums.add(
          promises[3][1][i] || BigNumber.from('0')
        );
      }

      const callsCosts: BigNumber[] = [];
      const putsCosts: BigNumber[] = [];
      const callsDeposits: BigNumber[] = [];
      const putsDeposits: BigNumber[] = [];

      for (let i in callsPremiumCosts) {
        callsCosts.push(
          callsPremiumCosts[i]!.add(callsFees[i] || BigNumber.from('0'))
        );
        putsCosts.push(
          putsPremiumCosts[i]!.add(putsFees[i] || BigNumber.from('0'))
        );

        callsDeposits.push(totalStrikesData[i]![1]);
        putsDeposits.push(totalStrikesData[i]![2]);
      }

      const _rateVaultEpochData = {
        volatilities: volatilities,
        callsFees: callsFees,
        putsFees: putsFees,
        callsPremiumCosts: callsPremiumCosts,
        putsPremiumCosts: putsPremiumCosts,
        lpPrice: lpPrice,
        callsCosts: callsCosts,
        putsCosts: putsCosts,
        totalCallsPremiums: totalCallsPremiums,
        totalPutsPremiums: totalPutsPremiums,
        callsDeposits: callsDeposits,
        putsDeposits: putsDeposits,
        totalCallsPurchased: BigNumber.from('0'),
        totalPutsPurchased: BigNumber.from('0'),
        totalCallsDeposits: promises[1][0],
        totalPutsDeposits: promises[1][1],
        totalTokenDeposits: promises[1][2],
        epochCallsPremium: promises[1][5],
        epochPutsPremium: promises[1][6],
        epochStartTimes: promises[1][7],
        epochEndTimes: epochTimes[1],
        epochTimes: epochTimes,
        isEpochExpired: promises[1][9],
        isVaultReady: promises[1][10],
        epochBalanceAfterUnstaking: promises[1][8],
        crvToDistribute: promises[1][11],
        rateAtSettlement: promises[1][12],
        epochStrikes: epochStrikes,
        callsLeverages: callsLeverages,
        putsLeverages: putsLeverages,
        callsToken: epochCallsStrikeTokens,
        isBootstrapped: epochCallsStrikeTokens.length > 0,
        putsToken: epochPutsStrikeTokens,
        epochStrikeCallsPremium: promises[3][0],
        epochStrikePutsPremium: promises[3][1],
        curveLpPrice: curveLpPrice,
        rate: rate,
      };

      set((prevState) => ({
        ...prevState,
        rateVaultEpochData: {
          ...prevState.rateVaultEpochData,
          ..._rateVaultEpochData,
        },
      }));
    } catch (err) {
      console.log(err);
      const epochTimes = await rateVaultContract!['getEpochTimes'](
        Math.max(selectedEpoch, 1)
      );
      const curveLpPrice = await rateVaultContract!['getLpPrice']();
      const rate = BigNumber.from('100000000');
      set((prevState) => ({
        ...prevState,
        rateVaultEpochData: {
          ...prevState.rateVaultEpochData,
          volatilities: [],
          callsFees: [],
          putsFees: [],
          callsPremiumCosts: [],
          putsPremiumCosts: [],
          lpPrice: lpPrice,
          callsCosts: [],
          putsCosts: [],
          totalCallsPremiums: BigNumber.from('0'),
          totalPutsPremiums: BigNumber.from('0'),
          callsDeposits: [],
          putsDeposits: [],
          totalCallsPurchased: BigNumber.from('0'),
          totalPutsPurchased: BigNumber.from('0'),
          totalCallsDeposits: BigNumber.from('0'),
          totalPutsDeposits: BigNumber.from('0'),
          totalTokenDeposits: BigNumber.from('0'),
          epochCallsPremium: BigNumber.from('0'),
          epochPutsPremium: BigNumber.from('0'),
          epochStartTimes: epochTimes[0],
          epochEndTimes: epochTimes[1],
          epochTimes: epochTimes,
          isEpochExpired: true,
          isVaultReady: false,
          epochBalanceAfterUnstaking: BigNumber.from('0'),
          crvToDistribute: BigNumber.from('0'),
          rateAtSettlement: BigNumber.from('0'),
          epochStrikes: [
            BigNumber.from('0'),
            BigNumber.from('0'),
            BigNumber.from('0'),
            BigNumber.from('0'),
          ],
          callsLeverages: [],
          putsLeverages: [],
          callsToken: [],
          putsToken: [],
          isBootstrapped: false,
          epochStrikeCallsPremium: [
            BigNumber.from('0'),
            BigNumber.from('0'),
            BigNumber.from('0'),
            BigNumber.from('0'),
          ],
          epochStrikePutsPremium: [
            BigNumber.from('0'),
            BigNumber.from('0'),
            BigNumber.from('0'),
            BigNumber.from('0'),
          ],
          curveLpPrice: curveLpPrice,
          rate: rate,
        },
      }));
    }
  },
  updateRateVaultUserData: async () => {
    const {
      contractAddresses,
      accountAddress,
      rateVaultEpochData,
      selectedPoolName,
      getUserStrikePurchaseData,
      getUserStrikeDeposits,
    } = get();

    if (
      !contractAddresses ||
      !accountAddress ||
      !rateVaultEpochData?.epochStrikes ||
      !selectedPoolName
    )
      return;

    set((prevState) => ({ ...prevState, isLoading: true }));

    const userEpochStrikeDeposits: any[] = [];
    const userStrikePurchaseData: any[] = [];
    const userStrikePurchaseDataPromises: any[] = [];

    for (let i in rateVaultEpochData.callsLeverages) {
      for (let j in rateVaultEpochData.putsLeverages) {
        const userEpochStrikeDepositsPromises: any[] = [];

        rateVaultEpochData.epochStrikes.map((strike, strikeIndex) => {
          userEpochStrikeDepositsPromises.push(
            getUserStrikeDeposits(
              strike,
              strikeIndex,
              rateVaultEpochData.callsLeverages[i],
              rateVaultEpochData.putsLeverages[j]
            )
          );
        });

        const _userEpochStrikeDeposits = await Promise.all(
          userEpochStrikeDepositsPromises
        );

        _userEpochStrikeDeposits.map((record) => {
          userEpochStrikeDeposits.push({
            amount: record['deposits'][0],
            callLeverage: rateVaultEpochData.callsLeverages[i]!,
            putLeverage: rateVaultEpochData.putsLeverages[j]!,
            callLeverageIndex: Number(i),
            putLeverageIndex: Number(j),
            strike: BigNumber.from(record.strike),
            strikeIndex: Number(record.strikeIndex),
          });
        });
      }
    }

    rateVaultEpochData.epochStrikes.map((strike, strikeIndex) => {
      userStrikePurchaseDataPromises.push(
        getUserStrikePurchaseData(strike, strikeIndex)
      );
    });

    const _userStrikePurchaseData = await Promise.all(
      userStrikePurchaseDataPromises
    );

    _userStrikePurchaseData.map((record) => {
      userStrikePurchaseData.push({
        callsPurchased: record.purchase.callsPurchased,
        putsPurchased: record.purchase.putsPurchased,
        strike: record.strike,
        strikeIndex: record.strikeIndex,
      });
    });

    set((prevState) => ({
      ...prevState,
      rateVaultUserData: {
        userEpochStrikeDeposits,
        userStrikePurchaseData,
      },
      isLoading: false,
    }));
  },
  getRateVaultContract: () => {
    const { contractAddresses, selectedPoolName, provider } = get();

    if (!provider || !selectedPoolName) return;

    return RateVault__factory.connect(
      contractAddresses['RATE-VAULTS'][selectedPoolName],
      provider
    );
  },
  getUserStrikePurchaseData: async (strike: BigNumber, strikeIndex: number) => {
    const { accountAddress, selectedEpoch, rateVaultData } = get();

    const identifier = ethers.utils.solidityKeccak256(
      ['address', 'uint256'],
      [accountAddress, strike]
    );

    return {
      purchase: await rateVaultData?.rateVaultContract![
        'userStrikePurchaseData'
      ](Math.max(selectedEpoch || 0, 1), identifier),
      strike: strike,
      strikeIndex: strikeIndex,
    };
  },
  updateRateVault: async () => {
    const { getRateVaultContract } = get();

    const rateVaultContract: RateVault = getRateVaultContract();

    let currentEpoch: number;
    let isCurrentEpochExpired: boolean;

    try {
      currentEpoch = (await rateVaultContract.currentEpoch()).toNumber();

      const totalEpochData = await rateVaultContract.totalEpochData(
        currentEpoch
      );

      isCurrentEpochExpired = totalEpochData[9];
    } catch (err) {
      return;
    }

    set((prevState) => ({
      ...prevState,
      rateVaultData: {
        ...prevState.rateVaultData,
        currentEpoch: Number(currentEpoch),
        rateVaultContract,
        isCurrentEpochExpired,
      },
    }));
  },
  getUserStrikeDeposits: async (
    strike: BigNumber,
    strikeIndex: number,
    callLeverage: any,
    putLeverage: any
  ) => {
    const { accountAddress, selectedEpoch, rateVaultData } = get();

    const rateVaultContract = rateVaultData?.rateVaultContract;

    const identifier = ethers.utils.solidityKeccak256(
      ['address', 'uint256', 'uint256', 'uint256'],
      [accountAddress, strike, callLeverage, putLeverage]
    );

    return {
      strike: strike,
      strikeIndex: strikeIndex,
      deposits: await rateVaultContract!['userEpochStrikeDeposits'](
        selectedEpoch,
        identifier
      ),
    };
  },
  getCurrentRate: async () => {
    const { getRateVaultContract, getGaugeOracle } = get();

    const rateVaultContract = getRateVaultContract();
    const gaugeOracle = getGaugeOracle();

    try {
      return await rateVaultContract!['getCurrentRate']();
    } catch (err) {
      try {
        const endTime = Math.floor(new Date().getTime() / 1000);
        const startTime = endTime - 24 * 3600;
        return await gaugeOracle!['getRate'](
          startTime,
          endTime,
          '0xd8b712d29381748dB89c36BCa0138d7c75866ddF'
        );
      } catch (err) {
        return BigNumber.from('0');
      }
    }
  },
  getGaugeOracle: async () => {
    const { provider, contractAddresses } = get();
    if (!provider) return;
    else
      return CurveGaugesOracle__factory.connect(
        contractAddresses['CurveGaugesOracle'],
        provider
      );
  },
  calculatePremium: async (strike: BigNumber, isPut: boolean) => {
    const { getRateVaultContract } = get();
    const rateVaultContract = getRateVaultContract();

    try {
      return await rateVaultContract!['calculatePremium'](
        strike,
        BigNumber.from('1000000000000000000'),
        isPut
      );
    } catch (err) {
      return BigNumber.from('0');
    }
  },
});
