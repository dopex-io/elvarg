import { BigNumber } from 'ethers';

import { round100, round1, round1000 } from 'utils/math/rounding';

export const ASSETS_LIST = process.env.REACT_APP_ASSETS_LIST.split(',');

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
  YFI: {
    fullName: 'Yearn',
    symbol: 'YFI',
    _symbol: 'YFI',
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

export const OPTION_TYPE_NAMES = {
  0: 'Put',
  1: 'Call',
};

export const MAX_VALUE: string =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935';
export const SECONDS_IN_A_DAY: Number = 86400;

export const STRIKE_PRECISION: BigNumber = BigNumber.from(10).pow(8);

export const BLOCKED_COUNTRIES_ALPHA_2_CODES: string[] = [
  'US',
  'VI',
  'BY',
  'MM',
  'CI',
  'CU',
  'CD',
  'IR',
  'IQ',
  'LR',
  'KP',
  'SD',
  'SY',
  'ZW',
];

export const UNISWAP_LINKS: { [key: string]: string } = {
  'DPX-WETH':
    'https://app.sushi.com/add/ETH/0xEec2bE5c91ae7f8a338e1e5f3b5DE49d07AfdC81',
  'rDPX-WETH':
    'https://app.sushi.com/add/ETH/0x0ff5A8451A839f5F0BB3562689D9A44089738D11',
  DPX: 'https://app.sushi.com/swap?inputCurrency=ETH&outputCurrency=0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55',
};

export const INFURA_PROJECT_ID = process.env.REACT_APP_INFURA_PROJECT_ID;

export const GREEK_SYMBOLS = {
  delta: 'Δ',
  theta: 'θ',
  gamma: 'Γ',
  vega: 'V',
};

export const DELEGATE_INFO: string =
  'Auto exercising will charge 1% of the total P&L as fee. (This is temporary and will be reduced heavily during our final launch).';

export const BUILD: string = process.env.REACT_APP_BUILD;

export const S3_BUCKET_RESOURCES = {
  DPX: 'https://dopex-general.s3.us-east-2.amazonaws.com/image/tokens/DPX.png',
  RDPX: 'https://dopex-general.s3.us-east-2.amazonaws.com/image/tokens/rDPX.png',
};
