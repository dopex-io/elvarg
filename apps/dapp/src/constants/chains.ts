import { DRPC_API_KEY } from './env';

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
    rpc: `https://lb.drpc.org/ogrpc?network=ethereum&dkey=${DRPC_API_KEY}`,
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
    rpc: `https://lb.drpc.org/ogrpc?network=polygon&dkey=${DRPC_API_KEY}`,
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
    rpc: `https://lb.drpc.org/ogrpc?network=arbitrum&dkey=${DRPC_API_KEY}`,
    publicRpc: 'https://arbitrum-mainnet.infura.io/v3',
    explorer: 'https://arbiscan.io/',
    nativeToken: 'ETH',
    icon: '/images/networks/arbitrum.svg',
    tokenDecimals: {
      USDT: 6,
      USDC: 6,
      WETH: 18,
      ARB: 18,
    },
    displayTokens: ['ETH', 'DPX', 'RDPX'],
  },
  5000: {
    name: 'Mantle',
    rpc: `https://lb.drpc.org/ogrpc?network=arbitrum&dkey=${DRPC_API_KEY}`,
    publicRpc: 'https://1rpc.io/mantle',
    explorer: 'https://https://explorer.mantle.xyz/',
    nativeToken: 'ETH',
    icon: '/images/networks/mantle.svg',
    tokenDecimals: {
      USDT: 6,
      USDC: 6,
      WETH: 18,
      ARB: 18,
      WMNT: 18,
    },
    displayTokens: ['ETH', 'USDC', 'WMNT', 'USDT'],
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
  '/nfts': { default: 42161, all: [1, 42161, 137] },
  '/sale': { default: 1, all: [1] },
  '/ssov': { default: 42161, all: [42161, 137, 1] },
  '/portfolio': { default: 42161, all: [42161, 137] },
  '/ssov/MATIC-WEEKLY-CALLS-SSOV-V3': { default: 137, all: [137] },
  '/clamm/WETH-USDC': { default: 42161, all: [42161, 5000] },
  '/clamm/ARB-USDC': { default: 42161, all: [42161, 5000] },
  '/clamm/WBTC-USDC': { default: 42161, all: [42161, 5000] },
  '/clamm/WMNT-USDT': { default: 5000, all: [42161, 5000] },
  '/clamm/WETH-USDT': { default: 5000, all: [42161, 5000] },
};
