import {
  createContext,
  useEffect,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactElement,
  ReactFragment,
  ReactPortal,
} from 'react';
import {
  VolatilityOracle,
  SSOVOptionPricing,
  RateVault__factory,
  CurveGaugesOracle__factory,
} from '@dopex-io/sdk';

import { BigNumber, ethers } from 'ethers';

import { WalletContext } from './Wallet';

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

interface RateVaultContextInterface {
  rateVaultData: RateVaultData;
  rateVaultEpochData: RateVaultEpochData;
  rateVaultUserData: RateVaultUserData;
  selectedPoolName: string;
  selectedEpoch: number;
  updateRateVaultEpochData: Function;
  updateRateVaultUserData: Function;
  setSelectedEpoch: Function;
  setSelectedPoolName: Function;
}

const initialRateVaultUserData = {
  totalUserCallsDeposits: BigNumber.from('0'),
  totalUserPutsDeposits: BigNumber.from('0'),
  userEpochStrikeDeposits: [],
  userStrikePurchaseData: [],
};

// @ts-ignore TODO: FIX
export const RateVaultContext = createContext<RateVaultContextInterface>({
  rateVaultUserData: initialRateVaultUserData,
});

export const RateVault = () => {
  const { accountAddress, contractAddresses, provider, signer } =
    useContext(WalletContext);

  const [selectedPoolName, setSelectedPoolName] = useState<string | null>(null);
  const [selectedEpoch, setSelectedEpoch] = useState<number | null>(1);
  const [rateVaultData, setRateVaultData] = useState<RateVaultData>();
  const [rateVaultEpochData, setRateVaultEpochData] =
    useState<RateVaultEpochData>();
  const [rateVaultUserData, setRateVaultUserData] =
    useState<RateVaultUserData>();
  const rateVaultContract = useMemo(() => {
    if (!selectedPoolName || !signer) return;
    else
      return RateVault__factory.connect(
        contractAddresses['RATE-VAULTS'][selectedPoolName],
        signer
      );
  }, [signer, selectedPoolName, contractAddresses]);

  const gaugeOracle = useMemo(() => {
    if (!provider) return;
    else
      return CurveGaugesOracle__factory.connect(
        contractAddresses['CurveGaugesOracle'],
        provider
      );
  }, [provider, contractAddresses]);

  const getUserStrikePurchaseData = useCallback(
    async (strike: BigNumber, strikeIndex: number) => {
      const identifier = ethers.utils.solidityKeccak256(
        ['address', 'uint256'],
        [accountAddress, strike]
      );

      return {
        purchase: await rateVaultContract!['userStrikePurchaseData'](
          Math.max(selectedEpoch || 0, 1),
          identifier
        ),
        strike: strike,
        strikeIndex: strikeIndex,
      };
    },
    [rateVaultContract, accountAddress, selectedEpoch]
  );

  const getUserStrikeDeposits = useCallback(
    async (
      strike: BigNumber,
      strikeIndex: number,
      callLeverage: any,
      putLeverage: any,
      isEpochExpired: boolean
    ) => {
      const identifier = ethers.utils.solidityKeccak256(
        ['address', 'uint256', 'uint256', 'uint256'],
        [accountAddress, strike, callLeverage, putLeverage]
      );

      return {
        strike: strike,
        strikeIndex: strikeIndex,
        deposits: await rateVaultContract!['userEpochStrikeDeposits'](
          Math.max(
            (isEpochExpired ? selectedEpoch! - 1 : selectedEpoch) || 0,
            1
          ),
          identifier
        ),
      };
    },
    [rateVaultContract, accountAddress, selectedEpoch]
  );

  const updateRateVaultUserData = useCallback(async () => {
    if (
      !contractAddresses ||
      !accountAddress ||
      !rateVaultEpochData?.epochStrikes ||
      !selectedPoolName
    )
      return;

    const userEpochStrikeDeposits: RateVaultUserData['userEpochStrikeDeposits'][] =
      [];
    const userStrikePurchaseData: RateVaultUserData['userStrikePurchaseData'][] =
      [];
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
              rateVaultEpochData.putsLeverages[j],
              rateVaultEpochData.isEpochExpired
            )
          );
        });

        const _userEpochStrikeDeposits = await Promise.all(
          userEpochStrikeDepositsPromises
        );

        _userEpochStrikeDeposits.map((record) => {
          userEpochStrikeDeposits.push({
            // @ts-ignore TODO: FIX
            amount: record.deposits.amount,
            callLeverage: rateVaultEpochData.callsLeverages[i],
            putLeverage: rateVaultEpochData.putsLeverages[j],
            callLeverageIndex: Number(i),
            putLeverageIndex: Number(j),
            strike: record.strike,
            strikeIndex: record.strikeIndex,
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
        // @ts-ignore TODO: FIX
        callsPurchased: record.purchase.callsPurchased,
        putsPurchased: record.purchase.putsPurchased,
        strike: record.strike,
        strikeIndex: record.strikeIndex,
      });
    });

    setRateVaultUserData({
      // @ts-ignore TODO: FIX
      userEpochStrikeDeposits: userEpochStrikeDeposits,
      // @ts-ignore TODO: FIX
      userStrikePurchaseData: userStrikePurchaseData,
    });
  }, [
    getUserStrikePurchaseData,
    getUserStrikeDeposits,
    accountAddress,
    contractAddresses,
    rateVaultEpochData,
    selectedPoolName,
  ]);

  const getEpochStrikes = useCallback(async () => {
    return await rateVaultContract!['getEpochStrikes'](
      Math.max(selectedEpoch || 0, 1)
    );
  }, [rateVaultContract, selectedEpoch]);

  const getEpochData = useCallback(async () => {
    try {
      return await rateVaultContract!['getEpochData'](
        Math.max(selectedEpoch || 0, 1)
      );
    } catch (err) {
      return [[], [], []];
    }
  }, [rateVaultContract, selectedEpoch]);

  const getTotalEpochData = useCallback(async () => {
    return await rateVaultContract!['totalEpochData'](
      Math.max(selectedEpoch || 0, 1)
    );
  }, [rateVaultContract, selectedEpoch]);

  const getEpochLeverages = useCallback(async () => {
    try {
      return await rateVaultContract!['getEpochLeverages'](
        Math.max(selectedEpoch || 0, 1)
      );
    } catch (err) {
      return [[], []];
    }
  }, [rateVaultContract, selectedEpoch]);

  const getEpochPremiums = useCallback(async () => {
    try {
      return await rateVaultContract!['getEpochPremiums'](
        Math.max(selectedEpoch || 0, 1)
      );
    } catch (err) {
      return [];
    }
  }, [rateVaultContract, selectedEpoch]);

  const getTotalStrikeData = useCallback(
    async (strike: BigNumber) => {
      try {
        return await rateVaultContract!['totalStrikeData'](
          Math.max(selectedEpoch || 0, 1),
          strike
        );
      } catch (err) {
        console.log(err);
        return [];
      }
    },
    [rateVaultContract, selectedEpoch]
  );

  const calculatePremium = useCallback(
    async (strike: BigNumber, isPut: boolean) => {
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
    [rateVaultContract]
  );

  const calculatePurchaseFee = useCallback(
    async (rate: BigNumber, strike: BigNumber, isPut: boolean) => {
      try {
        return await rateVaultContract!['calculatePurchaseFees'](
          rate,
          strike,
          BigNumber.from('1000000000000000000'),
          isPut
        );
      } catch (err) {
        return BigNumber.from('0');
      }
    },
    [rateVaultContract]
  );

  const getVolatility = useCallback(
    async (strike: BigNumber) => {
      try {
        return await rateVaultContract!['getVolatility'](strike);
      } catch (err) {
        return BigNumber.from('0');
      }
    },
    [rateVaultContract]
  );

  const getCurrentRate = useCallback(async () => {
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
  }, [rateVaultContract, gaugeOracle]);

  const updateRateVaultEpochData = useCallback(async () => {
    if (selectedEpoch === null || !selectedPoolName) return;
    const lpPrice = await rateVaultContract!['getLpPrice']();

    try {
      const promises = await Promise.all([
        getEpochData(),
        getTotalEpochData(),
        getEpochLeverages(),
        getEpochPremiums(),
        getEpochStrikes(),
      ]);

      const epochStrikes = promises[4];
      const epochCallsStrikeTokens = promises[0][1];
      const epochPutsStrikeTokens = promises[0][2];

      let epochTimes;

      epochTimes = await rateVaultContract!['getEpochTimes'](
        Math.max(selectedEpoch, 1)
      );

      const callsPremiumCostsPromises = [];
      const putsPremiumCostsPromises = [];
      const callsFeesPromises = [];
      const putsFeesPromises = [];
      const totalStrikesDataPromises = [];
      const curveLpPrice = await rateVaultContract!['getLpPrice']();
      const rate = await getCurrentRate();
      const volatilitiesPromises = [];

      for (let i in epochStrikes) {
        const epochStrike = epochStrikes[i];
        volatilitiesPromises.push(getVolatility(epochStrike!));
        if (epochStrike) {
          callsPremiumCostsPromises.push(calculatePremium(epochStrike, false));
          putsPremiumCostsPromises.push(calculatePremium(epochStrike, true));

          callsFeesPromises.push(
            calculatePurchaseFee(rate, epochStrike, false)
          );
          putsFeesPromises.push(calculatePurchaseFee(rate, epochStrike, true));
          totalStrikesDataPromises.push(getTotalStrikeData(epochStrike));
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

        // @ts-ignore
        callsDeposits.push(totalStrikesData[i]!.totalCallsStrikeDeposits);
        // @ts-ignore
        putsDeposits.push(totalStrikesData[i]!.totalPutsStrikeDeposits);
      }

      setRateVaultEpochData({
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
      });
    } catch (err) {
      console.log(err);
      const epochTimes = await rateVaultContract!['getEpochTimes'](
        Math.max(selectedEpoch, 1)
      );
      const curveLpPrice = await rateVaultContract!['getLpPrice']();
      const rate = BigNumber.from('100000000');
      setRateVaultEpochData({
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
      });
    }
  }, [
    rateVaultContract,
    selectedEpoch,
    calculatePremium,
    calculatePurchaseFee,
    getCurrentRate,
    getEpochData,
    getEpochLeverages,
    getEpochPremiums,
    getEpochStrikes,
    getTotalEpochData,
    getTotalStrikeData,
    getVolatility,
    selectedPoolName,
  ]);

  useEffect(() => {
    async function update() {
      let currentEpoch;

      try {
        currentEpoch = (await rateVaultContract!['currentEpoch']()).toNumber();

        const totalEpochData = await rateVaultContract!['totalEpochData'](
          currentEpoch
        );
        const isEpochExpired = totalEpochData[9];
        if (isEpochExpired) currentEpoch += 1;
      } catch (err) {
        return;
      }

      setSelectedEpoch(currentEpoch);

      setRateVaultData({
        currentEpoch: Number(currentEpoch),
        rateVaultContract: rateVaultContract,
      });
    }

    update();
  }, [contractAddresses, provider, selectedPoolName, rateVaultContract]);

  useEffect(() => {
    updateRateVaultUserData();
  }, [updateRateVaultUserData]);

  useEffect(() => {
    updateRateVaultEpochData();
  }, [updateRateVaultEpochData]);

  return {
    rateVaultData,
    rateVaultEpochData,
    rateVaultUserData,
    selectedEpoch,
    updateRateVaultEpochData,
    updateRateVaultUserData,
    setSelectedEpoch,
    setSelectedPoolName,
    selectedPoolName,
  };
};

export const RateVaultProvider = (props: {
  children:
    | string
    | number
    | boolean
    | ReactElement
    | ReactFragment
    | ReactPortal
    | null
    | undefined;
}) => {
  const contextValue = RateVault();

  return (
    // @ts-ignore TODO: FIX
    <RateVaultContext.Provider value={contextValue}>
      {props.children}
    </RateVaultContext.Provider>
  );
};
