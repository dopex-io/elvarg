import {
  createContext,
  useEffect,
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react';
import { BigNumber } from 'ethers';
import {
  ERC20,
  ERC20__factory,
  // AtlanticCallsPool,
  // AtlanticCallsPool__factory,
  AtlanticPutsPool,
  AtlanticPutsPool__factory,
  AtlanticsViewer__factory,
} from '@dopex-io/sdk';

import { useBoundStore } from 'store';

import oneEBigNumber from 'utils/math/oneEBigNumber';
import { Contracts, VaultConfig } from 'store/Vault/atlantics';

interface IVaultConfiguration {
  fundingInterval: BigNumber;
  expireDelayTolerance: BigNumber;
  tickSize: BigNumber;
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
  atlanticPool: AtlanticPutsPool;
  quoteToken: ERC20;
  baseToken: ERC20;
}

// Interface for deposit type (Calls and puts pool)
export interface IUserPosition {
  depositId: number | undefined;
  strike?: BigNumber;
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
    tickSize: BigNumber.from(0),
    expireDelayTolerance: BigNumber.from(0),
    fundingInterval: BigNumber.from(0),
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
  call?: DurationTypesOfPools;
}

export const AtlanticsProvider = (props: any) => {
  const { contractAddresses, signer, provider, accountAddress } =
    useBoundStore();

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
        baseToken,
        quoteToken,
        underlyingPrice,
        { tickSize },
        fundingInterval,
        expireDelayTolerance,
      ] = await Promise.all([
        atlanticPool.addresses(Contracts.BaseToken),
        atlanticPool.addresses(Contracts.QuoteToken),
        atlanticPool.getUsdPrice(),
        atlanticPool.getEpochData(epoch),
        atlanticPool.vaultConfig(VaultConfig.FundingInterval),
        atlanticPool.vaultConfig(VaultConfig.ExpireDelayTolerance),
      ]);
      let data: IEpochData;

      if (!checkpoints) return;

      let accumulator: IEpochData = {
        totalEpochActiveCollateral: BigNumber.from(0),
        totalEpochLiquidity: BigNumber.from(0),
        totalEpochUnlockedCollateral: BigNumber.from(0),
      };

      let totalEpochActiveCollateral = BigNumber.from(0);
      let totalEpochUnlockedCollateral = BigNumber.from(0);
      let totalEpochLiquidity = BigNumber.from(0);
      let totalEpochMaxStrikesData = [];

      for (const i in maxStrikes) {
        let totalActiveCollateral: BigNumber = BigNumber.from(0);
        let totalUnlockedCollateral: BigNumber = BigNumber.from(0);
        let totalLiquidity: BigNumber = BigNumber.from(0);
        for (const j in checkpoints[i]) {
          const _checkpoints = checkpoints[i];
          if (!_checkpoints) return;
          if (!_checkpoints[Number(j)]) return;

          const [, liquidity, , activeCollateral, unlockedCollateral] =
            _checkpoints[Number(j)] ?? [];
          if (!liquidity || !activeCollateral || !unlockedCollateral) return;
          totalActiveCollateral = totalActiveCollateral.add(activeCollateral);
          totalUnlockedCollateral =
            totalUnlockedCollateral.add(unlockedCollateral);
          totalLiquidity = totalLiquidity.add(liquidity);
        }

        totalEpochMaxStrikesData.push({
          totalActiveCollateral,
          totalUnlockedCollateral,
          totalLiquidity,
        });
      }

      for (const i in totalEpochMaxStrikesData) {
        const {
          totalActiveCollateral,
          totalUnlockedCollateral,
          totalLiquidity,
        } = totalEpochMaxStrikesData[i] ?? {};
        if (
          !totalActiveCollateral ||
          !totalUnlockedCollateral ||
          !totalLiquidity
        )
          return;
        totalEpochActiveCollateral = totalEpochActiveCollateral.add(
          totalActiveCollateral
        );
        totalEpochUnlockedCollateral = totalEpochUnlockedCollateral.add(
          totalUnlockedCollateral
        );
        totalEpochLiquidity = totalEpochLiquidity.add(totalLiquidity);
      }

      let epochStrikeData: IEpochStrikeData[] = [];

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
        tvl: tvl.add(totalEpochLiquidity),
        volume: volume.add(totalEpochActiveCollateral),
        poolsCount: poolsCount.add(1),
      }));

      const state: any = {};

      return {
        asset: underlying,
        isPut: true,
        strikes: maxStrikes,
        epochData: data,
        epochStrikeData,
        state: { ...state, epoch },
        config: {
          fundingInterval,
          tickSize,
          expireDelayTolerance,
        },
        contracts,
        tokens: {
          deposit: depositToken,
          underlying: underlying,
        },
        tvl: totalEpochLiquidity,
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
    async () => {
      // if (!address || !provider || !signer || !contractAddresses) return;
      // const atlanticPool = AtlanticCallsPool__factory.connect(
      //   address,
      //   provider
      // );
      // const [
      //   state,
      //   config,
      //   { baseToken },
      //   underlyingPrice,
      //   totalLiquidity,
      //   unlockedCollateral,
      //   activeCollateral,
      //   strikes,
      // ] = await Promise.all([
      //   atlanticPool.epochVaultStates(epoch),
      //   atlanticPool.vaultConfiguration(),
      //   atlanticPool.addresses(),
      //   atlanticPool.getUsdPrice(),
      //   atlanticPool.totalEpochDeposits(epoch),
      //   atlanticPool.totalEpochUnlockedCollateral(epoch),
      //   atlanticPool.totalEpochActiveCollateral(epoch),
      //   atlanticPool.getEpochStrikes(epoch),
      // ]);
      // const contracts: IContracts = {
      //   atlanticPool,
      //   quoteToken: ERC20__factory.connect(baseToken, signer),
      //   baseToken: ERC20__factory.connect(baseToken, signer),
      // };
      // const data: IEpochData = {
      //   totalEpochLiquidity: totalLiquidity,
      //   totalEpochActiveCollateral: unlockedCollateral,
      //   totalEpochUnlockedCollateral: activeCollateral,
      // };
      // const underlying = await contracts?.baseToken?.symbol();
      // setStats(({ poolsCount, tvl, volume }) => ({
      //   poolsCount: poolsCount.add(1),
      //   tvl: tvl.add(
      //     totalLiquidity.mul(underlyingPrice).div(oneEBigNumber(20))
      //   ),
      //   volume: volume.add(
      //     activeCollateral.mul(underlyingPrice).div(oneEBigNumber(20))
      //   ),
      // }));
      // return {
      //   asset: underlying,
      //   isPut: false,
      //   strikes: strikes,
      //   state: { ...state, epoch },
      //   epochData: data,
      //   config,
      //   contracts,
      //   tokens: {
      //     deposit: underlying,
      //     underlying: underlying,
      //   },
      //   tvl: totalLiquidity.mul(underlyingPrice).div(oneEBigNumber(20)),
      //   volume: activeCollateral.mul(underlyingPrice).div(oneEBigNumber(20)),
      //   apy: ['0'],
      //   duration,
      //   underlyingPrice: Number(underlyingPrice.div(1e8)),
      //   checkpoints: [BigNumber.from(0)],
      // };
    },
    [
      // contractAddresses, provider, signer
    ]
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
        };

        setPools([pool]);
      }
    );
  }, [
    contractAddresses,
    // getCallPool,
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
      if (!contractAddresses['ATLANTIC-POOLS']) return undefined;
      const poolAddress =
        contractAddresses['ATLANTIC-POOLS'][underlying][type][duration];

      if (type === 'CALLS') {
        return undefined;
        // return await getCallPool(poolAddress, selectedEpoch, duration);
      } else if (type === 'PUTS') {
        return await getPutPool(poolAddress, selectedEpoch, duration);
      } else {
        return undefined;
      }
    },
    [contractAddresses, getPutPool]
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

    let atlanticPool: AtlanticPutsPool | undefined; /** AtlanticCallsPool */

    let userDeposits;

    let depositIds: number[] = [];

    if (poolType === 'PUTS') {
      atlanticPool = selectedPool.contracts?.atlanticPool;
      userDeposits = await atlanticsViewer.getUserDeposits(
        poolAddress,
        selectedEpoch,
        accountAddress
      );
      userDeposits = userDeposits.filter((deposit, index) => {
        if (deposit.depositor === accountAddress) {
          depositIds.push(index);
          return deposit.depositor === accountAddress;
        } else return false;
      });

      const depositCheckpointCalls = userDeposits.map((deposit) => {
        return (atlanticPool as AtlanticPutsPool).getEpochMaxStrikeCheckpoint(
          selectedEpoch,
          deposit.strike,
          deposit.checkpoint
        );
      });

      let depositCheckpoints = await Promise.all(depositCheckpointCalls);
      const _userDeposits = userDeposits.map(
        ({ strike, liquidity, checkpoint, depositor }, index: number) => {
          const fundingEarned: BigNumber = liquidity
            .mul(depositCheckpoints[index]?.borrowFeesAccrued ?? 0)
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
            depositId: depositIds[index],
            strike,
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
      // atlanticPool = selectedPool.contracts?.atlanticPool;
      // userDeposits = await atlanticsViewer.getUserDeposits(
      //   selectedEpoch,
      //   poolAddress,
      //   accountAddress
      // );
      // let depositIds: number[] = [];
      // userDeposits = userDeposits.filter((deposit, index) => {
      //   if (deposit.depositor === accountAddress) {
      //     depositIds.push(index);
      //     return deposit.depositor === accountAddress;
      //   } else return false;
      // });
      // const depositCheckpointCalls = userDeposits.map((deposit) => {
      //   return (atlanticPool as AtlanticCallsPool).epochCheckpoints(
      //     selectedEpoch,
      //     deposit.checkpoint
      //   );
      // });
      // let depositCheckpoints = await Promise.all(depositCheckpointCalls);
      // const _userDeposits = userDeposits.map(
      //   ({ timestamp, liquidity, checkpoint, depositor }, index: number) => {
      //     const fundingEarned = liquidity
      //       .mul(depositCheckpoints[index]?.fundingAccrued ?? 0)
      //       .div(depositCheckpoints[index]?.totalLiquidity ?? 1);
      //     const premiumsEarned = liquidity
      //       .mul(depositCheckpoints[index]?.premiumAccrued ?? 0)
      //       .div(depositCheckpoints[index]?.totalLiquidity ?? 1);
      //     // In 1e18 decimals
      //     const totalRevenue = Number(fundingEarned.add(premiumsEarned));
      //     const apy = (totalRevenue / Number(liquidity)) * 100;
      //     return {
      //       depositId: depositIds[index],
      //       timestamp,
      //       liquidity,
      //       checkpoint,
      //       fundingEarned,
      //       premiumsEarned,
      //       depositor,
      //       apy,
      //     };
      //   }
      // );
      // setUserPositions(() => _userDeposits);
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
