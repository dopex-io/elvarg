import {
  createContext,
  useEffect,
  useContext,
  useState,
  useCallback,
} from 'react';
import { BigNumber } from 'ethers';
import {
  AtlanticPutsPool__factory,
  AtlanticPutsPool,
  Addresses,
  // ERC20__factory,
} from '@dopex-io/sdk';

import { WalletContext } from './Wallet';

import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

export interface Atlantics {
  token?: string;
  type?: 'CALL' | 'PUT';
}

// All relevant getter functions in AtlanticPutsPool contract
// getLiquidityForStrike(strike, epoch)
// getCumulativeLiquidity(epoch)
// getUserMaxStrikeDeposits(user, maxStrike)
// getMaxStrike(maxStrike, epoch) // getter for maxStrikesData array in AtlanticPoolEpochData interface below
// getFundingRate()
// getUtilizationRate()
// getUserMaxStrikesCollaterals(user, epoch)
// getMaxStrikesCollateral(user, index, epoch)
// getMaxStrikeDeposits(epoch, maxStrike)

interface AtlanticPoolData {
  tickSize: BigNumber;
  unwindFeePercentage: BigNumber;
  fundingRate: BigNumber;
  gracePeriod: number;
  collateral: string; // base
  quoteAsset: string; // quote
  poolContract: string;
  expiryType: string;
  currentEpoch: number;
}

interface AtlanticPoolEpochData {
  epoch: number;
  isBootstrapped: boolean;
  isEpochExpired: boolean;
  epochTimes: { [key: string]: BigNumber };
  // epochStrikeToken: string;
  // totalEpochMaxStrikeDeposits: BigNumber[]; // req. totalEpochDeposits
  // totalEpochMaxStrikeActiveCollaterals: BigNumber[];
  maxStrikesData: {
    [key: string]: BigNumber; // Max strike -> max strike data
  }[];
}

interface UserPositionInterface {
  maxStrike: BigNumber;
  userDeposit: BigNumber;
  epoch: number;
  feeCollected: BigNumber;
}

interface UserAtlanticsData {
  userPositions: UserPositionInterface[];
}

interface MarketsDataInterface {
  tokenId: string;
  stats: { [key: string]: BigNumber };
  pools: {
    strategy: string; // Strategy
    underlying: string;
    isPut: boolean; // PUT / CALL
    epoch: BigNumber; //
    tvl: BigNumber;
    epochLength: 'daily' | 'weekly' | 'monthly'; // AP expiryType
  }[];
  // pools: AtlanticPoolData[];
}

// @ts-ignore TODO: Implement Strategy Contract
interface AtlanticStrategyInterface {
  [key: string]: string | BigNumber | boolean | number;
}

interface AtlanticsContextInterface {
  marketsData: MarketsDataInterface[];
  atlanticPoolData: AtlanticPoolData;
  atlanticPoolEpochData: AtlanticPoolEpochData;
  userAtlanticsData: UserAtlanticsData;
  selectedStrategy: string;
  setSelectedStrategy: (strategy: string) => void;
  selectedMarket: string;
  setSelectedMarket: (tokenId: string) => void;
  selectedEpoch: number;
  setSelectedEpoch: (epoch: number) => void;
  updateAtlanticPoolData: (poolId: string) => void;
}

const initialMarketsData: MarketsDataInterface[] = [];

const initialAtlanticPoolData = {
  tickSize: BigNumber.from(0),
  unwindFeePercentage: BigNumber.from(0),
  fundingRate: BigNumber.from(0),
  gracePeriod: 0,
  collateral: '',
  quoteAsset: '',
  poolContract: '0x0',
  expiryType: 'monthly',
  currentEpoch: 0,
};

const initialAtlanticPoolEpochData = {
  epoch: 0,
  pool: '',
  isBootstrapped: false,
  isEpochExpired: false,
  epochTimes: { startTime: BigNumber.from(0), expiryTime: BigNumber.from(0) },
  // epochStrikeToken: '',
  totalEpochMaxStrikeDeposits: [BigNumber.from(0)],
  expiryType: 'daily',
  maxStrikesData: [
    {
      strikePrice: BigNumber.from(0),
      liquidity: BigNumber.from(0),
      liquidityBalance: BigNumber.from(0),
      premiumCollected: BigNumber.from(0),
      fundingCollected: BigNumber.from(0),
      unwindFeesCollected: BigNumber.from(0),
      underlyingCollected: BigNumber.from(0),
    },
  ],
};

