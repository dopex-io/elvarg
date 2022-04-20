import {
  createContext,
  useEffect,
  useState,
  useContext,
  useCallback,
} from 'react';
import {
  OptionPool,
  ERC20,
  VolumePool,
  VolumePool__factory,
  OptionPoolFactory__factory,
  ERC20__factory,
  Dopex__factory,
  Margin__factory,
} from '@dopex-io/sdk';
import { ethers, BigNumber } from 'ethers';

import getAssetMapWithAddress from 'utils/general/getAssetMapWithAddress';

import { AssetsContext } from '../../src/contexts/Assets';
import { WalletContext } from '../../src/contexts/Wallet';

import { TimePeriodEnum } from 'types';
import getOptionPoolId from 'utils/contracts/getOptionPoolId';

const TIME_PERIODS: {
  WEEK: 'weekly';
  MONTH: 'monthly';
} = {
  WEEK: 'weekly',
  MONTH: 'monthly',
};

export interface BaseAssetsOptionPoolSdks {
  baseAsset: string;
  baseAssetContract: ERC20;
  baseAssetDecimals: number;
  optionPoolSdk: OptionPool;
}

interface BaseAssetsOptionPoolTotalData {
  basePoolDeposits: string;
  quotePoolDeposits: string;
  totalBasePoolWithdrawalRequests: string;
  totalQuotePoolWithdrawalRequests: string;
}

interface BaseAssetsOptionPoolUserData {
  totalUserBasePoolDepositsForEpoch: string;
  totalUserQuotePoolDepositsForEpoch: string;
  userBaseWithdrawalRequests: string;
  userQuoteWithdrawalRequests: string;
}

export type BaseAssetsOptionPoolData = BaseAssetsOptionPoolTotalData &
  BaseAssetsOptionPoolUserData;

interface VolumePoolState {
  totalVolumePoolDeposits: string;
  volumePoolDiscount: string;
  userVolumePoolDeposits: string;
}

interface MarginPoolState {
  marginPoolSupplyRate: string;
  userMarginPoolDeposits: string;
  totalMarginPoolDeposits: string;
}

type PoolsContextInterface = VolumePoolState &
  MarginPoolState & {
    volumePoolSdk?: VolumePool;
    currentEpoch?: number;
    selectedEpoch?: number;
    timePeriod?: TimePeriodEnum;
    epochInitTime?: number;
    setSelectedEpoch?: Function;
    setTimePeriod?: Function;
    updateOptionPoolsData?: Function;
    updateMarginPoolData?: Function;
    updateVolumePoolData?: Function;
    baseAssetsOptionPoolSdks: BaseAssetsOptionPoolSdks[];
    baseAssetsOptionPoolData: BaseAssetsOptionPoolData[];
  };

const initialData: PoolsContextInterface = {
  baseAssetsOptionPoolSdks: [],
  baseAssetsOptionPoolData: [],
  totalVolumePoolDeposits: '0',
  volumePoolDiscount: '0',
  userVolumePoolDeposits: '0',
  marginPoolSupplyRate: '0',
  userMarginPoolDeposits: '0',
  totalMarginPoolDeposits: '0',
};

export const PoolsContext = createContext<PoolsContextInterface>(initialData);

