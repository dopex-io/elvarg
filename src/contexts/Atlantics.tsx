import {
  createContext,
  useEffect,
  useContext,
  useState,
  useCallback,
} from 'react';
import { BigNumber } from 'ethers';
import {
  ERC20,
  ERC20__factory,
  AtlanticCallsPool,
  AtlanticCallsPool__factory,
  AtlanticPutsPool,
  AtlanticPutsPool__factory,
} from '@dopex-io/sdk';

import getTokenDecimals from 'utils/general/getTokenDecimals';
import formatAmount from 'utils/general/formatAmount';
import oneEBigNumber from 'utils/math/oneEBigNumber';

import { WalletContext } from 'contexts/Wallet';

const tokenPrices = {
  WETH: 1800,
  USDT: 1,
};

interface IAtlanticPoolsInfo {
  [key: string]: {
    title: string;
    description: string;
  };
}

export const ATLANTIC_POOL_INFO: IAtlanticPoolsInfo = {
  CALLS: {
    title: 'ETH CALLS',
    description:
      'Deposit underlying into to vault to write OTM calls 33%+ OTM from spot price on bootstrap to earn premiums and fundings.',
  },
  PUTS: {
    title: 'ETH PUTS',
    description:
      'Deposit into max strikes to write options to write puts of a particular strike as well as strikes below and OTM to earn premium, fundings and underlying on unwinds of options',
  },
};

interface IVaultConfiguration {
  collateralUtilizationWeight: BigNumber;
  baseFundingRate: BigNumber;
  tickSize?: BigNumber;
  unwindFee?: BigNumber;
  expireDelayTolerance: BigNumber;
  strikeOffset?: BigNumber;
}

interface IVaultState {
  epoch: BigNumber | number;
  totalEpochUnlockedCollateral?: BigNumber;
  totalEpochActiveCollateral?: BigNumber;
  epochMaxStrikeRange?: BigNumber[];
  strike?: BigNumber;
  settlementPrice: BigNumber;
  expiryTime: BigNumber;
  startTime: BigNumber;
  isVaultReady: boolean;
  isVaultExpired: boolean;
}
export interface IAtlanticPoolCheckpoint {
  liquidity: BigNumber;
  liquidityBalance: BigNumber;
  unlockCollateral: BigNumber;
  activeCollateral: BigNumber;
  premiumCollected: BigNumber;
  fundingCollected: BigNumber;
  underlyingCollected?: BigNumber;
  premiumRatio: BigNumber;
  fundingRatio: BigNumber;
  underlyingRatio?: BigNumber;
}

interface IContracts {
  atlanticPool: AtlanticCallsPool | AtlanticPutsPool;
  quoteToken: ERC20;
  baseToken: ERC20;
}

// Interface for deposit type (Calls and puts pool)
interface IUserPosition {
  strike: number;
  timestamp: number;
  liquidity: BigNumber;
  premiumDistributionRatio: BigNumber;
  fundingDistributionRatio: BigNumber;
  underlyingDistributionRatio: BigNumber;
  depositor: string;
}

// interface UserPositionInterface {
//   maxStrike: BigNumber;
//   userDeposit: BigNumber;
//   epoch: number;
//   feeCollected: BigNumber;
// }

interface UserAtlanticsData {
  userPositions: IUserPosition[];
}

interface Stats {
  tvl: number;
  volume: number;
  poolsCount: number;
}

interface AtlanticsContextInterface {
  pools: Pool[];
  stats: Stats;
  getCallPool: (
    address: string,
    selectedEpoch: number,
    duration: string
  ) => Promise<IAtlanticPoolType> | {};
  getPutPool: (
    address: string,
    selectedEpoch: number,
    duration: string
  ) => Promise<IAtlanticPoolType> | {};
  getPool: (
    underlying: string,
    type: string,
    selectedEpoch: number,
    duration: string
  ) => Promise<IAtlanticPoolType> | {};
  selectedEpoch?: number | any;
  setSelectedEpoch?: any;
  selectedPool?: IAtlanticPoolType;
  setSelectedPool?: any;
  userPositions?: IUserPosition[];
  updateUserPositions?: any;
  getRevenueEarnedForCurrentPool?: any;
  revenue: { premium: BigNumber; funding: BigNumber; underlying: BigNumber }[];
}

