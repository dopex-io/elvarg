import { INFURA_PROJECT_ID } from './env';

export const CHAINS: {
  [key: number]: {
    name: string;
    rpc: string;
    publicRpc: string;
    explorer: string;
    nativeToken: string;
    icon: string;
    tokenDecimals: { [key: string]: number };
    displayTokens: string[];
  };
} = {
  1: {
    name: 'Ethereum',
    rpc: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
    publicRpc: 'https://mainnet.infura.io/v3',
    explorer: 'https://etherscan.io/',
    nativeToken: 'ETH',
    icon: '/images/tokens/eth.svg',
    tokenDecimals: {
      USDT: 6,
      USDC: 6,
      WETH: 18,
    },
    displayTokens: ['ETH'],
  },
  137: {
    name: 'Polygon',
    rpc: `https://polygon-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
    publicRpc: 'https://polygon-mainnet.infura.io/v3',
    explorer: 'https://polygonscan.com/',
    nativeToken: 'MATIC',
    icon: '/images/tokens/matic.svg',
    tokenDecimals: {
      USDT: 6,
      USDC: 6,
      WETH: 18,
    },
    displayTokens: ['MATIC'],
  },
  1337: {
    name: 'Localhost',
    rpc: 'http://127.0.0.1:8545',
    publicRpc: 'http://127.0.0.1:8545',
    explorer: '',
    nativeToken: 'ETH',
    icon: '/images/tokens/eth.svg',
    tokenDecimals: {
      USDT: 6,
      USDC: 6,
      WETH: 18,
    },
    displayTokens: ['ETH'],
  },
  42161: {
    name: 'Arbitrum',
    rpc: `https://arbitrum-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
    publicRpc: 'https://arbitrum-mainnet.infura.io/v3',
    explorer: 'https://arbiscan.io/',
    nativeToken: 'ETH',
    icon: '/images/networks/arbitrum.svg',
    tokenDecimals: {
      USDT: 6,
      USDC: 6,
      WETH: 18,
    },
    displayTokens: ['ETH', 'DPX', 'RDPX'],
  },
  421613: {
    name: 'Testnet',
    rpc: `https://arbitrum-goerli.infura.io/v3/${INFURA_PROJECT_ID}`,
    publicRpc: 'https://arbitrum-goerli.infura.io/v3',
    explorer: 'https://testnet.arbiscan.io/',
    nativeToken: 'ETH',
    icon: '/images/networks/arbitrum.svg',
    tokenDecimals: {
      USDT: 6,
      USDC: 6,
      WETH: 18,
    },
    displayTokens: ['ETH'],
  },
};

export const CHAIN_PUBLIC_RPCS = Object.keys(CHAINS).reduce((acc, chainId) => {
  return {
    ...acc,
    [chainId]: CHAINS[Number(chainId)]?.publicRpc,
  };
}, {});

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
  '/ssov': { default: 42161, all: [42161, 137, 1] },
  '/portfolio': { default: 42161, all: [42161, 137] },
  '/ssov/MATIC-WEEKLY-CALLS-SSOV-V3': { default: 137, all: [137] },
  '/v2/option-amm/ARB-USDC': { default: 421613, all: [421613] },
  '/v2/clamm/ARB-USDC': { default: 421613, all: [421613] },
};
