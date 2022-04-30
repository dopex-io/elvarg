export const PRICE_INCREMENTS: {
  [key: string]: { getBasePrice: Function; increment: number };
} = {
  WETH: {
    getBasePrice: round100,
    increment: 100,
  },
  WBTC: {
    getBasePrice: round1000,
    increment: 1000,
  },
  LINK: {
    getBasePrice: round1,
    increment: 1,
  },
  YFI: {
    getBasePrice: round100,
    increment: 250,
  },
};

export const STAT_NAMES = {
  transfer: {
    strike: 'Strike Price',
    expiry: 'Expiry',
    amount: 'Balance',
  },
  exercise: {
    strike: 'Strike Price',
    price: 'Asset Price',
    pnl: 'P&L',
    expiry: 'Expiry',
    amount: 'Amount',
  },
  swap: {
    strike: 'Strike Price',
    price: 'Asset Price',
    pnl: 'P&L',
    expiry: 'Expiry',
  },
  new_swap: {
    strike: 'New Strike Price',
    price: 'Asset Price',
    pnl: 'New P&L',
    expiry: 'New Expiry',
  },
};

export const BASE_ASSET_MAP = {
  WETH: {
    fullName: 'Ethereum',
    symbol: 'ETH',
    _symbol: 'WETH',
  },
  WBTC: {
    fullName: 'Bitcoin',
    symbol: 'BTC',
    _symbol: 'WBTC',
  },
  LINK: {
    fullName: 'Chainlink',
    symbol: 'LINK',
    _symbol: 'LINK',
  },
  GOHM: {
    fullName: 'Governance OHM',
    symbol: 'GOHM',
    _symbol: 'GOHM',
  },
  BNB: {
    fullName: 'Binance Coin',
    symbol: 'BNB',
    _symbol: 'BNB',
  },
  VBNB: {
    fullName: 'Venus BNB',
    symbol: 'VBNB',
    _symbol: 'VBNB',
  },
  YFI: {
    fullName: 'Yearn',
    symbol: 'YFI',
    _symbol: 'YFI',
  },
  AVAX: {
    fullName: 'AVAX',
    symbol: 'AVAX',
    _symbol: 'AVAX',
  },
  METIS: {
    fullName: 'Metis DAO',
    symbol: 'METIS',
    _symbol: 'METIS',
  },
  CRV: {
    fullName: 'CRV',
    symbol: 'CRV',
    _symbol: 'CRV',
  },
};

export const QUOTE_ASSET_MAP = {
  USDT: {
    fullName: 'Tether',
    symbol: 'USDT',
    _symbol: 'USDT',
    price: '1',
  },
};
