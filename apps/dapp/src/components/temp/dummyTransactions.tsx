import { BigNumberish } from 'ethers';

export type StraddleDeposit = {
  amount: bigint;
  claimed: bigint;
  epoch: bigint;
  compound: boolean;
  rollover: boolean;
};

export type UserReadableStraddleDeposit = {
  positionId: string;
  amount: string;
  claimed: string;
  epoch: string;
  rollover: boolean;
  compound: boolean;
};

const collateralTokenDecimals = BigInt(1e6);

const EXAMPLE_DEPOSIT_1 = {
  amount: BigInt(2000e6),
  claimed: BigInt(1),
  epoch: BigInt(1),
  compound: true,
  rollover: true,
};
const EXAMPLE_DEPOSIT_2 = {
  amount: BigInt(1000e6),
  claimed: BigInt(1),
  epoch: BigInt(1),
  compound: true,
  rollover: true,
};
const EXAMPLE_DEPOSIT_3 = {
  amount: BigInt(100e6),
  claimed: BigInt(1),
  epoch: BigInt(1),
  compound: true,
  rollover: true,
};

const EXAMPLE_STRADDLE_1 = {
  amount: BigInt(2e18),
  fundingCharged: BigInt(10e6),
  settlementComission: BigInt(1e6),
  settlementPrice: 0n,
  epoch: 1n,
  strike: BigInt(1500e6),
  isSettled: false,
};

const EXAMPLE_STRADDLE_2 = {
  amount: BigInt(3e18),
  fundingCharged: BigInt(10e6),
  settlementComission: BigInt(1e6),
  settlementPrice: 0n,
  epoch: 1n,
  strike: BigInt(1500e6),
  isSettled: false,
};

const EXAMPLE_STRADDLE_3 = {
  amount: BigInt(1e18),
  fundingCharged: BigInt(15e6),
  settlementComission: BigInt(2e6),
  settlementPrice: BigInt(1800e6),
  epoch: 1n,
  strike: BigInt(1500e6),
  isSettled: true,
};

const exampleStraddlePositions = [
  EXAMPLE_STRADDLE_1,
  EXAMPLE_STRADDLE_2,
  EXAMPLE_STRADDLE_3,
];

const exampleDepositPositions = [
  EXAMPLE_DEPOSIT_1,
  EXAMPLE_DEPOSIT_2,
  EXAMPLE_DEPOSIT_3,
];

const exampleTotalDeposits = exampleDepositPositions.reduce(
  (prev, curr) => prev + curr.amount,
  0n,
);
const exampleEarnings = BigInt(1600e6);
const exampleTotalActiveCollateral = BigInt(1500e6);
const exampleExpiry = BigInt(
  (Number(new Date().getTime()) / 1000 + 3 * 86400).toFixed(0),
);
const exampleStartTimestamp = BigInt(
  (Number(new Date().getTime()) / 1000).toFixed(0),
);

export async function totalSupply(): Promise<bigint> {
  return BigInt(exampleDepositPositions.length);
}

// const totalEpochDa
export async function earned(tokenId: bigint): Promise<bigint> {
  return (
    (exampleDepositPositions[Number(tokenId)].amount / exampleTotalDeposits) *
    exampleEarnings
  );
}

export async function getDepositShare(tokenId: bigint): Promise<bigint> {
  return exampleDepositPositions[Number(tokenId)].amount / exampleTotalDeposits;
}

export async function withdrawable(tokenId: bigint): Promise<bigint> {
  return BigInt(0);
}

export async function getAvailableCollateral(tokenId: bigint): Promise<bigint> {
  return BigInt(0);
}

export async function getRequiredCollateral(tokenId: bigint): Promise<bigint> {
  return BigInt(0);
}

export async function getUnderlyingPriceInCollateral(): Promise<bigint> {
  return BigInt(1000e6);
}

export async function calculatePremium(
  strike: bigint,
  amount: bigint,
): Promise<bigint> {
  return BigInt(0);
}

export async function getEpochData(epoch: bigint): Promise<EpochData> {
  return {
    earnings: exampleEarnings,
    expiryTimestamp: exampleExpiry,
    startTimestamp: exampleStartTimestamp,
    totalActiveCollateral: exampleTotalActiveCollateral,
    totalCollateral: exampleTotalDeposits,
    totalStraddlePositions: BigInt(1),
    totalUnderlyingPurchased: BigInt(1),
  };
}

export async function depositPositions(
  tokenId: bigint,
): Promise<DepositPosition> {
  return exampleDepositPositions[Number(tokenId)];
}

export async function straddlePositions(
  tokenId: bigint,
): Promise<StraddlePosition> {
  return exampleStraddlePositions[Number(tokenId)];
}

export function getUserDeposits(): UserReadableStraddleDeposit[] {
  return exampleDepositPositions.map(
    ({ amount, epoch, claimed, rollover, compound }, index) => ({
      positionId: index.toString(),
      amount: (amount / collateralTokenDecimals).toString(),
      epoch: epoch.toString(),
      claimed: (claimed / collateralTokenDecimals).toString(),
      rollover,
      compound,
    }),
  );
}

interface DepositPosition {
  amount: bigint;
  epoch: bigint;
  claimed: bigint;
  rollover: boolean;
  compound: boolean;
}

interface EpochData {
  totalCollateral: bigint;
  totalActiveCollateral: bigint;
  totalUnderlyingPurchased: bigint;
  earnings: bigint;
  startTimestamp: bigint;
  expiryTimestamp: bigint;
  totalStraddlePositions: bigint;
}

interface Settings {
  preExpireWindow: bigint;
  maxPriceImpact: bigint;
  fundingInterval: bigint;
  fundingRate: bigint;
  preExpirySettlementFeeBps: bigint;
  protocolFeeBps: bigint;
}

interface StraddlePosition {
  amount: bigint;
  fundingCharged: bigint;
  settlementComission: bigint;
  settlementPrice: bigint;
  epoch: bigint;
  strike: bigint;
  isSettled: boolean;
}

interface Contracts {
  IPriceOracle: string;
  IVolatilityOracle: string;
  IOptionPricing: string;
}
