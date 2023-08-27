import { DurationToExpiryData } from 'hooks/option-amm/useStrikesData';

export interface AggregatedStats {
  oi: number;
  apy: number;
  currentPrice: number;
  volume: number;
}

export const aggregatedStats: AggregatedStats = {
  oi: 0,
  apy: 0,
  currentPrice: 0,
  volume: 0,
};

export const columnLabels = [
  'Health Factor',
  'Margin Balance',
  'Available Margin',
];

export const longs = [
  ...Array.from(Array(53)).map((_, idx) => ({
    strike: idx + 1,
    size: `${idx + 1}`,
    side: 'CALL',
    expiry: idx + 1,
    breakeven: `${idx + 1}`,
    pnl: `${idx + 1}`,
    button: {
      handleSettle: () => {},
      id: idx + 1,
      epoch: idx + 1,
      currentEpoch: idx + 1,
      expiry: idx + 1,
      canItBeSettled: false,
    },
  })),
];

export const shorts = [
  ...Array.from(Array(25)).map((_, idx) => ({
    strike: idx + 1,
    size: `${idx + 1}`,
    side: 'CALL',
    expiry: idx + 1,
    breakeven: `${idx + 1}`,
    pnl: `${idx + 1}`,
    button: {
      handleSettle: () => {},
      id: idx + 1,
      epoch: idx + 1,
      currentEpoch: idx + 1,
      expiry: idx + 1,
      canItBeSettled: false,
    },
  })),
];

export const mockExpiryData: DurationToExpiryData = {
  DAILY: {
    active: true,
    expired: false,
    strikeIncrement: 5_000000n, // 0.05 USDC increment
    maxOtmPercentage: 50n, // 50%
    strikes: [],
    strikeDeltas: {
      [900_000]: [0n, 0n, 0n],
      // ...
    },
    premium: 1000000000000000000n, // 1e18
    fees: 10000000000000000n, // 1e16
    expiry: 86400,
  },
  WEEKLY: {
    active: true,
    expired: false,
    strikeIncrement: 10_000000n, // 0.1 USDC increment
    maxOtmPercentage: 50n, // 50%
    strikes: [],
    strikeDeltas: {
      [900_000]: [0n, 0n, 0n],
      // ...
    },
    premium: 1000000000000000000n, // 1e18
    fees: 1000000000000000000n, // 1e16
    expiry: 604800,
  },
  MONTHLY: {
    active: true,
    expired: false,
    strikeIncrement: 25_000000n, // 0.2 USDC increment
    maxOtmPercentage: 50n, // 50%
    strikes: [],
    strikeDeltas: {
      [600_000]: [0n, 0n, 0n],
      // ...
    },
    premium: 1000000000000000000n, // 1e18
    fees: 1000000000000000000n, // 1e16
    expiry: 2592000, // 30 days
  },
};
