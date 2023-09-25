import { Address } from 'viem';

export const CLAMM_UNDERLYING_TOKENS_LIST = [
  { textContent: 'ARB', disabled: false },
];
export const CLAMM_COLLATERAL_TOKENS_LIST = [
  { textContent: 'USDC', disabled: false },
];

export const VALID_CLAMM_PAIRS = ['ARB-USDC'];

type PairToAddress = {
  underlyingTokenAddress: Address;
  collateralTokenAddress: Address;
  optionsPoolAddress: Address;
  uniswapV3PoolAddress: Address;
};

export const CLAMM_PAIRS_TO_ADDRESSES: Record<string, PairToAddress> = {
  // 'ARB-USDC': {
  //   underlyingTokenAddress: '0x63A38A21F74E69F75209ae5a76DbE7f1558AB890',
  //   collateralTokenAddress: '0x50DfFf781E60875d304Cac5f034d3F9E275445A9',
  //   optionsPoolAddress: '0x090fdA0F2c26198058530A0A8cFE53362d54d9f1',
  //   uniswapV3PoolAddress: '0xce0F8EfCa1Bc21Dd9AaEE6ee8F2c0F2155980bBB',
  // },
  'ARB-USDC': {
    underlyingTokenAddress: '0x912CE59144191C1204E64559FE8253a0e49E6548',
    collateralTokenAddress: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
    optionsPoolAddress: '0x88C78f6F674Ed711EEbDE15d8b090dec44C590b4',
    uniswapV3PoolAddress: '0xcDa53B1F66614552F834cEeF361A8D12a0B8DaD8',
  },
};

export const EXPIRIES: { [key: string]: number } = {
  '20m': 20 * 60,
  '1h': 60 * 60,
  '2h': 2 * 60 * 60,
  '6h': 6 * 60 * 60,
  '12h': 12 * 60 * 60,
  '24h': 24 * 60 * 60,
};

export const EXPIRIES_TO_KEY: { [key: number]: string } = {
  [20 * 60]: '20m',
  [60 * 60]: '1h',
  [2 * 60 * 60]: '2h',
  [6 * 60 * 60]: '6h',
  [12 * 60 * 60]: '12h',
  [24 * 60 * 60]: '24h',
};

export const EXPIRIES_MENU = Object.keys(EXPIRIES);
export const EXPIRIES_BY_INDEX = Object.values(EXPIRIES);
