export const DECIMALS_TOKEN: number = 18;
export const DECIMALS_STRIKE: number = 8;
export const DECIMALS_USD: number = 6;

export const ZERO_ADDRESS: string =
  '0x0000000000000000000000000000000000000000';

export const OPTION_TOKEN_DECIMALS = 18;

export const CURRENCIES_MAP: { [key: string]: string } = {
  '1': 'ETH',
  '5': 'ETH',
  '42161': 'ETH',
  '56': 'BNB',
  '137': 'MATIC',
  '43114': 'AVAX',
  '1088': 'METIS',
};

export const MAX_VALUE: string =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935';

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
  '/rdpx-v2/mint': { default: 421613, all: [421613, 1337] },
  '/rdpx-v2/swap': { default: 421613, all: [421613] },
  '/rdpx-v2/perpetual-pools': { default: 421613, all: [421613, 1337] },
};

export const DISCLAIMER_MESSAGE = {
  english:
    'I am not the person or entities who reside in, are citizens of, are incorporated in, or have a registered office in the United States of America and OFAC restricted localities.\nI will not in the future access this site or use Dopex dApp while located within the United States and OFAC restricted localities.\nI am not using, and will not in the future use, a VPN to mask my physical location from a restricted territory.\nI am lawfully permitted to access this site and use Dopex dApp under the laws of the jurisdiction on which I reside and am located.\nI understand the risks associated with using products by Dopex.',
};

export const OFAC_COMPLIANCE_LOCAL_STORAGE_KEY =
  'DOPEX_OFAC_COMPLIANCE_SIGNATURE';