const initialUserAtlanticsData = {
  userPositions: [],
};

const initialAtlanticsData = {
  marketsData: initialMarketsData,
  atlanticPoolData: initialAtlanticPoolData,
  atlanticPoolEpochData: initialAtlanticPoolEpochData,
  userAtlanticsData: initialUserAtlanticsData,
  selectedMarket: '',
  selectedStrategy: '',
  setSelectedStrategy: () => {},
  setSelectedMarket: () => {},
  selectedEpoch: 0,
  setSelectedEpoch: () => {},
  updateAtlanticPoolData: () => {},
};

export const AtlanticsContext =
  createContext<AtlanticsContextInterface>(initialAtlanticsData);

export const AtlanticsProvider = (props: any) => {
  const { accountAddress, contractAddresses, chainId, provider /*, signer */ } =
    useContext(WalletContext);

  const [selectedEpoch, setSelectedEpoch] = useState<number>(0);

  // states
  const [marketsData, setMarketsData] = useState<MarketsDataInterface[]>([]);
  const [atlanticPoolData, setAtlanticPoolData] = useState<AtlanticPoolData>(
    initialAtlanticPoolData
  );
  const [atlanticPoolEpochData, setAtlanticPoolEpochData] =
    useState<AtlanticPoolEpochData>(initialAtlanticPoolEpochData);
  const [userAtlanticsData, setUserAtlanticsData] = useState<UserAtlanticsData>(
    initialUserAtlanticsData
  );
  const [selectedMarket, setSelectedMarket] = useState('');
  const [selectedStrategy, setSelectedStrategy] = useState('');

  // callbacks
  // Fetch from Dopex API (?)
  const updateMarketsData = useCallback(async () => {
    if (!provider || !accountAddress || !contractAddresses) return;

    // Mock Data
    const data = [
      {
        tokenId: 'ETH',
        stats: {
          tvl: getContractReadableAmount(102246, 18),
          volume: getContractReadableAmount(5453, 18),
        },
        pools: [
          {
            strategy: 'PERPETUALS',
            underlying: 'USDT',
            isPut: true,
            epoch: BigNumber.from(1),
            tvl: getContractReadableAmount(100023, 18),
            epochLength: 'weekly' as const,
          },
        ],
      },
    ];

    setMarketsData(data);
  }, [accountAddress, contractAddresses, provider]);

  const updateAtlanticPoolData = useCallback(
    async (poolId: string) => {
      if (
        !accountAddress ||
        !contractAddresses ||
        !provider ||
        !chainId ||
        !selectedStrategy ||
        !selectedMarket
      )
        return;

      console.log(1);

      console.log(Addresses, chainId, selectedStrategy, poolId);

      const poolAddress: string =
        Addresses[chainId]['atlantics'][selectedStrategy][poolId]['vault'] ??
        '';

      const atlantic: AtlanticPutsPool = AtlanticPutsPool__factory.connect(
        poolAddress,
        provider
      );
      const currentEpoch = await atlantic.currentEpoch();

      // const [
      //   userMaxStrikeCollaterals,
      //   epochStrikes,
      //   vaultEpochState,
      // ] = await Promise.all([
      //   atlantic.getUserMaxStrikesCollaterals(accountAddress, currentEpoch),
      //   atlantic.epochStrikesList(currentEpoch),
      //   atlantic.epochVaultStates(currentEpoch),
      // ]);

      const { baseFundingRate, expireDelayTolerance, tickSize, unwindFee } =
        await atlantic.vaultConfiguration();

      // const { quoteToken, baseToken } = await atlantic.addresses();

      // const [quoteAsset, collateral] = await Promise.all([
      //   ERC20__factory.connect(quoteToken, provider).symbol(),
      //   ERC20__factory.connect(baseToken, provider).symbol(),
      // ]);

      // console.log(quoteAsset, collateral);

      setSelectedEpoch(currentEpoch.toNumber()); // fetched from contract

      setAtlanticPoolData({
        tickSize,
        unwindFeePercentage: unwindFee,
        fundingRate: baseFundingRate,
        gracePeriod: getUserReadableAmount(expireDelayTolerance, 18),
        collateral: 'ETH', // base
        quoteAsset: 'USDT', // quote
        expiryType: 'weekly',
        poolContract: atlantic.address,
        currentEpoch: currentEpoch.toNumber(),
      });
    },
    [
      accountAddress,
      contractAddresses,
      provider,
      chainId,
      selectedStrategy,
      selectedMarket,
    ]
  );

  const updateAtlanticPoolEpochData = useCallback(
    async (epoch: number, poolId: string) => {
      if (
        !provider ||
        !contractAddresses ||
        selectedEpoch === 0 ||
        !marketsData
      )
        return;

      const poolAddress: string =
        Addresses[chainId]['atlantics'][selectedStrategy][
          'ETH-USDT-PUTS-weekly'
        ]['vault'] ?? '';

      const atlantic: AtlanticPutsPool = AtlanticPutsPool__factory.connect(
        poolAddress,
        provider
      );

      const {
        startTime,
        expiryTime,
        isVaultReady,
        isVaultExpired,
        totalEpochActiveCollateral,
        totalEpochUnlockedCollateral,
        settlementPrice,
      } = await atlantic.epochVaultStates(selectedEpoch);

      console.log(
        'totalEpochActiveCollateral, totalEpochUnlockedCollateral, settlementPrice',
        totalEpochActiveCollateral,
        totalEpochUnlockedCollateral,
        settlementPrice
      );

      setAtlanticPoolEpochData({
        epoch,
        isBootstrapped: isVaultReady,
        isEpochExpired: isVaultExpired,
        epochTimes: {
          startTime,
          expiryTime: expiryTime,
        },
        maxStrikesData: [
          {
            strikePrice: BigNumber.from(2000),
            liquidity: BigNumber.from(10000),
            liquidityBalance: BigNumber.from(1000),
            premiumCollected: BigNumber.from(60),
            fundingCollected: BigNumber.from(2),
            unwindFeesCollected: BigNumber.from(2),
            underlyingCollected: BigNumber.from(4),
          },
          {
            strikePrice: BigNumber.from(1750),
            liquidity: BigNumber.from(7000),
            liquidityBalance: BigNumber.from(1000),
            premiumCollected: BigNumber.from(30),
            fundingCollected: BigNumber.from(1),
            unwindFeesCollected: BigNumber.from(1),
            underlyingCollected: BigNumber.from(3),
          },
          {
            strikePrice: BigNumber.from(1500),
            liquidity: BigNumber.from(5000),
            liquidityBalance: BigNumber.from(1000),
            premiumCollected: BigNumber.from(1),
            fundingCollected: BigNumber.from(1),
            unwindFeesCollected: BigNumber.from(1),
            underlyingCollected: BigNumber.from(2),
          },
        ],
      });
    },
    [
      provider,
      contractAddresses,
      selectedEpoch,
      marketsData,
      chainId,
      selectedStrategy,
    ]
  );

  // User positions across all pools
  const updateUserAtlanticsData = useCallback(async () => {
    if (!accountAddress || !contractAddresses || !provider || !chainId) return;

    setUserAtlanticsData({
      userPositions: [
        {
          maxStrike: getContractReadableAmount(2000, 18),
          userDeposit: getContractReadableAmount(1200, 18),
          feeCollected: getContractReadableAmount(1, 18),
          epoch: 1,
        },
        {
          maxStrike: getContractReadableAmount(1750, 18),
          userDeposit: getContractReadableAmount(100, 18),
          feeCollected: getContractReadableAmount(0, 18),
          epoch: 1,
        },
      ],
    });
  }, [accountAddress, chainId, contractAddresses, provider]);

  // useEffects

  useEffect(() => {
    updateMarketsData();
  }, [updateMarketsData]);

  useEffect(() => {
    if (!provider || !contractAddresses || !selectedMarket) return;
    // updateAtlanticPoolData(selectedMarket);
    updateUserAtlanticsData();
  }, [
    // updateAtlanticPoolData,
    selectedMarket,
    provider,
    contractAddresses,
    updateUserAtlanticsData,
  ]);

  useEffect(() => {
    if (!selectedMarket) return;
    updateAtlanticPoolEpochData(selectedEpoch, selectedMarket);
  }, [selectedEpoch, selectedMarket, updateAtlanticPoolEpochData]);

  const contextValue = {
    atlanticsBool: true,
    marketsData,
    atlanticsObj: {},
    userAtlanticsData,
    atlanticPoolData,
    atlanticPoolEpochData,
    selectedStrategy,
    updateAtlanticPoolData,
    setSelectedStrategy,
    selectedMarket,
    setSelectedMarket,
    selectedEpoch,
    setSelectedEpoch,
  };

  return (
    <AtlanticsContext.Provider value={contextValue}>
      {props.children}
    </AtlanticsContext.Provider>
  );
};