export interface IAtlanticPoolType {
  asset: string;
  isPut: boolean;
  strikes: BigNumber | BigNumber[];
  data: IAtlanticPoolCheckpoint[] | IAtlanticPoolCheckpoint;
  state: IVaultState;
  config: IVaultConfiguration;
  contracts?: IContracts;
  tokens: {
    deposit: string;
    underlying: string;
  };
  tvl: number;
  volume: number;
  apy: string | string[];
  duration: string;
}

const atlanticPoolsZeroData: IAtlanticPoolType = {
  asset: 'Asset',
  isPut: false,
  duration: '',
  strikes: [BigNumber.from(0)],
  data: [
    {
      liquidity: BigNumber.from(0),
      liquidityBalance: BigNumber.from(0),
      unlockCollateral: BigNumber.from(0),
      activeCollateral: BigNumber.from(0),
      premiumCollected: BigNumber.from(0),
      fundingCollected: BigNumber.from(0),
      underlyingCollected: BigNumber.from(0),
      premiumRatio: BigNumber.from(0),
      fundingRatio: BigNumber.from(0),
      underlyingRatio: BigNumber.from(0),
    },
  ],
  state: {
    epoch: 0,
    totalEpochUnlockedCollateral: BigNumber.from(0),
    totalEpochActiveCollateral: BigNumber.from(0),
    epochMaxStrikeRange: [BigNumber.from(0), BigNumber.from(0)],
    strike: BigNumber.from(0),
    settlementPrice: BigNumber.from(0),
    expiryTime: BigNumber.from(0),
    startTime: BigNumber.from(0),
    isVaultReady: false,
    isVaultExpired: false,
  },
  config: {
    collateralUtilizationWeight: BigNumber.from(0),
    baseFundingRate: BigNumber.from(0),
    tickSize: BigNumber.from(0),
    unwindFee: BigNumber.from(0),
    expireDelayTolerance: BigNumber.from(0),
    strikeOffset: BigNumber.from(0),
  },

  tokens: {
    deposit: 'USDT',
    underlying: 'WETH',
  },
  tvl: 0,
  volume: 0,
  apy: '0',
};

const initialUserPositions: IUserPosition[] | [] = [];

const initialAtlanticsData = {
  pools: [],
  stats: {
    tvl: 0,
    volume: 0,
    poolsCount: 0,
  },
  getCallPool: () => ({}),
  getPutPool: () => ({}),
  getPool: () => ({}),
  userPositions: initialUserPositions,
  getRevenueEarnedForCurrentPool: null,
  revenue: [],
};

export const AtlanticsContext =
  createContext<AtlanticsContextInterface>(initialAtlanticsData);

export interface DurationTypesOfPools {
  daily?: IAtlanticPoolType | undefined;
  weekly?: IAtlanticPoolType | undefined;
  monthly?: IAtlanticPoolType | undefined;
}

interface Pool {
  asset: string;
  put: DurationTypesOfPools;
  call: DurationTypesOfPools;
}

