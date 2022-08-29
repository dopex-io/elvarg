import {
  createContext,
  useEffect,
  useContext,
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react';
import { BigNumber } from 'ethers';
import {
  ERC20,
  ERC20__factory,
  AtlanticCallsPool,
  AtlanticCallsPool__factory,
  AtlanticPutsPool,
  AtlanticPutsPool__factory,
  AtlanticsViewer__factory,
} from '@dopex-io/sdk';

import { WalletContext } from 'contexts/Wallet';

import oneEBigNumber from 'utils/math/oneEBigNumber';

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

interface IEpochData {
  totalEpochLiquidity: BigNumber;
  totalEpochActiveCollateral: BigNumber;
  totalEpochUnlockedCollateral: BigNumber;
}

export interface IEpochStrikeData {
  // availableCollateral: BigNumber;
  unlocked: BigNumber;
  activeCollateral: BigNumber;
  strike: BigNumber;
  totalEpochMaxStrikeLiquidity: BigNumber;
}

interface IContracts {
  atlanticPool: AtlanticCallsPool | AtlanticPutsPool;
  quoteToken: ERC20;
  baseToken: ERC20;
}

// Interface for deposit type (Calls and puts pool)
export interface IUserPosition {
  strike?: BigNumber;
  timestamp: BigNumber;
  liquidity: BigNumber;
  checkpoint: BigNumber;
  depositor: string;
  premiumsEarned: BigNumber;
  fundingEarned: BigNumber;
  underlyingEarned?: BigNumber;
  apy: number;
}

interface Stats {
  // IMPORTANT: All in 1e6 decimals
  tvl: BigNumber;
  volume: BigNumber;
  poolsCount: BigNumber;
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
  selectedEpoch: number;
  setSelectedEpoch: Dispatch<SetStateAction<number>>;
  selectedPool: IAtlanticPoolType;
  setSelectedPool: Function;
  userPositions: IUserPosition[];
  updateUserPositions: Function;
}

export interface IAtlanticPoolType {
  asset: string;
  isPut: boolean;
  strikes: BigNumber | BigNumber[];
  epochData: IEpochData;
  epochStrikeData?: IEpochStrikeData[];
  state: IVaultState;
  config: IVaultConfiguration;
  contracts?: IContracts;
  tokens: { [key: string]: string };
  tvl: BigNumber;
  volume: BigNumber;
  apy: string | string[];
  duration: string;
  underlyingPrice: number;
  checkpoints: BigNumber[] | any[];
}

const atlanticPoolsZeroData: IAtlanticPoolType = {
  asset: 'Asset',
  isPut: false,
  duration: '',
  strikes: [BigNumber.from(0)],
  epochData: {
    totalEpochLiquidity: BigNumber.from(0),
    totalEpochActiveCollateral: BigNumber.from(0),
    totalEpochUnlockedCollateral: BigNumber.from(0),
  },
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
    deposit: 'USDC',
    underlying: 'WETH',
  },
  tvl: BigNumber.from(0),
  volume: BigNumber.from(0),
  apy: '0',
  underlyingPrice: 0,
  checkpoints: [BigNumber.from(0)],
};

const initialUserPositions: IUserPosition[] | [] = [];

const initialAtlanticsData = {
  pools: [],
  stats: {
    tvl: BigNumber.from(0),
    volume: BigNumber.from(0),
    poolsCount: BigNumber.from(0),
  },
  getCallPool: () => ({}),
  getPutPool: () => ({}),
  getPool: () => ({}),
  userPositions: initialUserPositions,
  selectedEpoch: 0,
  setSelectedEpoch: () => null,
  selectedPool: atlanticPoolsZeroData,
  setSelectedPool: () => null,
  updateUserPositions: Function,
};

export const AtlanticsContext =
  createContext<AtlanticsContextInterface>(initialAtlanticsData);

export interface DurationTypesOfPools {
  daily?: IAtlanticPoolType | undefined;
  weekly?: IAtlanticPoolType | undefined;
  monthly?: IAtlanticPoolType | undefined;
}

export interface Pool {
  asset: string;
  put: DurationTypesOfPools;
  call: DurationTypesOfPools;
}

