import { StateCreator } from 'zustand';
import {
  VolatilityOracle,
  SSOVOptionPricing,
  RateVault__factory,
  // CurveGaugesOracle__factory,
} from '@dopex-io/sdk';
import noop from 'lodash/noop';
import { BigNumber, ethers } from 'ethers';

import { WalletSlice } from 'store/Wallet';
import { CommonSlice } from 'store/Vault/common';

export interface RateVault {
  token?: string;
}

export interface RateVaultData {
  rateVaultContract: any;
  currentEpoch: number;
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
  rateVaultData?: RateVaultData | undefined;
  rateVaultEpochData?: RateVaultEpochData | undefined;
  rateVaultUserData?: RateVaultUserData | undefined;
  rateVaultContract: any;
  updateRateVaultContract: Function;
  updateRateVaultEpochData?: Function;
  updateRateVaultUserData?: Function;
  updateRateVault: Function;
  isLoading: boolean;
  getUserStrikePurchaseData: Function;
  getUserStrikeDeposits: Function;
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
  updateRateVaultEpochData: noop,
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
  isLoading: true,
  rateVaultContract: {},
  updateRateVaultContract: async () => {
    const { contractAddresses, selectedPoolName, signer } = get();

    console.log(
      'fire',
      selectedPoolName,
      contractAddresses['RATE-VAULTS'][selectedPoolName],
      signer
    );

    if (signer && selectedPoolName)
      set((prevState) => ({
        ...prevState,
        rateVaultContract: RateVault__factory.connect(
          contractAddresses['RATE-VAULTS'][selectedPoolName],
          signer
        ),
      }));
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
    const { updateRateVaultContract, rateVaultContract, selectedPoolName } =
      get();

    await updateRateVaultContract();

    let currentEpoch: number;

    console.log(rateVaultContract, selectedPoolName);

    try {
      currentEpoch = rateVaultContract!['currentEpoch']().toNumber();

      const totalEpochData = await rateVaultContract!['totalEpochData'](
        currentEpoch
      );
      const isEpochExpired = totalEpochData[9];
      if (isEpochExpired) currentEpoch += 1;
    } catch (err) {
      return;
    }

    set((prevState) => ({
      ...prevState,
      rateVaultData: {
        ...prevState.rateVaultData,
        currentEpoch: Number(currentEpoch),
        rateVaultContract,
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
});