export const AtlanticsProvider = (props: any) => {
  const { contractAddresses, signer, provider, accountAddress } =
    useContext(WalletContext);

  const [pools, setPools] = useState<Pool[]>([]);
  const [stats, setStats] = useState<Stats>({
    tvl: 0,
    volume: 0,
    poolsCount: 0,
  });
  const [selectedPool, _setSelectedPool] = useState<IAtlanticPoolType>(
    atlanticPoolsZeroData
  );
  const [userPositions, setUserPositions] =
    useState<IUserPosition[]>(initialUserPositions);
  const [revenue, setRevenue] = useState<any>();
  const [selectedEpoch, setSelectedEpoch] = useState<number>(1);

  // Fetches type IAtlanticPoolType for a pool
  const getPutPool = useCallback(
    async (
      address: string,
      selectedEpoch: number,
      duration: string
    ): Promise<IAtlanticPoolType | undefined> => {
      if (!address) return undefined;

      const atlanticPool = AtlanticPutsPool__factory.connect(address, provider);

      const latestCheckpoints: BigNumber[] =
        await atlanticPool.getEpochCurrentMaxStrikeCheckpoints(selectedEpoch);

      // Strikes
      const maxStrikes = await atlanticPool.getEpochMaxStrikes(selectedEpoch);

      const latestCheckpointsCalls = maxStrikes.map(
        async (maxStrike: BigNumber, index: number) => {
          const checkpoint = Number(latestCheckpoints[index]);
          return atlanticPool.checkpoints(selectedEpoch, maxStrike, checkpoint);
        }
      );

      const checkpoints = await Promise.all(latestCheckpointsCalls);
      let [{ baseToken, quoteToken }, state, config] = await Promise.all([
        atlanticPool.addresses(),
        atlanticPool.epochVaultStates(selectedEpoch),
        atlanticPool.vaultConfiguration(),
      ]);

      let data: IAtlanticPoolCheckpoint[] = [];
      // Saving checkpoints for all max strikes
      maxStrikes.map((_: any, index: number) => {
        // Caching to ensure types
        let checkpoint: IAtlanticPoolCheckpoint = {
          liquidity: checkpoints[index]?.liquidity ?? BigNumber.from(0),
          liquidityBalance:
            checkpoints[index]?.liquidityBalance ?? BigNumber.from(0),
          unlockCollateral:
            checkpoints[index]?.unlockedCollateral ?? BigNumber.from(0),
          activeCollateral:
            checkpoints[index]?.activeCollateral ?? BigNumber.from(0),
          premiumCollected:
            checkpoints[index]?.premiumCollected ?? BigNumber.from(0),
          fundingCollected:
            checkpoints[index]?.fundingCollected ?? BigNumber.from(0),
          underlyingCollected:
            checkpoints[index]?.underlyingCollected ?? BigNumber.from(0),
          premiumRatio:
            checkpoints[index]?.premiumDistributionRatio ?? BigNumber.from(0),
          fundingRatio:
            checkpoints[index]?.fundingDistributionRatio ?? BigNumber.from(0),
          underlyingRatio:
            checkpoints[index]?.underlyingDistributionRatio ??
            BigNumber.from(0),
        };
        // Pushing to array
        data = [...data, checkpoint];
      });

      const contracts: IContracts = {
        atlanticPool,
        baseToken: ERC20__factory.connect(baseToken, provider),
        quoteToken: ERC20__factory.connect(quoteToken, provider),
      };

      const underlying = await contracts?.baseToken?.symbol();
      const depositToken = await contracts.quoteToken.symbol();

      let _tvl: number = 0;
      let _volume: number = 0;
      let apy: string[] = [];
      // @ts-ignore
      const tokenPrice = tokenPrices[depositToken];
      const depositTokenDecimals = getTokenDecimals(depositToken, 1337);
      const timeFactor =
        365 - Number(state.expiryTime.sub(state.startTime)) / 86400;

      data.map((_data) => {
        // TVL
        _tvl =
          _tvl +
          (Number(_data.liquidity) / 10 ** depositTokenDecimals) * tokenPrice;
        // OPTION SELLING VOLUME
        _volume =
          _volume +
          (Number(_data.premiumCollected) / 10 ** depositTokenDecimals) *
            tokenPrice;
        // APY
        const earningsPerDeposit =
          Number(_data.premiumCollected.add(_data.fundingCollected)) /
          10 ** depositTokenDecimals /
          (Number(_data.liquidity) / 10 ** depositTokenDecimals);

        const _apy = formatAmount(earningsPerDeposit * timeFactor * 100, 3);
        apy = [...apy, _apy];
      });

      setStats(({ tvl, volume, poolsCount }) => ({
        tvl: tvl + _tvl,
        volume: volume + volume,
        poolsCount: poolsCount + 1,
      }));

      return {
        asset: underlying,
        isPut: true,
        strikes: maxStrikes,
        data,
        state: {
          ...state,
          epoch: selectedEpoch,
        },
        config,
        contracts,
        tokens: {
          deposit: depositToken,
          underlying: underlying,
        },
        tvl: _tvl,
        volume: _volume,
        apy: '0',
        duration,
      };
    },
    [provider]
  );

  const getCallPool = useCallback(
    async (
      address: string,
      selectedEpoch: number,
      duration: string
    ): Promise<IAtlanticPoolType | undefined> => {
      if (!address || !provider || !signer || !contractAddresses) return;

      const atlanticPool = AtlanticCallsPool__factory.connect(
        address,
        provider
      );
      // @ts-ignore
      const latestCheckpoint = await atlanticPool.checkpointsCount(
        selectedEpoch
      );

      const [state, config, checkpoint, { baseToken }] = await Promise.all([
        atlanticPool.epochVaultStates(selectedEpoch),
        atlanticPool.vaultConfiguration(),
        // @ts-ignore

        atlanticPool.checkpoints(selectedEpoch, latestCheckpoint),
        atlanticPool.addresses(),
      ]);

      const contracts: IContracts = {
        atlanticPool,
        quoteToken: ERC20__factory.connect(baseToken, signer),
        baseToken: ERC20__factory.connect(baseToken, signer),
      };

      const data: IAtlanticPoolCheckpoint = {
        liquidity: checkpoint.liquidity,
        liquidityBalance: checkpoint.liquidityBalance,
        unlockCollateral: checkpoint.unlockedCollateral,
        activeCollateral: checkpoint.activeCollateral,
        premiumCollected: checkpoint.premiumCollected,
        fundingCollected: checkpoint.fundingCollected,
        premiumRatio: checkpoint.premiumDistributionRatio,
        fundingRatio: checkpoint.fundingDistributionRatio,
      };
      const underlying = await contracts?.baseToken?.symbol();
      const tokenDecimals = getTokenDecimals(underlying, 1337);
      let apy;

      const earningsPerToken =
        Number(data.fundingCollected.add(data.premiumCollected)) /
        10 ** tokenDecimals /
        (Number(data.liquidity) / 10 ** tokenDecimals);
      const timeFactor =
        365 - Number(state.expiryTime.sub(state.startTime)) / 86400;

      apy = formatAmount(earningsPerToken * timeFactor * 100, 3);

      // @ts-ignore
      const tokenPrice = tokenPrices[underlying];
      const denominator = 10 ** tokenDecimals;
      const currentTvl = (Number(data.liquidity) / denominator) * tokenPrice;
      const currentVolume =
        (Number(data.premiumCollected) / denominator) * tokenPrice;

      setStats(({ tvl, volume, poolsCount }) => ({
        tvl: tvl + currentTvl,
        volume: volume + currentVolume,
        poolsCount: poolsCount + 1,
      }));

      return {
        asset: underlying,
        isPut: false,
        // @ts-ignore
        strikes: state.strike,
        state: { ...state, epoch: selectedEpoch },
        data,
        config,
        contracts,
        tokens: {
          deposit: underlying,
          underlying: underlying,
        },
        tvl: currentTvl,
        volume: currentVolume,
        apy,
        duration,
      };
    },
    [contractAddresses, provider, signer]
  );

  const updatePools = useCallback(async () => {
    if (!contractAddresses || !provider) return;

    Object.keys(contractAddresses['ATLANTIC-POOLS']).map(
      async (asset: string) => {
        const currentPool: Pool = {
          asset,
          put: {
            daily: await getPutPool(
              contractAddresses['ATLANTIC-POOLS'][asset]['PUTS'].DAILY,
              selectedEpoch,
              'DAILY'
            ),
            weekly: await getPutPool(
              contractAddresses['ATLANTIC-POOLS'][asset]['PUTS'].WEEKLY,
              selectedEpoch,
              'WEEKLY'
            ),
            monthly: await getPutPool(
              contractAddresses['ATLANTIC-POOLS'][asset]['PUTS'].MONTHLY,
              selectedEpoch,
              'MONTHLY'
            ),
          },
          call: {
            daily: await getCallPool(
              contractAddresses['ATLANTIC-POOLS'][asset]['CALLS'].DAILY,
              selectedEpoch,
              'DAILY'
            ),
            weekly: await getCallPool(
              contractAddresses['ATLANTIC-POOLS'][asset]['CALLS'].WEEKLY,
              selectedEpoch,
              'WEEKLY'
            ),
            monthly: await getCallPool(
              contractAddresses['ATLANTIC-POOLS'][asset]['CALLS'].MONTHLY,
              selectedEpoch,
              'MONTHLY'
            ),
          },
        };

        setPools((prev) => [...prev, currentPool]);
      }
    );
  }, [contractAddresses, getCallPool, getPutPool, provider, selectedEpoch]);

  const getPool = useCallback(
    async (
      underlying: string,
      type: string,
      selectedEpoch: number,
      duration: string
    ): Promise<IAtlanticPoolType | undefined> => {
      const poolAddress =
        contractAddresses['ATLANTIC-POOLS'][underlying][type][duration];

      if (type === 'CALLS') {
        return await getCallPool(poolAddress, selectedEpoch, duration);
      } else if (type === 'PUTS') {
        return await getPutPool(poolAddress, selectedEpoch, duration);
      } else {
        return undefined;
      }
    },
    [contractAddresses, getCallPool, getPutPool]
  );

  const updateUserPositions = useCallback(async () => {
    if (
      !signer ||
      !provider ||
      !contractAddresses ||
      !accountAddress ||
      !selectedPool
    )
      return;

    const pool = selectedPool;
    const poolType = pool.isPut ? 'PUTS' : 'CALLS';
    if (
      !contractAddresses['ATLANTIC-POOLS'][pool.tokens.underlying][poolType][
        pool.duration
      ]
    )
      return;
    const atlanticPool = AtlanticPutsPool__factory.connect(
      contractAddresses['ATLANTIC-POOLS'][pool.tokens.underlying][poolType][
        pool.duration
      ],
      signer
    );

    const poolDeposits = await atlanticPool.getEpochDeposits(selectedEpoch);

    const userDeposits = poolDeposits.filter(
      (deposit) => deposit.depositor === accountAddress
    );

    const _userDeposits = userDeposits.map((deposit) => ({
      strike: deposit.strike.toNumber() / 1e8,
      timestamp: deposit.timestamp.toNumber(),
      liquidity: deposit.liquidity,
      premiumDistributionRatio: deposit.premiumDistributionRatio,
      fundingDistributionRatio: deposit.fundingDistributionRatio,
      underlyingDistributionRatio: deposit.underlyingDistributionRatio,
      depositor: deposit.depositor,
    }));

    setUserPositions(_userDeposits);
  }, [
    accountAddress,
    contractAddresses,
    provider,
    selectedEpoch,
    signer,
    selectedPool,
  ]);

  const getRevenueEarnedForCurrentPool = useCallback(async () => {
    if (!selectedPool || !accountAddress || !userPositions) return;
    let revenue: any[] = [];

    userPositions.map(async (position) => {
      if (selectedPool.isPut) {
        const latestRatios =
          // @ts-ignore
          await selectedPool.contracts?.atlanticPool.onUpdateCheckpoint(
            selectedEpoch,
            position.strike * 1e8
          );

        let premium = Number(
          latestRatios?.newPremiumRatio
            ?.sub(position.premiumDistributionRatio)
            .mul(position.liquidity)
            .div(oneEBigNumber(18))
        );

        let funding = Number(
          latestRatios?.newFundingRatio
            ?.sub(position.fundingDistributionRatio)
            .mul(position.liquidity)
            .div(oneEBigNumber(18))
        );

        let underlying = Number(
          latestRatios?.newUnderlyingRatio
            ?.sub(position.fundingDistributionRatio)
            .mul(position.liquidity)
            .div(oneEBigNumber(18))
        );

        setRevenue((prev: any) => [...prev, { premium, funding, underlying }]);
      } else {
        const latestRatios =
          // @ts-ignore
          await selectedPool.contracts?.atlanticPool.onUpdateCheckpoint(
            selectedEpoch,
            position.strike * 1e8
          );

        let premium = Number(
          latestRatios?.newPremiumRatio
            ?.sub(position.premiumDistributionRatio)
            .mul(position.liquidity)
            .div(oneEBigNumber(18))
        );

        let funding = Number(
          latestRatios?.newFundingRatio
            ?.sub(position.fundingDistributionRatio)
            .mul(position.liquidity)
            .div(oneEBigNumber(18))
        );

        setRevenue((prev: any) => [
          ...prev,
          { premium, funding, underlying: 0 },
        ]);
      }
    });

    setRevenue(() => {
      return revenue;
    });
  }, [accountAddress, selectedPool, selectedEpoch, userPositions]);

  useEffect(() => {
    getRevenueEarnedForCurrentPool();
  }, [getRevenueEarnedForCurrentPool]);

  const setSelectedPool = useCallback(
    async (
      underlying: string,
      type: string,
      selectedEpoch: number,
      duration: string
    ) => {
      if (!contractAddresses || !provider) return;
      const pool = (await getPool(
        underlying,
        type,
        selectedEpoch,
        duration
      )) as IAtlanticPoolType;

      _setSelectedPool(pool);
    },
    [contractAddresses, getPool, provider]
  );

  useEffect(() => {
    if (selectedPool?.asset !== 'Asset') {
      updateUserPositions();
    }
  }, [updateUserPositions, selectedPool]);

  useEffect(() => {
    updatePools();
  }, [updatePools]);

  const contextValue = {
    pools,
    stats,
    getCallPool,
    getPutPool,
    getPool,
    selectedPool,
    setSelectedPool,
    userPositions,
    updateUserPositions,
    selectedEpoch,
    setSelectedEpoch,
    getRevenueEarnedForCurrentPool,
    revenue,
  };

  return (
    <AtlanticsContext.Provider value={contextValue}>
      {props.children}
    </AtlanticsContext.Provider>
  );
};
