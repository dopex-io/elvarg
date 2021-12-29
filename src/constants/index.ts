import { BigNumber } from 'ethers';

import { round100, round1, round1000 } from 'utils/math/rounding';

export const ASSETS_LIST = process.env.NEXT_PUBLIC_ASSETS_LIST.split(',');

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

export const SSOV_MAP = {
  DPX: {
    tokenSymbol: 'DPX',
    imageSrc: '/assets/dpx.svg',
    coinGeckoId: 'dopex',
  },
  RDPX: {
    tokenSymbol: 'rDPX',
    imageSrc: '/assets/rdpx.svg',
    coinGeckoId: 'dopex-rebate-token',
  },
  ETH: {
    tokenSymbol: 'ETH',
    imageSrc: '/assets/eth.svg',
    coinGeckoId: 'ethereum',
  },
  GOHM: {
    tokenSymbol: 'GOHM',
    imageSrc: '/assets/gohm.svg',
    coinGeckoId: 'governance-ohm',
  },
};

export const SHOWCASE_NFTS = [
  {
    src: '/showcase/dopexHideout.jpeg',
    uri: 'https://opensea.io/assets/0x495f947276749ce646f68ac8c248420045cb7b5e/61024412357358029745898008936110540827339189022866162497373623631431958790145',
    name: 'Dopex Hideout',
    horizontal: false,
  },
  {
    src: '/showcase/dopexTeam.jpg',
    uri: 'https://opensea.io/assets/0x803ef47f13a5edb8a7fa6e6705c63bba11dea6ff/1',
    name: 'Dopex Team',
    horizontal: true,
  },
  {
    src: '/showcase/theMemesterpiece.jpeg',
    uri: 'https://opensea.io/assets/0xd07dc4262bcdbf85190c01c996b4c06a461d2430/619411',
    name: 'The Memesterpiece',
    horizontal: false,
  },
  {
    src: '/showcase/dpxMafia.jpeg',
    uri: 'https://opensea.io/assets/0xd07dc4262bcdbf85190c01c996b4c06a461d2430/709255',
    name: 'DPX Mafia',
    horizontal: false,
  },
  {
    src: '/showcase/dpxMoon.jpeg',
    uri: 'https://opensea.io/assets/0xd07dc4262bcdbf85190c01c996b4c06a461d2430/660167',
    name: 'Dopex Moon',
    horizontal: true,
  },
  {
    src: '/showcase/rdpxMafia.jpeg',
    uri: 'https://opensea.io/assets/0xd07dc4262bcdbf85190c01c996b4c06a461d2430/709241',
    name: 'rDPX Mafia',
    horizontal: false,
  },
];

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
    'https://app.sushi.com/add/ETH/0x6C2C06790b3E3E3c38e12Ee22F8183b37a13EE55',
  'rDPX-WETH':
    'https://app.sushi.com/add/ETH/0x32eb7902d4134bf98a28b963d26de779af92a212',
  DPX: 'https://app.sushi.com/swap?inputCurrency=ETH&outputCurrency=0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55',
  RDPX: 'https://app.sushi.com/swap?inputCurrency=ETH&outputCurrency=0x32eb7902d4134bf98a28b963d26de779af92a212',
};

export const INFURA_PROJECT_ID = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID;

export const GREEK_SYMBOLS = {
  delta: 'Δ',
  theta: 'θ',
  gamma: 'Γ',
  vega: 'V',
};

export const DELEGATE_INFO: string =
  'Auto exercising will charge 1% of the total P&L as fee. (This is temporary and will be reduced heavily during our final launch).';

export const BUILD: string = process.env.NEXT_PUBLIC_BUILD;

export const S3_BUCKET_RESOURCES = {
  DPX: 'https://dopex-general.s3.us-east-2.amazonaws.com/image/tokens/DPX.png',
  RDPX: 'https://dopex-general.s3.us-east-2.amazonaws.com/image/tokens/rDPX.png',
};
