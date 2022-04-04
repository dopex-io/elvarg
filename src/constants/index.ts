import { BigNumber } from 'ethers';

import { round100, round1, round1000 } from 'utils/math/rounding';

export const CURRENCIES_MAP = {
  '1': 'ETH',
  '42161': 'ETH',
  '56': 'BNB',
  '43114': 'AVAX',
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

export const SSOV_PUTS_MAP = {
  RDPX: {
    tokenSymbol: 'RDPX',
    imageSrc: '/assets/rdpx.svg',
    coinGeckoId: 'dopex-rebate-token',
    tokens: ['2CRV'],
  },
  GOHM: {
    tokenSymbol: 'GOHM',
    imageSrc: '/assets/gohm.svg',
    coinGeckoId: 'governance-ohm',
    tokens: ['2CRV'],
  },
  ETH: {
    tokenSymbol: 'DPX',
    imageSrc: '/assets/dpx.svg',
    coinGeckoId: 'dopex',
    tokens: ['2CRV'],
  },
  BTC: {
    tokenSymbol: 'BTC',
    imageSrc: '/assets/btc.svg',
    coiGeckoId: 'bitcoin',
    tokens: ['2CRV'],
  },
  GMX: {
    tokenSymbol: 'GMX',
    imageSrc: '/assets/gmx.svg',
    coinGeckoId: 'gmx',
    tokens: ['2CRV'],
  },
  METIS: {
    tokenSymbol: 'METIS',
    imageSrc: '/assets/metis.svg',
    coinGeckoId: 'metis',
    tokens: ['METIS'],
  },
};

export const SSOV_MAP = {
  DPX: {
    tokenSymbol: 'DPX',
    imageSrc: '/assets/dpx.svg',
    coinGeckoId: 'dopex',
    tokens: ['DPX'],
  },
  RDPX: {
    tokenSymbol: 'RDPX',
    imageSrc: '/assets/rdpx.svg',
    coinGeckoId: 'dopex-rebate-token',
    tokens: ['RDPX'],
  },
  ETH: {
    tokenSymbol: 'ETH',
    imageSrc: '/assets/eth.svg',
    coinGeckoId: 'ethereum',
    tokens: ['WETH'],
  },
  BNB: {
    tokenSymbol: 'BNB',
    imageSrc: '/assets/bnb.svg',
    coinGeckoId: 'binancecoin',
    tokens: ['WBNB', 'VBNB'],
  },
  GOHM: {
    tokenSymbol: 'GOHM',
    imageSrc: '/assets/gohm.svg',
    coinGeckoId: 'governance-ohm',
    tokens: ['GOHM'],
  },
  GMX: {
    tokenSymbol: 'GMX',
    imageSrc: '/assets/gmx.svg',
    coinGeckoId: 'gmx',
    tokens: ['GMX'],
  },
  AVAX: {
    tokenSymbol: 'AVAX',
    imageSrc: '/assets/avax.svg',
    coiGeckoId: 'avalanche-2',
    tokens: ['AVAX'],
  },
  BTC: {
    tokenSymbol: 'BTC',
    imageSrc: '/assets/btc.svg',
    coiGeckoId: 'bitcoin',
    tokens: ['BTC'],
  },
  CRV: {
    tokenSymbol: 'CRV',
    imageSrc: '/assets/curve.svg',
    coiGeckoId: 'curve-dao-token',
    tokens: ['CRV'],
  },
  LUNA: {
    tokenSymbol: 'LUNA',
    imageSrc: '/assets/luna.svg',
    coiGeckoId: 'terra-luna',
    tokens: ['LUNA'],
  },
  METIS: {
    tokenSymbol: 'METIS',
    imageSrc: '/assets/metis.svg',
    coinGeckoId: 'metis',
    tokens: ['METIS'],
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
  {
    src: 'https://lh3.googleusercontent.com/7sks-Vyw2jZiwa9CV-e4-__J0A9zXKLSTIhuwrWoV-7M6rtj12C1v-aIg7560d_n-iACiZzpJeCEh-5nupazEYg5d_lrgg05QyY_mI0=s0',
    uri: 'https://opensea.io/assets/0xb66a603f4cfe17e3d27b87a8bfcad319856518b8/30863102027102893654962906943771709949552249080103479762628255485000553594882',
    name: 'DPX Diamond Pepe Bust',
    horizontal: false,
  },
  {
    src: 'https://lh3.googleusercontent.com/R_X2nXK8Knl1ioNMVduygkCJog6sa9waLEoTUrhyvYZDSidNF0Pcex9LZ6wgbUP2G_Xvo1eMxLaxRDrWsAm7liHbmvDBGWWsNJoPKw=s0',
    uri: 'https://opensea.io/assets/0x495f947276749ce646f68ac8c248420045cb7b5e/35485684725155303981490729192961144699023552664245873084242323138241030520833/',
    name: 'The Defi Crusade',
    horizontal: false,
  },
  {
    src: 'https://lh3.googleusercontent.com/9XWC9UAKjGNsy03U1HpgWwlyPtd8mjqKK3vRtNlJ90ypDOjzacAhCo8Lr5SITR5aEhN55rAHoMaAhxC9t9XRTWMJbfmFl8SMKaxtrnw=s0',
    uri: 'https://opensea.io/assets/0x495f947276749ce646f68ac8c248420045cb7b5e/35485684725155303981490729192961144699023552664245873084242323139340542148609/',
    name: 'Symbiosis',
    horizontal: false,
  },
  {
    src: 'https://lh3.googleusercontent.com/_wGlHYfY5cOmwh5Rgqt03ak6juANI0bCjCdYBiW_6wvbxPDSI5APKgPs_wMuIZaS8i6xx7cipfYXbT0Uq9GCZAvTDI8thSjrKIc7=s0',
    uri: 'https://opensea.io/assets/0x495f947276749ce646f68ac8c248420045cb7b5e/45085975291671188684684423873928499579949724979171599992235381888671696289802',
    name: 'Dopex Bull',
    horizontal: false,
  },
  {
    src: 'https://lh3.googleusercontent.com/SJ6EdL-zgnJuQJI3VRzL3UyoMsMJL6DVNBYoM_ZZE7SXhvuQDVq_mePWob22_oEZ_4j7aKa0t9BHyK7_rEvqFmxJgx28H8QhNYjG=s0',
    uri: 'https://opensea.io/assets/0x495f947276749ce646f68ac8c248420045cb7b5e/45085975291671188684684423873928499579949724979171599992235381889771207917569',
    name: 'Dopex Bull OG',
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

export const ANKR_KEY = process.env.NEXT_PUBLIC_ANKR_KEY;

export const BSC_RPC_URL = process.env.NEXT_PUBLIC_BSC_RPC_URL;

export const AVAX_RPC_URL = process.env.NEXT_PUBLIC_AVAX_RPC_URL;

export const METIS_RPC_URL = process.env.NEXT_PUBLIC_METIS_RPC_URL;

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

export const DISPLAY_TOKENS = {
  42161: ['DPX', 'RDPX', 'ETH'],
  56: ['BNB', 'VBNB'],
  43114: ['AVAX'],
};

export const CHAIN_ID_TO_NETWORK_DATA = {
  1: { name: 'Mainnet', icon: '/assets/eth.svg' },
  42: { name: 'Kovan', icon: '/assets/eth.svg' },
  56: { name: 'BSC', icon: '/assets/bsc.svg' },
  42161: { name: 'Arbitrum', icon: '/assets/arbitrum.svg' },
  421611: { name: 'Testnet', icon: '/assets/arbitrum.svg' },
  43114: { name: 'Avalanche', icon: '/assets/avax.svg' },
  1088: { name: 'Metis', icon: '/assets/metis.svg' },
};

export const TOKEN_DECIMALS = {
  '56': {
    BNB: 18,
    VBNB: 8,
  },
  '1': {
    USDT: 6,
    USDC: 6,
  },
  '421611': {
    USDT: 6,
    USDC: 6,
  },
  '42161': {
    USDT: 6,
    USDC: 6,
  },
  '43114': {
    USDT: 6,
    USDC: 6,
  },
  '1088': {
    USDT: 6,
    USDC: 6,
  },
};
