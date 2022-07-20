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
import { VolatilityOracle, SSOVOptionPricing } from '@dopex-io/sdk';

import { BigNumber, ethers } from 'ethers';

import { WalletContext } from './Wallet';

const ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_usd',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_underlying',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_priceOracle',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_volatilityOracle',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_optionPricing',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_straddlePositionMinter',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_writePositionMinter',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_assetSwapper',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'epoch',
        type: 'uint256',
      },
    ],
    name: 'Bootstrap',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'epoch',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'rollover',
        type: 'bool',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'NewDeposit',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'straddleId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'cost',
        type: 'uint256',
      },
    ],
    name: 'Purchase',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'int256',
        name: 'pnl',
        type: 'int256',
      },
    ],
    name: 'Settle',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'rollover',
        type: 'bool',
      },
    ],
    name: 'ToggleRollover',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'int256',
        name: 'pnl',
        type: 'int256',
      },
    ],
    name: 'Withdraw',
    type: 'event',
  },
  {
    inputs: [],
    name: 'apFundingPercent',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'assetSwapper',
    outputs: [
      {
        internalType: 'contract AssetSwapper',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'expiry',
        type: 'uint256',
      },
    ],
    name: 'bootstrap',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bool',
        name: '_isPut',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: '_strike',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_expiry',
        type: 'uint256',
      },
    ],
    name: 'calculatePremium',
    outputs: [
      {
        internalType: 'uint256',
        name: 'premium',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'callOtmPercent',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'currentEpoch',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'rollover',
        type: 'bool',
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'deposit',
    outputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'epochCollectionsData',
    outputs: [
      {
        internalType: 'uint256',
        name: 'usdPremiums',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'usdFunding',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'epochData',
    outputs: [
      {
        internalType: 'uint256',
        name: 'startTime',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'expiry',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'usdDeposits',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'activeUsdDeposits',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'settlementPrice',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'underlyingPurchased',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'expireDelayTolerance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'expireEpoch',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getUnderlyingPrice',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_strike',
        type: 'uint256',
      },
    ],
    name: 'getVolatility',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'isEpochExpired',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'isVaultReady',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'minStraddlePurchase',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'optionPricing',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'percentagePrecision',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'priceOracle',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'purchase',
    outputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'rollover',
    outputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'settle',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'straddlePositionMinter',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'straddlePositions',
    outputs: [
      {
        internalType: 'uint256',
        name: 'epoch',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'apStrike',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'exercised',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'toggleRollover',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'underlying',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'usd',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'volatilityOracle',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'writePositionMinter',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'writePositions',
    outputs: [
      {
        internalType: 'uint256',
        name: 'epoch',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'usdDeposit',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'rollover',
        type: 'bool',
      },
      {
        internalType: 'int256',
        name: 'pnl',
        type: 'int256',
      },
      {
        internalType: 'bool',
        name: 'withdrawn',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

export interface Straddles {
  token?: string;
}

export interface StraddlesData {
  straddlesContract: any;
  currentEpoch: number;
  straddlesOptionPricingContract?: SSOVOptionPricing;
  volatilityOracleContract?: VolatilityOracle;
}

export interface StraddlesEpochData {
  startTime: number;
  expiry: number;
  usdDeposits: number;
  activeUsdDeposits: number;
  strikes: number[];
  settlementPrice: number;
  underlyingPurchased: number;
}

export interface StraddlesUserData {}

interface StraddlesContextInterface {
  straddlesData?: StraddlesData;
  straddlesEpochData?: StraddlesEpochData;
  straddlesUserData?: StraddlesUserData;
  selectedPoolName?: string;
  selectedEpoch?: number;
  updateStraddlesEpochData?: Function;
  updateStraddlesUserData?: Function;
  setSelectedEpoch?: Function;
  setSelectedPoolName?: Function;
}

const initialStraddlesUserData = {};

export const StraddlesContext = createContext<StraddlesContextInterface>({
  straddlesUserData: initialStraddlesUserData,
});

export const Straddles = () => {
  const { accountAddress, contractAddresses, provider, signer } =
    useContext(WalletContext);

  const [selectedPoolName, setSelectedPoolName] = useState<string | null>(null);
  const [selectedEpoch, setSelectedEpoch] = useState<number | null>(1);
  const [straddlesData, setStraddlesData] = useState<StraddlesData>();
  const [straddlesEpochData, setStraddlesEpochData] =
    useState<StraddlesEpochData>();
  const [straddlesUserData, setStraddlesUserData] =
    useState<StraddlesUserData>();

  const straddlesContract = useMemo(() => {
    if (!selectedPoolName || !provider) return;
    else
      return new ethers.Contract(
        '0x0dcd1bf9a1b36ce34237eeafef220932846bcd82',
        ABI,
        provider
      );
  }, [provider, selectedPoolName]);

  const updateStraddlesUserData = useCallback(async () => {
    if (
      !contractAddresses ||
      !accountAddress ||
      !straddlesEpochData?.strikes ||
      !selectedPoolName
    )
      return;
  }, [
    accountAddress,
    contractAddresses,
    provider,
    selectedEpoch,
    straddlesEpochData,
    selectedPoolName,
  ]);

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
    [rateVaultContract, selectedEpoch, provider]
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
  }, [rateVaultContract]);

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
  }, [rateVaultContract, contractAddresses, selectedEpoch, provider]);

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
        console.log(err);
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
