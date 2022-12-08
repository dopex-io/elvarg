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

import { CommonSlice } from 'store/Vault/common';
import { WalletSlice } from 'store/Wallet';

import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

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
  timestamp: BigNumber;
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
      { baseToken, quoteToken },
      underlyingPrice,
      tickSize,
      fundingInterval,
      expireDelayTolerance,
      { feeBps },
    ] = await Promise.all([
      atlanticPool.addresses(),
      atlanticPool.getUsdPrice(),
      atlanticPool.epochTickSize(currentEpoch),
      atlanticPool.fundingInterval(),
      atlanticPool.expireDelayTolerance(),
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
    // @ts-ignore
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

    if (!checkpoints) return;

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
      const { totalActiveCollateral, totalUnlockedCollateral, totalLiquidity } =
        totalEpochMaxStrikesData[i] ?? {};
      if (!totalActiveCollateral || !totalUnlockedCollateral || !totalLiquidity)
        return;
      totalEpochActiveCollateral = totalEpochActiveCollateral.add(
        totalActiveCollateral
      );
      totalEpochUnlockedCollateral = totalEpochUnlockedCollateral.add(
        totalUnlockedCollateral
      );
      totalEpochLiquidity = totalEpochLiquidity.add(totalLiquidity);
    }

    let utilizationRate: number;

    try {
      utilizationRate = getUserReadableAmount(
        totalEpochUnlockedCollateral
          .mul(getContractReadableAmount(1, 6))
          .div(totalEpochLiquidity),
        6
      );
    } catch (e) {
      utilizationRate = 0;
    }

    const vaultState =
      await atlanticPool.contracts.atlanticPool.epochVaultStates(selectedEpoch);

    const tickSize = await atlanticPool.contracts.atlanticPool.epochTickSize(
      selectedEpoch
    );

    const [
      settlementPrice,
      expiryTime,
      startTime,
      isVaultReady,
      isVaultExpired,
    ] = vaultState;

    const totalEpochDeposits = (
      await atlanticPool.contracts.atlanticPool.totalEpochCummulativeLiquidity(
        selectedEpoch
      )
    )
      .add(totalEpochActiveCollateral)
      .div(getContractReadableAmount(1, 6))
      .toNumber();

    const underlyingPriceInUsd =
      await atlanticPool.contracts.atlanticPool.getUsdPrice();

    const premiaAccrued = checkpoints
      .map((checkpoint) => checkpoint)
      .flat()
      .map((cpObject) => cpObject.premiumAccrued)
      .reduce((prev, next) => prev.add(next), BigNumber.from(0));

    const premiaInUsd = premiaAccrued
      .div(getContractReadableAmount(1, 6))
      .toNumber();

    const fundingAccrued = checkpoints
      .map((checkpoint) => checkpoint)
      .flat()
      .map((cpObject) => cpObject.fundingFeesAccrued)
      .reduce((prev, next) => prev.add(next), BigNumber.from(0));

    const fundingAccruedInUsd = fundingAccrued // 1e6
      .mul(underlyingPriceInUsd) // 1e8
      .div(getContractReadableAmount(1, 14))
      .toNumber();

    const epochLength = expiryTime.sub(startTime);

    const epochDurationInDays = epochLength.div('84600').toNumber();

    const apr =
      (((premiaInUsd + fundingAccruedInUsd) / totalEpochDeposits) *
        (365 * 100)) /
      epochDurationInDays;

    let atlanticPoolEpochData: IAtlanticPoolEpochData = {
      epoch: selectedEpoch,
      tickSize,
      maxStrikes,
      settlementPrice,
      premiaAccrued,
      apr: isNaN(apr) ? 0 : apr,
      utilizationRate,
      startTime: startTime,
      expiry: expiryTime,
      isVaultReady,
      isVaultExpired,
      epochMaxStrikeRange: [],
      epochStrikeData: [],
      totalEpochActiveCollateral: BigNumber.from(0),
      totalEpochLiquidity: BigNumber.from(0),
      totalEpochUnlockedCollateral: BigNumber.from(0),
    };

    for (let i = 0; i < maxStrikes.length; i++) {
      const { totalActiveCollateral, totalUnlockedCollateral, totalLiquidity } =
        totalEpochMaxStrikesData[i] ?? {};

      if (!totalActiveCollateral || !totalUnlockedCollateral || !totalLiquidity)
        return;

      atlanticPoolEpochData.totalEpochLiquidity =
        atlanticPoolEpochData.totalEpochLiquidity.add(totalLiquidity);

      atlanticPoolEpochData.totalEpochUnlockedCollateral =
        atlanticPoolEpochData.totalEpochUnlockedCollateral.add(
          totalUnlockedCollateral
        );

      atlanticPoolEpochData.epochStrikeData.push({
        strike: maxStrikes[i] ?? BigNumber.from(0),
        totalEpochMaxStrikeLiquidity: totalLiquidity,
        unlocked: totalUnlockedCollateral,
        activeCollateral: totalActiveCollateral,
      });
    }

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
      selectedEpoch,
      poolAddress,
      accountAddress
    );
    userDeposits = userDeposits.filter((deposit, index) => {
      if (deposit.depositor === accountAddress) {
        depositIds.push(index);
        return deposit.depositor === accountAddress;
      } else return false;
    });

    const depositCheckpointCalls = userDeposits.map((deposit) => {
      return atlanticPool.contracts.atlanticPool.epochMaxStrikeCheckpoints(
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
      (
        { strike, timestamp, liquidity, checkpoint, depositor },
        index: number
      ) => {
        const fundingEarned: BigNumber = liquidity
          .mul(depositCheckpoints[index]?.fundingFeesAccrued ?? 0)
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

    set((prevState) => ({ ...prevState, userPositions: _userDeposits }));
  },
});
