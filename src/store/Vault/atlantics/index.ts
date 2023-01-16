import { StateCreator } from 'zustand';
import { BigNumber } from 'ethers';
import {
  ERC20,
  ERC20__factory,
  AtlanticPutsPool,
  AtlanticPutsPool__factory,
  AtlanticsViewer__factory,
  AtlanticsViewer,
  DopexFeeStrategy__factory,
} from '@dopex-io/sdk';
import { CheckpointStructOutput } from '@dopex-io/sdk/dist/types/typechain/AtlanticPutsPool';

import { CommonSlice } from 'store/Vault/common';
import { WalletSlice } from 'store/Wallet';

import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

export enum OptionsState {
  Settled,
  Active,
  Unlocked,
}

export enum EpochState {
  InActive,
  BootStrapped,
  Expired,
  Paused,
}

export enum Contracts {
  QuoteToken,
  BaseToken,
  FeeDistributor,
  FeeStrategy,
  OptionPricing,
  PriceOracle,
  VolatilityOracle,
  Gov,
}

export enum VaultConfig {
  IvBoost,
  ExpiryWindow,
  FundingInterval,
  BaseFundingRate,
  UseDiscount,
  ExpireDelayTolerance,
}

interface IVaultConfiguration {
  expireDelayTolerance: BigNumber;
  fundingInterval: BigNumber;
  tickSize: BigNumber;
  fundingFee: BigNumber;
}

export interface ApContracts {
  atlanticPool: AtlanticPutsPool;
  quoteToken: ERC20;
  baseToken: ERC20;
  atlanticPoolViewer: AtlanticsViewer;
}

interface IAtlanticPoolData {
  currentEpoch: BigNumber | number;
  vaultConfig: IVaultConfiguration;
  contracts: ApContracts;
  underlyingPrice: BigNumber;
  tokens: {
    underlying: string;
    depositToken: string;
  };
  durationType: string;
}

interface IAtlanticPoolEpochData {
  epoch: number;
  tickSize?: BigNumber;
  maxStrikes: BigNumber[];
  settlementPrice: BigNumber;
  premiaAccrued: BigNumber;
  utilizationRate: number | string;
  apr: number | string;
  startTime: BigNumber;
  expiry: BigNumber;
  isVaultReady: boolean;
  isVaultExpired: boolean;
  epochMaxStrikeRange: BigNumber[];
  totalEpochLiquidity: BigNumber;
  totalEpochActiveCollateral: BigNumber;
  totalEpochUnlockedCollateral: BigNumber;
  epochStrikeData: IAtlanticPoolEpochStrikeData[];
}

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

export interface IAtlanticPoolUserEpochData {
  positions: IUserPosition[];
}

export interface Checkpoint {
  startTime: BigNumber;
  totalLiquidity: BigNumber;
  totalLiquidityBalance: BigNumber;
  activeCollateral: BigNumber;
  unlockedCollateral: BigNumber;
  premiumAccrued: BigNumber;
  fundingAccrued: BigNumber;
  underlyingAccrued: BigNumber;
}

export interface IAtlanticPoolEpochStrikeData {
  strike: BigNumber;
  unlocked: BigNumber;
  activeCollateral: BigNumber;
  totalEpochMaxStrikeLiquidity: BigNumber;
}

export interface Pool {
  asset: string;
  daily: string;
  weekly: string;
  monthly: string;
}

export interface AtlanticPoolsSlice {
  atlanticPool?: IAtlanticPoolData;
  updateAtlanticPool: Function;
  atlanticPoolEpochData?: IAtlanticPoolEpochData;
  updateAtlanticPoolEpochData: Function;
  userPositions?: IUserPosition[];
  updateUserPositions: Function;
}

export const createAtlanticsSlice: StateCreator<
  AtlanticPoolsSlice & CommonSlice & WalletSlice,
  [['zustand/devtools', never]],
  [],
  AtlanticPoolsSlice
