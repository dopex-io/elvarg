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
