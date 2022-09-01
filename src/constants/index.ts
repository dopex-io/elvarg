import { BigNumber } from 'ethers';

import { INFURA_PROJECT_ID, ANKR_KEY } from './env';

export const CURRENCIES_MAP: { [key: string]: string } = {
  '1': 'ETH',
  '42161': 'ETH',
  '56': 'BNB',
  '43114': 'AVAX',
  '1088': 'METIS',
};

export const SSOV_MAP = {
  DPX: {
    tokenSymbol: 'DPX',
    imageSrc: '/images/tokens/dpx.svg',
    coinGeckoId: 'dopex',
    tokens: ['DPX'],
  },
  RDPX: {
    tokenSymbol: 'RDPX',
    imageSrc: '/images/tokens/rdpx.svg',
    coinGeckoId: 'dopex-rebate-token',
    tokens: ['RDPX'],
  },
  ETH: {
    tokenSymbol: 'ETH',
    imageSrc: '/images/tokens/eth.svg',
    coinGeckoId: 'ethereum',
    tokens: ['WETH'],
  },
  PLS: {
    tokenSymbol: 'PLS',
    imageSrc: '/images/tokens/pls.svg',
    coinGeckoId: 'plutusdao',
    tokens: ['PLS'],
  },
  BNB: {
    tokenSymbol: 'BNB',
    imageSrc: '/images/tokens/bnb.svg',
    coinGeckoId: 'binancecoin',
    tokens: ['WBNB', 'VBNB'],
  },
  GOHM: {
    tokenSymbol: 'GOHM',
    imageSrc: '/images/tokens/gohm.svg',
    coinGeckoId: 'governance-ohm',
    tokens: ['GOHM'],
  },
  GMX: {
    tokenSymbol: 'GMX',
    imageSrc: '/images/tokens/gmx.svg',
    coinGeckoId: 'gmx',
    tokens: ['GMX'],
  },
  AVAX: {
    tokenSymbol: 'AVAX',
    imageSrc: '/images/tokens/avax.svg',
    coiGeckoId: 'avalanche-2',
    tokens: ['AVAX'],
  },
  BTC: {
    tokenSymbol: 'BTC',
    imageSrc: '/images/tokens/btc.svg',
    coiGeckoId: 'bitcoin',
    tokens: ['BTC'],
  },
  CRV: {
    tokenSymbol: 'CRV',
    imageSrc: '/images/tokens/crv.svg',
    coiGeckoId: 'curve-dao-token',
    tokens: ['CRV'],
  },
  LUNA: {
    tokenSymbol: 'LUNA',
    imageSrc: '/images/tokens/luna.svg',
    coiGeckoId: 'terra-luna',
    tokens: ['LUNA'],
  },
  METIS: {
    tokenSymbol: 'METIS',
    imageSrc: '/images/tokens/metis.svg',
    coinGeckoId: 'metis',
    tokens: ['METIS'],
  },
};

export const VAULT_MAP: { [key: string]: { src: string } } = {
  'MIM3CRV-1': {
    src: '/images/tokens/mim.svg',
  },
  'MIM3CRV-2': {
    src: '/images/tokens/mim.svg',
  },
  'PUSD3CRV-1': {
    src: '/images/tokens/pusd.svg',
  },
  'PUSD3CRV-2': {
    src: '/images/tokens/pusd.svg',
  },
  'PUSD3CRV-BIWEEKLY-1': {
    src: '/images/tokens/pusd.svg',
  },
  'ETH-ATLANTIC-STRADDLE-3': {
    src: '/images/tokens/eth.svg',
  },
  'RDPX-ATLANTIC-STRADDLE-3': {
    src: '/images/tokens/rdpx.svg',
  },
};