export const AtlanticsProvider = (props: any) => {
  const { contractAddresses, signer, provider, accountAddress } =
    useContext(WalletContext);

  const [pools, setPools] = useState<Pool[]>([]);
  const [stats, setStats] = useState<Stats>({
    tvl: BigNumber.from(0),
    volume: BigNumber.from(0),
    poolsCount: BigNumber.from(0),
  });
  const [selectedPool, _setSelectedPool] = useState<IAtlanticPoolType>(
    atlanticPoolsZeroData
  );
  const [userPositions, setUserPositions] =
    useState<IUserPosition[]>(initialUserPositions);
  const [selectedEpoch, setSelectedEpoch] = useState<number>(1);

  // Fetches type IAtlanticPoolType for a pool
  const getPutPool = useCallback(
    async (
      address: string,
      epoch: number,
      duration: string
    ): Promise<IAtlanticPoolType | undefined> => {
      if (!address || !contractAddresses || !provider) return;

      const atlanticPool = AtlanticPutsPool__factory.connect(address, provider);

      // Strikes
      const maxStrikes: BigNumber[] = await atlanticPool.getEpochStrikes(epoch);

      const latestCheckpointsCalls = maxStrikes.map(
        async (maxStrike: BigNumber) => {
          return atlanticPool.getEpochCheckpoints(epoch, maxStrike);
        }
      );

      const checkpoints = await Promise.all(latestCheckpointsCalls);

      let [
        { baseToken, quoteToken },
        state,
        config,
        underlyingPrice,
        tickSize,
        unwindFeePercentage,
      ] = await Promise.all([
        atlanticPool.addresses(),
        atlanticPool.epochVaultStates(epoch),
        atlanticPool.vaultConfiguration(),
        atlanticPool.getUsdPrice(),
        atlanticPool.epochTickSize(epoch),
        atlanticPool.unwindFeePercentage(),
      ]);

      let data: IEpochData;

      if (!checkpoints) return;

      const [totalEpochActiveCollateral, totalEpochCumulativeLiquidity] =
        await Promise.all([
          atlanticPool.totalEpochActiveCollateral(epoch),
          atlanticPool.totalEpochCummulativeLiquidity(epoch),
        ]);

      let accumulator: IEpochData = {
        totalEpochActiveCollateral: BigNumber.from(0),
        totalEpochLiquidity: BigNumber.from(0),
        totalEpochUnlockedCollateral: BigNumber.from(0),
      };

      let epochStrikeData: IEpochStrikeData[] = [];

      for (let i = 0; i < maxStrikes.length; i++) {
        let [
          totalEpochMaxStrikeLiquidity,
          totalEpochMaxStrikeUnlockedCollateral,
          totalEpochMaxStrikeActiveCollateral,
        ] = await Promise.all([
          atlanticPool.totalEpochMaxStrikeLiquidity(
            epoch,
            maxStrikes[i] ?? BigNumber.from(0)
          ),
          atlanticPool.totalEpochMaxStrikeUnlockedCollateral(
            epoch,
            maxStrikes[i] ?? BigNumber.from(0)
          ),
          atlanticPool.totalEpochMaxStrikeActiveCollateral(
            epoch,
            maxStrikes[i] ?? BigNumber.from(0)
          ),
        ]);

        accumulator.totalEpochLiquidity = accumulator.totalEpochLiquidity.add(
          totalEpochMaxStrikeLiquidity
        );

        accumulator.totalEpochUnlockedCollateral =
          accumulator.totalEpochUnlockedCollateral.add(
            totalEpochMaxStrikeUnlockedCollateral
          );

        epochStrikeData.push({
          strike: maxStrikes[i] ?? BigNumber.from(0),
          totalEpochMaxStrikeLiquidity: totalEpochMaxStrikeLiquidity,
          unlocked: totalEpochMaxStrikeUnlockedCollateral,
          activeCollateral: totalEpochMaxStrikeActiveCollateral,
        });
      }

      data = accumulator; // *note: shallow copy

      const contracts: IContracts = {
        atlanticPool,
        baseToken: ERC20__factory.connect(baseToken, provider),
        quoteToken: ERC20__factory.connect(quoteToken, provider),
      };

      if (!contracts) return;
      const underlying = await contracts.baseToken.symbol();
      const depositToken = await contracts.quoteToken.symbol();

      setStats(({ tvl, volume, poolsCount }) => ({
        tvl: tvl.add(
          totalEpochCumulativeLiquidity.add(totalEpochActiveCollateral)
        ),
        volume: volume.add(totalEpochActiveCollateral),
        poolsCount: poolsCount.add(1),
      }));

      return {
        asset: underlying,
        isPut: true,
        strikes: maxStrikes,
        epochData: data,
        epochStrikeData,
        state: { ...state, epoch },
        config: {
          ...config,
          tickSize,
          unwindFee: unwindFeePercentage,
        },
        contracts,
        tokens: {
          deposit: depositToken,
          underlying: underlying,
        },
        tvl: totalEpochActiveCollateral.add(totalEpochCumulativeLiquidity),
        volume: totalEpochActiveCollateral,
        apy: ['0'],
        duration,
        underlyingPrice: Number(underlyingPrice.div(1e8)),
        checkpoints: checkpoints,
      };
    },
    [contractAddresses, provider]
  );

  const getCallPool = useCallback(
    async (
      address: string,
      epoch: number,
      duration: string
    ): Promise<IAtlanticPoolType | undefined> => {
      if (!address || !provider || !signer || !contractAddresses) return;

      const atlanticPool = AtlanticCallsPool__factory.connect(
        address,
        provider
      );

      const [
        state,
        config,
        { baseToken },
        underlyingPrice,
        totalLiquidity,
        unlockedCollateral,
        activeCollateral,
        strikes,
      ] = await Promise.all([
        atlanticPool.epochVaultStates(epoch),
        atlanticPool.vaultConfiguration(),
        atlanticPool.addresses(),
        atlanticPool.getUsdPrice(),
        atlanticPool.totalEpochDeposits(epoch),
        atlanticPool.totalEpochUnlockedCollateral(epoch),
        atlanticPool.totalEpochActiveCollateral(epoch),
        atlanticPool.getEpochStrikes(epoch),
      ]);

      const contracts: IContracts = {
        atlanticPool,
        quoteToken: ERC20__factory.connect(baseToken, signer),
        baseToken: ERC20__factory.connect(baseToken, signer),
      };

      const data: IEpochData = {
        totalEpochLiquidity: totalLiquidity,
        totalEpochActiveCollateral: unlockedCollateral,
        totalEpochUnlockedCollateral: activeCollateral,
      };

      const underlying = await contracts?.baseToken?.symbol();

      setStats(({ poolsCount, tvl, volume }) => ({
        poolsCount: poolsCount.add(1),
        tvl: tvl.add(
          totalLiquidity.mul(underlyingPrice).div(oneEBigNumber(20))
        ),
        volume: volume.add(
          activeCollateral.mul(underlyingPrice).div(oneEBigNumber(20))
        ),
      }));

      return {
        asset: underlying,
        isPut: false,
        strikes: strikes,
        state: { ...state, epoch },
        epochData: data,
        config,
        contracts,
        tokens: {
          deposit: underlying,
          underlying: underlying,
        },
        tvl: totalLiquidity.mul(underlyingPrice).div(oneEBigNumber(20)),
        volume: activeCollateral.mul(underlyingPrice).div(oneEBigNumber(20)),
        apy: ['0'],
        duration,
        underlyingPrice: Number(underlyingPrice.div(1e8)),
        checkpoints: [BigNumber.from(0)],
      };
    },
    [contractAddresses, provider, signer]
  );

  const updatePools = useCallback(async () => {
    if (!contractAddresses['ATLANTIC-POOLS'] || !provider || pools.length > 0)
      return;

    let pool: Pool;

    Object.keys(contractAddresses['ATLANTIC-POOLS']).map(
      async (asset: string) => {
        pool = {
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

        setPools([pool]);
      }
    );
  }, [
    contractAddresses,
    getCallPool,
    getPutPool,
    provider,
    selectedEpoch,
    pools.length,
  ]);

  const getPool = useCallback(
    async (
      underlying: string,
      type: string,
      selectedEpoch: number,
      duration: string
    ): Promise<IAtlanticPoolType | undefined> => {
      if (!contractAddresses['ATLANTIC-POOLS']) return;

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
    const poolType = selectedPool.isPut ? 'PUTS' : 'CALLS';

    if (
      !signer ||
      !provider ||
      !contractAddresses ||
      !accountAddress ||
      !selectedPool.duration
    )
      return;

    const poolAddress =
      contractAddresses['ATLANTIC-POOLS'][selectedPool.asset][poolType][
        selectedPool.duration
      ];

    const atlanticsViewer = AtlanticsViewer__factory.connect(
      contractAddresses['ATLANTICS-VIEWER'],
      provider
    );

    let atlanticPool: AtlanticPutsPool | AtlanticCallsPool;

    let userDeposits;

    if (poolType === 'PUTS') {
      userDeposits = await atlanticsViewer.getUserDeposits(
        selectedEpoch,
        poolAddress,
        accountAddress
      );

      console.log('user deposits', userDeposits);
      userDeposits = userDeposits.filter(
        (deposit) => deposit.depositor === accountAddress
      );

      const depositCheckpointCalls = userDeposits.map((deposit) => {
        return (atlanticPool as AtlanticPutsPool).epochMaxStrikeCheckpoints(
          selectedEpoch,
          deposit.strike,
          deposit.checkpoint
        );
      });

      let depositCheckpoints = await Promise.all(depositCheckpointCalls);
      const _userDeposits = userDeposits.map(
        (
          { strike, timestamp, liquidity, checkpoint, depositor },
          index: number
        ) => {
          const fundingEarned: BigNumber = liquidity
            .mul(depositCheckpoints[index]?.fundingAccrued ?? 0)
            .div(depositCheckpoints[index]?.totalLiquidity ?? 1);
          const underlyingEarned = liquidity
            .mul(depositCheckpoints[index]?.underlyingAccrued ?? 0)
            .div(depositCheckpoints[index]?.totalLiquidity ?? 1);
          const premiumsEarned = liquidity
            .mul(depositCheckpoints[index]?.premiumAccrued ?? 0)
            .div(depositCheckpoints[index]?.totalLiquidity ?? 1);

          // In 1e6 decimals
          const totalRevenue = Number(
            fundingEarned
              .add(premiumsEarned)
              .add(
                underlyingEarned
                  .mul(selectedPool.underlyingPrice)
                  .div(oneEBigNumber(12))
              )
          );
          const apy = (totalRevenue / Number(liquidity)) * 100;

          return {
            strike,
            timestamp,
            liquidity,
            checkpoint,
            fundingEarned,
            underlyingEarned,
            premiumsEarned,
            depositor,
            apy,
          };
        }
      );

      setUserPositions(() => _userDeposits);
    } else if (poolType === 'CALLS') {
      userDeposits = await atlanticsViewer.getUserDeposits(
        selectedEpoch,
        poolAddress,
        accountAddress
      );

      userDeposits = userDeposits.filter(
        (deposit) => deposit.depositor === accountAddress
      );

      const depositCheckpointCalls = userDeposits.map((deposit) => {
        return (atlanticPool as AtlanticCallsPool).epochCheckpoints(
          selectedEpoch,
          deposit.checkpoint
        );
      });

      let depositCheckpoints = await Promise.all(depositCheckpointCalls);

      const _userDeposits = userDeposits.map(
        ({ timestamp, liquidity, checkpoint, depositor }, index: number) => {
          const fundingEarned = liquidity
            .mul(depositCheckpoints[index]?.fundingAccrued ?? 0)
            .div(depositCheckpoints[index]?.totalLiquidity ?? 1);

          const premiumsEarned = liquidity
            .mul(depositCheckpoints[index]?.premiumAccrued ?? 0)
            .div(depositCheckpoints[index]?.totalLiquidity ?? 1);

          // In 1e18 decimals
          const totalRevenue = Number(fundingEarned.add(premiumsEarned));
          const apy = (totalRevenue / Number(liquidity)) * 100;

          return {
            timestamp,
            liquidity,
            checkpoint,
            fundingEarned,
            premiumsEarned,
            depositor,
            apy,
          };
        }
      );
      setUserPositions(() => _userDeposits);
    } else {
      return;
    }
    return;
  }, [
    accountAddress,
    contractAddresses,
    provider,
    selectedEpoch,
    signer,
    selectedPool,
  ]);

  const setSelectedPool = useCallback(
    async (
      underlying: string,
      type: string,
      epoch: number,
      duration: string
    ) => {
      if (!contractAddresses || !provider) return;
      const pool = (await getPool(
        underlying,
        type,
        epoch,
        duration
      )) as IAtlanticPoolType;
      if (!pool || !pool.contracts) return;
      _setSelectedPool(pool);
    },
    [contractAddresses, getPool, provider]
  );

  useEffect(() => {
    if (selectedPool.asset !== 'Asset') {
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
  };

  return (
    <AtlanticsContext.Provider value={contextValue}>
      {props.children}
    </AtlanticsContext.Provider>
  );
};
