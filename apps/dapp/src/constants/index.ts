import { BigNumber, BigNumberish, ethers } from 'ethers';

import { INFURA_PROJECT_ID, ANKR_KEY } from './env';

export const DATE_FORMAT: string = 'd LLL yy';

export const DECIMALS_TOKEN: number = 18;
export const DECIMALS_STRIKE: number = 8;
export const DECIMALS_USD: number = 6;

export const ROWS_PER_PAGE: number = 5;

export const ASC = 'asc';
export const DESC = 'desc';
export const NULL: string = '0x0000000000000000000000000000000000000000';
export const PERCENT: BigNumber = BigNumber.from(100);

export const FEE_BPS_MAP: Record<
  string,
  Record<string, Record<string, BigNumberish>>
> = {
  ATLANTICS: {
    PURCHASE_FEES: {
      fee: BigNumber.from(100000),
      maxDiscount: BigNumber.from(2500000),
    },
    FUNDING_FEES: {
      fee: BigNumber.from(100000),
      maxDiscount: BigNumber.from(0),
    },
    STRATEGY_FEES: {
      FEE: BigNumber.from(25000),
      MAX_DISCOUNT: BigNumber.from(2500000),
    },
  },
};

export const OPTION_TOKEN_DECIMALS = 18;

export const FEE_DISCOUNTS: Record<string, Record<string, BigNumberish>> = {
  // Bridgoor
  '0x4Ee9fe9500E7C4Fe849AdD9b14beEc5eC5b7d955': {
    decimals: 1,
    maxBalance: 10,
    discountBps: 250000,
  },
  // VeDPX
  '0x80789D252A288E93b01D82373d767D71a75D9F16': {
    decimals: 18,
    maxBalance: ethers.utils.parseEther('1'),
    discountBps: 100000,
  },
  // Halloweeneis
  '0x9baDE4013a7601aA1f3e9f1361a4ebE60D91B1B5': {
    decimals: 1,
    maxBalance: 1,
    discountBps: 2500000,
  },
};

export const FEE_BPS_PRECISION = 10000000;

export const CURRENCIES_MAP: { [key: string]: string } = {
  '1': 'ETH',
  '5': 'ETH',
  '42161': 'ETH',
  '56': 'BNB',
  '137': 'MATIC',
  '43114': 'AVAX',
  '1088': 'METIS',
};

export const SSOV_MAP: {
  [key: string]: {
    tokenSymbol: string;
    imageSrc: string;
    tokens: string[];
  };
} = {
  DPX: {
    tokenSymbol: 'DPX',
    imageSrc: '/images/tokens/dpx.svg',
    tokens: ['DPX'],
  },
  RDPX: {
    tokenSymbol: 'RDPX',
    imageSrc: '/images/tokens/rdpx.svg',
    tokens: ['RDPX'],
  },
  ETH: {
    tokenSymbol: 'ETH',
    imageSrc: '/images/tokens/eth.svg',
    tokens: ['WETH'],
  },
  PLS: {
    tokenSymbol: 'PLS',
    imageSrc: '/images/tokens/pls.svg',
    tokens: ['PLS'],
  },
  BNB: {
    tokenSymbol: 'BNB',
    imageSrc: '/images/tokens/bnb.svg',
    tokens: ['WBNB', 'VBNB'],
  },
  GOHM: {
    tokenSymbol: 'GOHM',
    imageSrc: '/images/tokens/gohm.svg',
    tokens: ['GOHM'],
  },
  GMX: {
    tokenSymbol: 'GMX',
    imageSrc: '/images/tokens/gmx.svg',
    tokens: ['GMX'],
  },
  AVAX: {
    tokenSymbol: 'AVAX',
    imageSrc: '/images/tokens/avax.svg',
    tokens: ['AVAX'],
  },
  BTC: {
    tokenSymbol: 'BTC',
    imageSrc: '/images/tokens/btc.svg',
    tokens: ['BTC'],
  },
  CRV: {
    tokenSymbol: 'CRV',
    imageSrc: '/images/tokens/crv.svg',
    tokens: ['CRV'],
  },
  LUNA: {
    tokenSymbol: 'LUNA',
    imageSrc: '/images/tokens/luna.svg',
    tokens: ['LUNA'],
  },
  METIS: {
    tokenSymbol: 'METIS',
    imageSrc: '/images/tokens/metis.svg',
    tokens: ['METIS'],
  },
  stETH: {
    tokenSymbol: 'stETH',
    imageSrc: '/images/tokens/wsteth.svg',
    tokens: ['wstETH'],
  },
  MATIC: {
    tokenSymbol: 'MATIC',
    imageSrc: '/images/tokens/matic.svg',
    tokens: ['MATIC'],
  },
};