> = (set, get) => ({
  updateAtlanticPool: async (asset: string, duration: string) => {
    const { contractAddresses, signer, provider } = get();

    if (!contractAddresses || !signer || !provider || !asset || !duration)
      return;

    const atlanticPool = AtlanticPutsPool__factory.connect(
      contractAddresses['ATLANTIC-POOLS'][asset]['PUTS'][duration],
      provider
    );

    const currentEpoch = await atlanticPool.currentEpoch();
    let [
      baseToken,
      quoteToken,
      underlyingPrice,
      { tickSize },
      fundingInterval,
      expireDelayTolerance,
      { feeBps },
    ] = await Promise.all([
      atlanticPool.addresses(Contracts.BaseToken),
      atlanticPool.addresses(Contracts.QuoteToken),
      atlanticPool.getUsdPrice(),
      atlanticPool.getEpochData(currentEpoch),
      atlanticPool.vaultConfig(VaultConfig.FundingInterval),
      atlanticPool.vaultConfig(VaultConfig.ExpireDelayTolerance),
      DopexFeeStrategy__factory.connect(
        contractAddresses['FEE-STRATEGY'],
        provider
      )['getFeeBps(uint256)'](1),
    ]);

    const contracts: ApContracts = {
      atlanticPool,
      baseToken: ERC20__factory.connect(baseToken, provider),
      quoteToken: ERC20__factory.connect(quoteToken, provider),
      atlanticPoolViewer: AtlanticsViewer__factory.connect(
        contractAddresses['ATLANTICS-VIEWER'],
        provider
      ),
    };

    const [underlying, depositToken] = await Promise.all([
      contracts.baseToken.symbol(),
      contracts.quoteToken.symbol(),
    ]);
    set((prevState) => ({
      ...prevState,
      atlanticPool: {
        currentEpoch,
        vaultConfig: {
          fundingInterval,
          expireDelayTolerance,
          tickSize,
          fundingFee: feeBps,
        },
        contracts,
        tokens: {
          underlying,
          depositToken,
        },
        underlyingPrice,
        durationType: duration,
      },
    }));
  },
  updateAtlanticPoolEpochData: async () => {
    const { selectedEpoch, selectedPoolName, contractAddresses, atlanticPool } =
      get();

    if (
      !selectedEpoch ||
      !selectedPoolName ||
      !contractAddresses ||
      !atlanticPool
    )
      return;

    // Strikes
    const maxStrikes: BigNumber[] =
      await atlanticPool.contracts.atlanticPool.getEpochStrikes(selectedEpoch);

    const latestCheckpointsCalls = maxStrikes.map(
      async (maxStrike: BigNumber) => {
        return atlanticPool.contracts.atlanticPool.getEpochCheckpoints(
          selectedEpoch,
          maxStrike
        );
      }
    );

    const checkpoints = await Promise.all(latestCheckpointsCalls);

    checkpoints.map((maxStrikeData, i) => {
      const strikeData = maxStrikeData.map(
        (checkpoint: CheckpointStructOutput) => {
          return {
            uc: checkpoint.unlockedCollateral.toNumber(),
            tl: checkpoint.totalLiquidity.toNumber(),
            st: checkpoint.startTime.toNumber(),
          };
        }
      );
      return { ...strikeData, strike: maxStrikes[i]?.div(1e8).toNumber() };
    });

    if (!checkpoints) return;

    const {
      state,
      startTime,
      expiryTime,
      settlementPrice,
      tickSize,
      totalLiquidity,
      totalActiveCollateral,
    } = await atlanticPool.contracts.atlanticPool.getEpochData(selectedEpoch);

    let totalPremium = BigNumber.from(0);
    let totalFunding = BigNumber.from(0);
    let maxStrikeData: IAtlanticPoolEpochStrikeData[] = [];
    let totalEpochUnlockedCollateral = BigNumber.from(0);

    for (const i in maxStrikes) {
      const strike = maxStrikes[i];

      if (!strike) return;

      const maxStrikeCheckpoints = checkpoints[i];

      if (!maxStrikeCheckpoints) return;
      let totalActiveCollateral = BigNumber.from(0);
      let totalUnlockedCollateral = BigNumber.from(0);
      let liquidity = BigNumber.from(0);

      for (const j in maxStrikeCheckpoints) {
        const checkpoint = maxStrikeCheckpoints[j];
        if (!checkpoint) return;

        const {
          activeCollateral,
          unlockedCollateral,
          totalLiquidity,
          premiumAccrued,
          borrowFeesAccrued,
        } = checkpoint;

        totalActiveCollateral = totalActiveCollateral.add(activeCollateral);

        totalUnlockedCollateral =
          totalUnlockedCollateral.add(unlockedCollateral);

        liquidity = liquidity.add(totalLiquidity);
        totalPremium = totalPremium.add(premiumAccrued);
        totalFunding = totalFunding.add(borrowFeesAccrued);
      }

      totalEpochUnlockedCollateral = totalEpochUnlockedCollateral.add(
        totalUnlockedCollateral
      );

      maxStrikeData.push({
        strike: strike,
        activeCollateral: totalActiveCollateral,
        totalEpochMaxStrikeLiquidity: liquidity,
        unlocked: totalUnlockedCollateral,
      });
    }

    // TODO
    let utilizationRate: number;

    try {
      utilizationRate = getUserReadableAmount(
        totalEpochUnlockedCollateral
          .mul(getContractReadableAmount(1, 6))
          .div(totalLiquidity),
        6
      );
    } catch (e) {
      utilizationRate = 0;
    }

    const isVaultReady = state == EpochState.BootStrapped;
    const isVaultExpired = state == EpochState.Expired;

    const totalEpochDeposits = totalLiquidity.add(totalActiveCollateral);

    const epochLength = expiryTime.sub(startTime);

    const epochDurationInDays = epochLength.div('84600').toNumber();

    const apr =
      ((totalPremium.add(totalFunding).div(1e6).toNumber() /
        totalEpochDeposits.div(getContractReadableAmount(1, 6)).toNumber()) *
        (365 * 100)) /
      epochDurationInDays;

    let atlanticPoolEpochData: IAtlanticPoolEpochData = {
      epoch: selectedEpoch,
      tickSize,
      maxStrikes,
      settlementPrice,
      premiaAccrued: totalPremium,
      apr: isNaN(apr) ? 0 : apr,
      utilizationRate,
      startTime: startTime,
      expiry: expiryTime,
      isVaultReady,
      isVaultExpired,
      epochMaxStrikeRange: [
        maxStrikes[0] ?? BigNumber.from(0),
        maxStrikes[maxStrikes.length - 1] ?? BigNumber.from(0),
      ],
      epochStrikeData: maxStrikeData,
      totalEpochActiveCollateral: totalActiveCollateral,
      totalEpochLiquidity: totalEpochDeposits,
      totalEpochUnlockedCollateral: totalEpochUnlockedCollateral,
    };

    set((prevState) => ({
      ...prevState,
      atlanticPoolEpochData,
    }));
  },
  updateUserPositions: async () => {
    const {
      signer,
      provider,
      contractAddresses,
      accountAddress,
      atlanticPool,
      atlanticPoolEpochData,
      selectedEpoch,
    } = get();
    if (
      !signer ||
      !provider ||
      !contractAddresses ||
      !accountAddress ||
      !atlanticPool?.durationType ||
      !atlanticPoolEpochData
    )
      return;

    const poolAddress = atlanticPool.contracts.atlanticPool.address;

    const atlanticsViewer = AtlanticsViewer__factory.connect(
      contractAddresses['ATLANTICS-VIEWER'],
      provider
    );

    let userDeposits;

    let depositIds: number[] = [];

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
      return atlanticPool.contracts.atlanticPool.getEpochMaxStrikeCheckpoint(
        selectedEpoch,
        deposit.strike,
        deposit.checkpoint
      );
    });

    const epochLength = atlanticPoolEpochData.expiry.sub(
      atlanticPoolEpochData.startTime
    );

    const epochDurationInDays = epochLength.div('84600').toNumber();

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
        const totalRevenue = fundingEarned // 1e6
          .add(premiumsEarned) // 1e6
          .add(
            underlyingEarned // 1e18
              .mul(atlanticPool.underlyingPrice) // 1e8
              .div(getContractReadableAmount(1, 18 + 8 - 6))
          );

        const apy =
          ((parseFloat(totalRevenue.toString()) /
            parseFloat(liquidity.toString())) *
            365) /
          epochDurationInDays;

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

    set((prevState) => ({ ...prevState, userPositions: _userDeposits }));
  },
});