export const SHOWCASE_NFTS = [
  {
    src: '/images/showcase/dopexHideout.jpeg',
    uri: 'https://opensea.io/images/tokens/0x495f947276749ce646f68ac8c248420045cb7b5e/61024412357358029745898008936110540827339189022866162497373623631431958790145',
    name: 'Dopex Hideout',
    horizontal: false,
  },
  {
    src: '/images/showcase/dopexTeam.jpg',
    uri: 'https://opensea.io/images/tokens/0x803ef47f13a5edb8a7fa6e6705c63bba11dea6ff/1',
    name: 'Dopex Team',
    horizontal: true,
  },
  {
    src: '/images/showcase/theMemesterpiece.jpeg',
    uri: 'https://opensea.io/images/tokens/0xd07dc4262bcdbf85190c01c996b4c06a461d2430/619411',
    name: 'The Memesterpiece',
    horizontal: false,
  },
  {
    src: '/images/showcase/dpxMafia.jpeg',
    uri: 'https://opensea.io/images/tokens/0xd07dc4262bcdbf85190c01c996b4c06a461d2430/709255',
    name: 'DPX Mafia',
    horizontal: false,
  },
  {
    src: '/images/showcase/dpxMoon.jpeg',
    uri: 'https://opensea.io/images/tokens/0xd07dc4262bcdbf85190c01c996b4c06a461d2430/660167',
    name: 'Dopex Moon',
    horizontal: true,
  },
  {
    src: '/images/showcase/rdpxMafia.jpeg',
    uri: 'https://opensea.io/images/tokens/0xd07dc4262bcdbf85190c01c996b4c06a461d2430/709241',
    name: 'rDPX Mafia',
    horizontal: false,
  },
  {
    src: 'https://lh3.googleusercontent.com/7sks-Vyw2jZiwa9CV-e4-__J0A9zXKLSTIhuwrWoV-7M6rtj12C1v-aIg7560d_n-iACiZzpJeCEh-5nupazEYg5d_lrgg05QyY_mI0=s0',
    uri: 'https://opensea.io/images/tokens/0xb66a603f4cfe17e3d27b87a8bfcad319856518b8/30863102027102893654962906943771709949552249080103479762628255485000553594882',
    name: 'DPX Diamond Pepe Bust',
    horizontal: false,
  },
  {
    src: 'https://lh3.googleusercontent.com/R_X2nXK8Knl1ioNMVduygkCJog6sa9waLEoTUrhyvYZDSidNF0Pcex9LZ6wgbUP2G_Xvo1eMxLaxRDrWsAm7liHbmvDBGWWsNJoPKw=s0',
    uri: 'https://opensea.io/images/tokens/0x495f947276749ce646f68ac8c248420045cb7b5e/35485684725155303981490729192961144699023552664245873084242323138241030520833/',
    name: 'The Defi Crusade',
    horizontal: false,
  },
  {
    src: 'https://lh3.googleusercontent.com/9XWC9UAKjGNsy03U1HpgWwlyPtd8mjqKK3vRtNlJ90ypDOjzacAhCo8Lr5SITR5aEhN55rAHoMaAhxC9t9XRTWMJbfmFl8SMKaxtrnw=s0',
    uri: 'https://opensea.io/images/tokens/0x495f947276749ce646f68ac8c248420045cb7b5e/35485684725155303981490729192961144699023552664245873084242323139340542148609/',
    name: 'Symbiosis',
    horizontal: false,
  },
  {
    src: 'https://lh3.googleusercontent.com/_wGlHYfY5cOmwh5Rgqt03ak6juANI0bCjCdYBiW_6wvbxPDSI5APKgPs_wMuIZaS8i6xx7cipfYXbT0Uq9GCZAvTDI8thSjrKIc7=s0',
    uri: 'https://opensea.io/images/tokens/0x495f947276749ce646f68ac8c248420045cb7b5e/45085975291671188684684423873928499579949724979171599992235381888671696289802',
    name: 'Dopex Bull',
    horizontal: false,
  },
  {
    src: 'https://lh3.googleusercontent.com/SJ6EdL-zgnJuQJI3VRzL3UyoMsMJL6DVNBYoM_ZZE7SXhvuQDVq_mePWob22_oEZ_4j7aKa0t9BHyK7_rEvqFmxJgx28H8QhNYjG=s0',
    uri: 'https://opensea.io/images/tokens/0x495f947276749ce646f68ac8c248420045cb7b5e/45085975291671188684684423873928499579949724979171599992235381889771207917569',
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

export const GREEK_SYMBOLS = {
  delta: 'Δ',
  theta: 'θ',
  gamma: 'Γ',
  vega: 'V',
};

export const DELEGATE_INFO: string =
  'Auto exercising will charge 1% of the total P&L as fee. (This is temporary and will be reduced heavily during our final launch).';

export const S3_BUCKET_RESOURCES = {
  DPX: 'https://dopex-general.s3.us-east-2.amazonaws.com/image/tokens/DPX.png',
  RDPX: 'https://dopex-general.s3.us-east-2.amazonaws.com/image/tokens/rDPX.png',
};

export const DISPLAY_TOKENS = {
  42161: ['DPX', 'RDPX', 'ETH'],
  56: ['BNB', 'VBNB'],
  43114: ['AVAX'],
  1088: ['METIS'],
};

export const CHAIN_ID_TO_NETWORK_DATA: {
  [key: number]: { name: string; icon: string };
} = {
  1: { name: 'Mainnet', icon: '/images/tokens/eth.svg' },
  42: { name: 'Kovan', icon: '/images/tokens/eth.svg' },
  56: { name: 'BSC', icon: '/images/tokens/bnb.svg' },
  42161: { name: 'Arbitrum', icon: '/images/networks/arbitrum.svg' },
  421611: { name: 'Testnet', icon: '/images/networks/arbitrum.svg' },
  43114: { name: 'Avalanche', icon: '/images/tokens/avax.svg' },
  1088: { name: 'Metis', icon: '/images/tokens/metis.svg' },
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

export const CHAIN_ID_TO_NATIVE: { [key: number]: number | string } = {
  42161: 'ETH',
  56: 'BNB',
  43114: 'AVAX',
  1: 'ETH',
};

export const IS_NATIVE = (asset: string) => {
  return ['ETH', 'BNB', 'AVAX'].includes(asset);
};

export const DOPEX_API_BASE_URL = 'https://api.dopex.io/api';

export const CHAIN_ID_TO_RPC: { [key: number]: string } = {
  1: `https://rpc.ankr.com/eth/${ANKR_KEY}`,
  56: `https://rpc.ankr.com/bsc/${ANKR_KEY}`,
  42161: `https://arbitrum-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
  43114: `https://rpc.ankr.com/avalanche/${ANKR_KEY}`,
  421611: `https://arbitrum-rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
  1088: 'https://andromeda.metis.io/?owner=1088',
  1337: 'http://127.0.0.1:8545',
};

export const CHAIN_ID_TO_EXPLORER: { [key: number]: string } = {
  1: 'https://etherscan.io/',
  56: 'https://bscscan.com/',
  42161: 'https://arbiscan.io/',
  43114: 'https://snowtrace.io/',
  1088: 'https://andromeda-explorer.metis.io/',
};

export const PAGE_TO_SUPPORTED_CHAIN_IDS: {
  [key: string]: { default: number; all: number[] };
} = {
  '/': { default: 42161, all: [1, 42161, 43114, 56] },
  '/governance/vedpx': { default: 42161, all: [42161] },
  '/farms': { default: 42161, all: [1, 42161] },
  '/ssov': { default: 42161, all: [42161, 56, 43114, 1088] },
  '/ssov/call/BNB': { default: 56, all: [56] },
  '/ssov/call/AVAX': { default: 43114, all: [43114] },
  '/nfts/community': { default: 42161, all: [] },
  '/nfts/diamondpepes2': { default: 42161, all: [1, 42161] },
  '/sale': { default: 1, all: [1] },
  '/oracles': { default: 42161, all: [] },
  '/tzwap': { default: 42161, all: [1, 42161] },
  '/ssov-v3/Metis-MONTHLY-CALLS-SSOV-V3': { default: 1088, all: [1088] },
  '/ir/MIM3CRV-1': { default: 42161, all: [42161] },
  '/ir/MIM3CRV-2': { default: 42161, all: [42161] },
  '/ir/PUSD3CRV': { default: 42161, all: [42161] },
  '/ir': { default: 42161, all: [42161] },
  '/straddles': { default: 42161, all: [42161] },
  '/straddles/ETH': { default: 42161, all: [42161] },
  '/straddles/RDPX': { default: 42161, all: [42161] },
};

export const ADDRESS_TO_TOKEN: { [key: string]: string } = {};