export const ATLANTIC_STATS_MAPPING: { [key: string]: string } = {
  TVL: 'TVL',
  pools: 'Pools',
};
// volume: 'Volume',
export const VAULT_MAP: { [key: string]: { src: string } } = {
  'MIM3CRV-1': {
    src: '/images/tokens/mim.svg',
  },
  'MIM3CRV-2': {
    src: '/images/tokens/mim.svg',
  },
  'PUSD3CRV-3': {
    src: '/images/tokens/pusd.svg',
  },
  'PUSD3CRV-2': {
    src: '/images/tokens/pusd.svg',
  },
  'PUSD3CRV-BIWEEKLY-1': {
    src: '/images/tokens/pusd.svg',
  },
  'PUSD3CRV-BIWEEKLY-2': {
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

export const DISPLAY_TOKENS: { [key: string | number]: string[] } = {
  42161: ['DPX', 'RDPX', 'ETH'],
  56: ['BNB', 'VBNB'],
  43114: ['AVAX'],
  1088: ['METIS'],
  137: ['MATIC'],
};

export const CHAIN_ID_TO_NETWORK_DATA: {
  [key: number]: { name: string; icon: string };
} = {
  1: { name: 'Mainnet', icon: '/images/tokens/eth.svg' },
  5: { name: 'Testnet', icon: '/images/networks/arbitrum.svg' },
  42: { name: 'Kovan', icon: '/images/tokens/eth.svg' },
  56: { name: 'BSC', icon: '/images/tokens/bnb.svg' },
  42161: { name: 'Arbitrum', icon: '/images/networks/arbitrum.svg' },
  421611: { name: 'Testnet', icon: '/images/networks/arbitrum.svg' },
  421613: { name: 'Arbitrum Goerli', icon: '/images/networks/arbitrum.svg' },
  43114: { name: 'Avalanche', icon: '/images/tokens/avax.svg' },
  1088: { name: 'Metis', icon: '/images/tokens/metis.svg' },
  1337: { name: 'Localhost', icon: '/images/tokens/eth.svg' },
  137: { name: 'Polygon', icon: '/images/tokens/matic.svg' },
};

export const TOKEN_DECIMALS: {
  [key: string]: { [key: string]: number };
} = {
  '56': {
    BNB: 18,
    VBNB: 8,
  },
  '1337': {
    WETH: 18,
    USDT: 6,
    USDC: 6,
  },
  '1': {
    USDT: 6,
    USDC: 6,
  },
  '5': {
    USDT: 6,
    USDC: 6,
  },
  '421611': {
    USDT: 6,
    USDC: 6,
    WETH: 18,
  },
  '42161': {
    USDT: 6,
    USDC: 6,
    WETH: 18,
  },
  '421613': {
    USDT: 6,
    USDC: 6,
    WETH: 18,
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
  5: 'ETH',
};

export const IS_NATIVE = (asset: string) => {
  return ['ETH', 'BNB', 'AVAX'].includes(asset);
};

export const CHAIN_ID_TO_RPC: { [key: number]: string } = {
  1: `https://rpc.ankr.com/eth/${ANKR_KEY}`,
  5: `https://goerli.infura.io/v3/${INFURA_PROJECT_ID}`,
  56: `https://rpc.ankr.com/bsc/${ANKR_KEY}`,
  42161: `https://arbitrum-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
  43114: `https://rpc.ankr.com/avalanche/${ANKR_KEY}`,
  421613: `https://arbitrum-goerli.infura.io/v3/${'c088bb4e4cc643d5a0d3bb668a400685'}`,
  421611: `https://arbitrum-rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
  1088: 'https://andromeda.metis.io/?owner=1088',
  1337: 'http://127.0.0.1:8545/',
  137: `https://polygon-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
};

export const CHAIN_ID_TO_EXPLORER: { [key: number]: string } = {
  1: 'https://etherscan.io/',
  5: 'https://goerli.etherscan.io/',
  56: 'https://bscscan.com/',
  137: 'https://polygonscan.com/',
  1088: 'https://andromeda-explorer.metis.io/',
  42161: 'https://arbiscan.io/',
  43114: 'https://snowtrace.io/',
  421611: 'https://testnet.arbiscan.io/',
  421613: 'https://goerli.arbiscan.io/',
};

export const PAGE_TO_SUPPORTED_CHAIN_IDS: {
  [key: string]: { default: number; all: number[] };
} = {
  '/': { default: 42161, all: [1, 42161, 137] },
  '/farms': { default: 42161, all: [1, 42161] },
  '/nfts/community': { default: 42161, all: [1, 42161, 137] },
  '/sale': { default: 1, all: [1] },
  '/oracles': { default: 42161, all: [1, 42161, 137] },
  '/tzwap': { default: 42161, all: [1, 42161] },
  '/straddles': { default: 42161, all: [42161, 137] },
  '/straddles/MATIC': { default: 137, all: [137] },
  '/rdpx-v2/mint': { default: 421613, all: [421613] },
  '/rdpx-v2/curve-swap': { default: 421613, all: [421613] },
  '/rdpx-v2/perpetual-pools': { default: 421613, all: [421613] },
};

export const DISCLAIMER_MESSAGE = {
  english:
    'I am not the person or entities who reside in, are citizens of, are incorporated in, or have a registered office in the United States of America and OFAC restricted localities.\nI will not in the future access this site or use Dopex dApp while located within the United States or OFAC restricted localities.\nI am not using, and will not in the future use, a VPN to mask my physical location from a restricted territory.\nI am lawfully permitted to access this site and use Dopex dApp under the laws of the jurisdiction on which I reside and am located.\nI understand the risks associated with using products by Dopex.',
};

export const OFAC_COMPLIANCE_LOCAL_STORAGE_KEY =
  'DOPEX_OFAC_COMPLIANCE_SIGNATURE';

export const ADDRESS_TO_TOKEN: { [key: string]: string } = {};