export const PoolsProvider = (props) => {
  const { accountAddress, provider, contractAddresses } =
    useContext(WalletContext);
  const { baseAssets } = useContext(AssetsContext);
  const [volumePoolSdk, setVolumePoolSdk] = useState<VolumePool>();
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [selectedEpoch, setSelectedEpoch] = useState(0);
  const [timePeriod, setTimePeriod] = useState(TimePeriodEnum.Week);
  const [volumePoolState, setVolumePoolState] = useState<VolumePoolState>({
    totalVolumePoolDeposits: '0',
    volumePoolDiscount: '0',
    userVolumePoolDeposits: '0',
  });
  const [marginPoolState, setMarginPoolState] = useState<MarginPoolState>({
    marginPoolSupplyRate: '0',
    userMarginPoolDeposits: '0',
    totalMarginPoolDeposits: '0',
  });
  const [baseAssetsOptionPoolSdks, setBaseAssetsOptionPoolSdks] = useState<
    BaseAssetsOptionPoolSdks[]
  >([]);
  const [baseAssetsOptionPoolData, setBaseAssetsOptionPoolData] = useState<
    BaseAssetsOptionPoolData[]
  >([]);
  const [epochInitTime, setEpochInitTime] = useState(0);

  const updateUserVolumePoolData = useCallback(async () => {
    if (!volumePoolSdk || !accountAddress) return;

    let userVolumePoolDeposits = await volumePoolSdk.userVolumePoolFunds(
      accountAddress,
      selectedEpoch
    );

    setVolumePoolState((prevState) => ({
      ...prevState,
      userVolumePoolDeposits: userVolumePoolDeposits.toString(),
    }));
  }, [volumePoolSdk, selectedEpoch, accountAddress]);

  const updateTotalVolumePoolData = useCallback(async () => {
    if (!volumePoolSdk) return;

    let [totalVolumePoolDeposits, volumePoolDiscount] = await Promise.all([
      volumePoolSdk.volumePoolFunds(selectedEpoch),
      volumePoolSdk.volumePoolDiscount(),
    ]);

    setVolumePoolState((prevState) => ({
      ...prevState,
      totalVolumePoolDeposits: totalVolumePoolDeposits.toString(),
      volumePoolDiscount: volumePoolDiscount.toString(),
    }));
  }, [volumePoolSdk, selectedEpoch]);

  const updateOptionPoolsData = useCallback(async () => {
    if (baseAssetsOptionPoolSdks.length === 0 || !accountAddress) return;

    const newBaseAssetsOptionPoolData: BaseAssetsOptionPoolData[] = [];
    for (const baseAsset of baseAssetsOptionPoolSdks) {
      const optionPoolContract = baseAsset.optionPoolSdk.contract;
      const [
        basePoolDeposits,
        quotePoolDeposits,
        totalBasePoolWithdrawalRequests,
        totalQuotePoolWithdrawalRequests,
      ] = await Promise.all([
        optionPoolContract.getTotalBasePoolDeposits(selectedEpoch),
        optionPoolContract.getTotalQuotePoolDeposits(selectedEpoch),
        optionPoolContract.totalBasePoolWithdrawalRequests(selectedEpoch),
        optionPoolContract.totalQuotePoolWithdrawalRequests(selectedEpoch),
      ]);
      const [
        totalUserBasePoolDepositsForEpoch,
        totalUserQuotePoolDepositsForEpoch,
        userBaseWithdrawalRequests,
        userQuoteWithdrawalRequests,
      ] = await Promise.all([
        optionPoolContract.getUserBasePoolDepositsUntilEpoch(
          accountAddress,
          selectedEpoch,
          false
        ),
        optionPoolContract.getUserQuotePoolDepositsUntilEpoch(
          accountAddress,
          selectedEpoch,
          false
        ),
        optionPoolContract.userBaseWithdrawalRequests(
          accountAddress,
          selectedEpoch
        ),
        optionPoolContract.userQuoteWithdrawalRequests(
          accountAddress,
          selectedEpoch
        ),
      ]);
      newBaseAssetsOptionPoolData.push({
        basePoolDeposits: basePoolDeposits.toString(),
        quotePoolDeposits: quotePoolDeposits.toString(),
        totalBasePoolWithdrawalRequests:
          totalBasePoolWithdrawalRequests.toString(),
        totalQuotePoolWithdrawalRequests:
          totalQuotePoolWithdrawalRequests.toString(),
        totalUserBasePoolDepositsForEpoch:
          totalUserBasePoolDepositsForEpoch.toString(),
        totalUserQuotePoolDepositsForEpoch:
          totalUserQuotePoolDepositsForEpoch.toString(),
        userBaseWithdrawalRequests: userBaseWithdrawalRequests.toString(),
        userQuoteWithdrawalRequests: userQuoteWithdrawalRequests.toString(),
      });
    }

    setBaseAssetsOptionPoolData((prevState) => {
      return baseAssetsOptionPoolSdks.map((_o, index) => {
        return { ...prevState[index], ...newBaseAssetsOptionPoolData[index] };
      });
    });
  }, [baseAssetsOptionPoolSdks, accountAddress, selectedEpoch]);

  const updateMarginPoolData = useCallback(async () => {
    if (!provider || !contractAddresses?.Margin) return;

    const margin = Margin__factory.connect(contractAddresses.Margin, provider);
    const [supplyRate, totalFunds, totalSupply] = await Promise.all([
      margin.supplyRate(),
      margin.totalFunds(),
      margin.totalSupply(),
    ]);
    let userMarginPoolDeposits = '0';
    if (accountAddress) {
      const balanceOf = await margin.balanceOf(accountAddress);
      const exchangeRate = totalSupply.eq(BigNumber.from(0))
        ? BigNumber.from(0)
        : totalFunds.mul(ethers.utils.parseEther('1')).div(totalSupply);
      userMarginPoolDeposits = exchangeRate
        .mul(balanceOf)
        .div(ethers.utils.parseEther('1'))
        .toString();
    }
    setMarginPoolState((prevState) => ({
      ...prevState,
      userMarginPoolDeposits,
      marginPoolSupplyRate: supplyRate.toString(),
      totalMarginPoolDeposits: totalFunds.toString(),
    }));
  }, [provider, contractAddresses, accountAddress]);

  useEffect(() => {
    if (!contractAddresses || !provider) return;
    setVolumePoolSdk(
      VolumePool__factory.connect(contractAddresses.VolumePool, provider)
    );
  }, [provider, contractAddresses]);

  useEffect(() => {
    if (!provider || !contractAddresses || baseAssets.length === 0) return;
    (async function () {
      const optionPoolFactory = OptionPoolFactory__factory.connect(
        contractAddresses.OptionPoolFactory,
        provider
      );

      const assetMap = getAssetMapWithAddress(contractAddresses);
      const quoteAssetAddress = assetMap['USDT'].address;
      const newBaseAssetsOptionPoolSdks: BaseAssetsOptionPoolSdks[] = [];
      for (const asset of baseAssets) {
        const baseAssetAddress = assetMap[asset].address;
        const baseAssetContract = ERC20__factory.connect(
          baseAssetAddress,
          provider
        );
        const baseAssetDecimals = await baseAssetContract.decimals();

        const optionPoolId = getOptionPoolId(
          baseAssetAddress,
          quoteAssetAddress,
          TIME_PERIODS[timePeriod]
        );

        const optionPoolAddress = await optionPoolFactory.optionPools(
          optionPoolId
        );

        newBaseAssetsOptionPoolSdks.push({
          baseAsset: asset,
          optionPoolSdk: new OptionPool(
            provider as ethers.providers.Web3Provider,
            optionPoolAddress
          ),
          baseAssetContract,
          baseAssetDecimals,
        });
      }
      setBaseAssetsOptionPoolSdks(newBaseAssetsOptionPoolSdks);
    })();
  }, [baseAssets, provider, timePeriod, contractAddresses]);

  useEffect(() => {
    if (!contractAddresses || !provider) return;
    (async function () {
      const dopex = Dopex__factory.connect(contractAddresses.Dopex, provider);

      const currentEpoch = await dopex.getCurrentGlobalWeeklyEpoch();
      setEpochInitTime((await dopex.epochInitTime()).toNumber());
      setCurrentEpoch(currentEpoch.toNumber());
      setSelectedEpoch(currentEpoch.toNumber() + 1);
    })();
  }, [contractAddresses, provider]);

  useEffect(() => {
    updateUserVolumePoolData();
  }, [updateUserVolumePoolData]);

  useEffect(() => {
    updateOptionPoolsData();
  }, [updateOptionPoolsData]);

  useEffect(() => {
    updateTotalVolumePoolData();
  }, [updateTotalVolumePoolData]);

  useEffect(() => {
    updateMarginPoolData();
  }, [updateMarginPoolData]);

  const contextValue = {
    volumePoolSdk,
    selectedEpoch,
    setSelectedEpoch,
    currentEpoch,
    timePeriod,
    setTimePeriod,
    baseAssetsOptionPoolSdks,
    baseAssetsOptionPoolData,
    updateOptionPoolsData,
    epochInitTime,
    updateVolumePoolData: () => {
      updateTotalVolumePoolData();
      updateUserVolumePoolData();
    },
    updateMarginPoolData,
    ...volumePoolState,
    ...marginPoolState,
  };

  return (
    <PoolsContext.Provider value={contextValue}>
      {props.children}
    </PoolsContext.Provider>
  );
};
