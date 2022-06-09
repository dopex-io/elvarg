import {
  createContext,
  useEffect,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { BigNumber, ethers } from 'ethers';
import {
  Addresses,
  ERC20,
  ERC20__factory,
  // ERC20__factory,
} from '@dopex-io/sdk';

import { WalletContext } from './Wallet';

import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import {
  AtlanticCallsPool,
  AtlanticCallsPool__factory,
  AtlanticPutsPool,
  AtlanticPutsPool__factory,
} from '../contracts/types';
import { expandToDecimals } from 'utils/contracts/expandToDecimals';
import { TOKEN_DECIMALS } from 'constants/index';
import getTokenDecimals from 'utils/general/getTokenDecimals';
import formatAmount from 'utils/general/formatAmount';
import { KeyboardReturnTwoTone } from '@mui/icons-material';

const tokenPrices = {
  WETH: 1800,
  USDT: 1,
};

const addresses: any = {
  'ATLANTIC-POOLS': {
    WETH: {
      PUTS: {
        WEEKLY: '0x927b167526bAbB9be047421db732C663a0b77B11',
      },
      CALLS: {
        WEEKLY: '0x32EEce76C2C2e8758584A83Ee2F522D4788feA0f',
      },
    },
  },
};

interface IAtlanticPoolsInfo {
  [key: string]: {
    title: string;
    description: string;
  };
}
export const ATLANTIC_POOL_INFO: IAtlanticPoolsInfo = {
  CALLS: {
    title: '33%+ Single OTM Strike',
    description:
      'Deposit underlying into to vault to write OTM calls 33%+ OTM from spot price on bootstrap to earn premiums and fundings.',
  },
  PUTS: {
    title: 'Max Strikes Vault',
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
  withReader: AtlanticCallsPool | AtlanticPutsPool;
  withSigner: AtlanticCallsPool | AtlanticPutsPool;
  quoteToken: ERC20;
  baseToken: ERC20;
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

const AtlanticPoolsZeroData: IAtlanticPoolType = {
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
    deposit: 'USDC',
    underlying: 'WETH',
  },
  tvl: 0,
  volume: 0,
  apy: '0',
};

// Interface for deposit type (Calls and puts pool)
interface IUserDeposit {
  liquidity: BigNumber;
  premiumRatio: BigNumber;
  fundingRatio: BigNumber;
  underlyingRatio?: BigNumber;
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
interface Stats {
  tvl: number;
  volume: number;
  poolsCount: number;
}

interface AtlanticsContextInterface {
  pools: Pool[];
  stats: Stats;
  getCallPool: (
    epoch: number | BigNumber,
    address: string,
    duration: string
  ) => Promise<IAtlanticPoolType | null> | null;
  getPutPool: (
    epoch: number | BigNumber,
    address: string,
    duration: string
  ) => Promise<IAtlanticPoolType | null> | null;
  getPool: (
    underlying: string,
    type: string,
    epoch: number,
    duration: string
  ) => Promise<IAtlanticPoolType | null> | null;
  selectedEpoch?: number | any;
  setSelectedEpoch?: any;
  selectedPool?: IAtlanticPoolType;
  setSelectedPool?: any;
}

const initialAtlanticsData = {
  pools: [],
  stats: {
    tvl: 0,
    volume: 0,
    poolsCount: 0,
  },
  getCallPool: () => null,
  getPutPool: () => null,
  getPool: () => null,
};

export const AtlanticsContext =
  createContext<AtlanticsContextInterface>(initialAtlanticsData);

export interface DurationTypesOfPools {
  daily?: IAtlanticPoolType | null;
  weekly?: IAtlanticPoolType | null;
  monthly?: IAtlanticPoolType | null;
}

interface Pool {
  asset: string;
  put: DurationTypesOfPools;
  call: DurationTypesOfPools;
}

export const AtlanticsProvider = (props: any) => {
  // const { accountAddress, contractAddresses, chainId, provider /*, signer */ } =
  //   useContext(WalletContext);

  const [pools, setPools] = useState<Pool[]>([]);
  const [stats, setStats] = useState<Stats>({
    tvl: 0,
    volume: 0,
    poolsCount: 0,
  });
  const [selectedPool, _setSelectedPool] = useState<IAtlanticPoolType>(
    AtlanticPoolsZeroData
  );
  const [selectedEpoch, setSelectedEpoch] = useState<number>(1);

  // Fetches type IAtlanticPoolType for a pool
  const getPutPool = useCallback(
    async (
      epoch: number | BigNumber,
      address: string,
      duration: string
    ): Promise<IAtlanticPoolType | null> => {
      if (!address) return null;
      const provider = new ethers.providers.Web3Provider(window?.ethereum);
      const signer = await provider.getSigner();

      if (!window.ethereum || !provider || !signer || !addresses) return null;

      const withSigner = AtlanticPutsPool__factory.connect(address, signer);
      const withReader = AtlanticPutsPool__factory.connect(address, provider);

      if (epoch === 0) {
        epoch = await withReader.currentEpoch();
      }

      const latestCheckpoints: BigNumber[] =
        await withReader.getEpochCurrentMaxStrikeCheckpoints(epoch);

      // Strikes
      const maxStrikes = await withReader.getEpochMaxStrikes(epoch);

      const latestCheckpointsCalls = maxStrikes.map(
        async (maxStrike: BigNumber, index: number) => {
          const checkpoint = Number(latestCheckpoints[index]);
          return withReader.checkpoints(epoch, maxStrike, checkpoint);
        }
      );

      const checkpoints = await Promise.all(latestCheckpointsCalls);
      let [{ baseToken, quoteToken }, state, config] = await Promise.all([
        withReader.addresses(),
        withReader.epochVaultStates(epoch),
        withReader.vaultConfiguration(),
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
        withReader,
        withSigner,
        baseToken: ERC20__factory.connect(baseToken, signer),
        quoteToken: ERC20__factory.connect(quoteToken, signer),
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
          epoch,
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
    []
  );

  const getCallPool = useCallback(
    async (
      epoch: number | BigNumber,
      address: string,
      duration: string
    ): Promise<IAtlanticPoolType | null> => {
      if (!address) return null;
      const provider = new ethers.providers.Web3Provider(window?.ethereum);
      const signer = await provider.getSigner();

      if (!window.ethereum || !provider || !signer || !addresses) return null;

      const withSigner = AtlanticCallsPool__factory.connect(address, signer);
      const withReader = AtlanticCallsPool__factory.connect(address, provider);

      if (epoch === 0) {
        epoch = await withReader.currentEpoch();
      }
      const latestCheckpoint = await withReader.checkpointsCount(epoch);

      const [state, config, checkpoint, { baseToken }] = await Promise.all([
        withReader.epochVaultStates(epoch),
        withReader.vaultConfiguration(),
        withReader.checkpoints(epoch, latestCheckpoint),
        withReader.addresses(),
      ]);

      const contracts: IContracts = {
        withReader,
        withSigner,
        quoteToken: ERC20__factory.connect(baseToken, signer ?? provider),
        baseToken: ERC20__factory.connect(baseToken, signer ?? provider),
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
        strikes: state.strike,
        state: { ...state, epoch },
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
    []
  );

  const updatePools = useCallback(async () => {
    Object.keys(addresses['ATLANTIC-POOLS']).map(async (asset: string) => {
      const currentPool = {
        asset,
        put: {
          daily: await getPutPool(
            0,
            addresses['ATLANTIC-POOLS'][asset]['PUTS']?.DAILY ?? null,
            'DAILY'
          ),
          weekly: await getPutPool(
            0,
            addresses['ATLANTIC-POOLS'][asset]['PUTS']?.WEEKLY ?? null,
            'WEEKLY'
          ),
          monthly: await getPutPool(
            0,
            addresses['ATLANTIC-POOLS'][asset]['PUTS']?.MONTHLY ?? null,
            'MONTHLY'
          ),
        },
        call: {
          daily: await getCallPool(
            0,
            addresses['ATLANTIC-POOLS'][asset]['CALLS']?.DAILY ?? null,
            'DAILY'
          ),
          weekly: await getCallPool(
            0,
            addresses['ATLANTIC-POOLS'][asset]['CALLS']?.WEEKLY ?? null,
            'WEEKLY'
          ),
          monthly: await getCallPool(
            0,
            addresses['ATLANTIC-POOLS'][asset]['CALLS']?.MONTHLY ?? null,
            'MONTHLY'
          ),
        },
      };
      setPools((prev) => [...prev, currentPool]);
    });
  }, [getCallPool, getPutPool]);

  const getPool = useCallback(
    async (
      underlying: string,
      type: string,
      epoch: number,
      duration: string
    ): Promise<IAtlanticPoolType | null> => {
      const poolAddress =
        addresses['ATLANTIC-POOLS'][underlying][type][duration];
      console.log('POOL ADDRESS', poolAddress);
      if (type === 'CALLS') {
        return await getCallPool(epoch, poolAddress, duration);
      } else if (type === 'PUTS') {
        return await getPutPool(epoch, poolAddress, duration);
      } else {
        return null;
      }
    },
    []
  );

  const setSelectedPool = useCallback(
    async (
      underlying: string,
      type: string,
      epoch: number,
      duration: string
    ) => {
      const pool: any = await getPool(underlying, type, epoch, duration);
      _setSelectedPool(() => pool!);
    },
    [getPool]
  );

  useEffect(() => {
    updatePools();
  }, [updatePools]);

  const contextValue = {
    pools,
    stats,
    getCallPool,
    getPutPool,
    getPool,
    setSelectedPool,
    selectedPool,
    selectedEpoch,
    setSelectedEpoch,
  };

  return (
    <AtlanticsContext.Provider value={contextValue}>
      {props.children}
    </AtlanticsContext.Provider>
  );
};
