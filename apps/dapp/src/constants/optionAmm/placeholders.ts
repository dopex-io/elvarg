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
  {
    strike: 0,
    size: '0',
    side: '0',
    expiry: 0,
    breakeven: '0',
    pnl: '0',
    button: {
      handleSettle: () => {},
      id: 0,
      epoch: 0,
      currentEpoch: 0,
      expiry: 0,
      canItBeSettled: false,
    },
  },
];
export const shorts = [
  {
    strike: 0,
    size: '0',
    side: '0',
    expiry: 0,
    breakeven: '0',
    pnl: '0',
    button: {
      handleSettle: () => {},
      id: 0,
      epoch: 0,
      currentEpoch: 0,
      expiry: 0,
      canItBeSettled: false,
    },
  },
  {
    strike: 1,
    size: '0',
    side: '0',
    expiry: 0,
    breakeven: '0',
    pnl: '0',
    button: {
      handleSettle: () => {},
      id: 0,
      epoch: 0,
      currentEpoch: 0,
      expiry: 0,
      canItBeSettled: false,
    },
  },
];

export const strikesPlaceholder = [
  {
    strike: 1500,
    breakeven: '1510',
    availableCollateral: {
      strike: 1500,
      totalAvailableCollateral: 1500,
    },
    button: {
      index: 0,
      base: 'ARB',
      premiumPerOption: 10n,
      handleSelection: (_: any) => {},
    },
    disclosure: {
      apy: 54.21,
      delta: -0.9,
      gamma: 0.48,
      iv: 94,
      premiumApy: 17.5,
      theta: -0.00058,
      tvl: 172864.5,
      utilization: 100,
      vega: 0.0000362,
    },
  },
  {
    strike: 1600,
    breakeven: '1610',
    availableCollateral: {
      strike: 1500,
      totalAvailableCollateral: 1500,
    },
    button: {
      index: 1,
      base: 'ARB',
      premiumPerOption: 10n,
      handleSelection: (_: any) => {},
    },
    disclosure: {
      apy: 54.21,
      delta: -0.9,
      gamma: 0.48,
      iv: 95,
      premiumApy: 17.5,
      theta: -0.00058,
      tvl: 172864.5,
      utilization: 100,
      vega: 0.0000362,
    },
  },
  {
    strike: 1700,
    breakeven: '1710',
    availableCollateral: {
      strike: 1500,
      totalAvailableCollateral: 1500,
    },
    button: {
      index: 2,
      base: 'ARB',
      premiumPerOption: 10n ^ 18n,
      handleSelection: (_: any) => {},
    },
    disclosure: {
      apy: 54.21,
      delta: -0.9,
      gamma: 0.48,
      iv: 96,
      premiumApy: 17.5,
      theta: -0.00058,
      tvl: 172864.5,
      utilization: 100,
      vega: 0.0000362,
    },
  },
  {
    strike: 1800,
    breakeven: '1810',
    availableCollateral: {
      strike: 1500,
      totalAvailableCollateral: 1500,
    },
    button: {
      index: 3,
      base: 'ARB',
      premiumPerOption: 10n,
      handleSelection: (_: any) => {},
    },
    disclosure: {
      apy: 54.21,
      delta: -0.9,
      gamma: 0.48,
      iv: 97,
      premiumApy: 17.5,
      theta: -0.00058,
      tvl: 172864.5,
      utilization: 100,
      vega: 0.0000362,
    },
  },
];
