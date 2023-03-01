import { INFURA_PROJECT_ID } from './env';

export const CHAINS: {
  [key: number]: {
    name: string;
    rpc: string;
    publicRpc: string;
    explorer: string;
    nativeToken: string;
    icon: string;
  };
} = {
  1: {
    rpc: `https://mainnet.infura.io/v3${INFURA_PROJECT_ID}`,
    publicRpc: 'https://mainnet.infura.io/v3',
    explorer: 'https://etherscan.io/',
    nativeToken: 'ETH',
    name: 'Ethereum',
    icon: 'images/tokens/eth.svg',
  },
  137: {
    rpc: `https://polygon-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
    publicRpc: 'https://polygon-mainnet.infura.io/v3',
    explorer: 'https://polygonscan.com/',
    nativeToken: 'MATIC',
    name: 'Polygon',
    icon: 'images/tokens/matic.svg',
  },
  1337: {
    rpc: 'http://127.0.0.1:8545',
    publicRpc: 'http://127.0.0.1:8545',
    explorer: '',
    nativeToken: 'ETH',
    name: 'Localhost',
    icon: 'images/tokens/eth.svg',
  },
  42161: {
    rpc: `https://arbitrum-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
    publicRpc: 'https://arbitrum-mainnet.infura.io/v3',
    explorer: 'https://arbiscan.io/',
    nativeToken: 'ETH',
    name: 'Arbitrum',
    icon: 'images/networks/arbitrum.svg',
  },
  421613: {
    rpc: `https://arbitrum-goerli.infura.io/v3/${INFURA_PROJECT_ID}`,
    publicRpc: 'https://arbitrum-goerli.infura.io/v3',
    explorer: 'https://testnet.arbiscan.io/',
    nativeToken: 'ETH',
    name: 'Testnet',
    icon: 'images/networks/arbitrum.svg',
  },
};

export const CHAIN_RPCS = Object.keys(CHAINS).reduce((acc, chainId) => {
  return {
    ...acc,
    [chainId]: CHAINS[Number(chainId)]?.rpc,
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
  '/ssov': { default: 42161, all: [42161, 137] },
  '/ssov/MATIC-WEEKLY-CALLS-SSOV-V3': { default: 137, all: [137] },
};
