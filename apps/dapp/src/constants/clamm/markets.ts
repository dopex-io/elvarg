import { Address } from 'viem';

import {
  ClammPair,
  CollateralTokenTypes,
  UnderlyingTokenTypes,
} from 'store/Vault/clamm';

export interface ClammMarket {
  underlyingTokenSymbol: UnderlyingTokenTypes;
  collateralTokenSymbol: CollateralTokenTypes;
  underlyingTokenAddress: Address;
  collateralTokenAddress: Address;
  optionPools: ''; // Will update when contract is deployed
  uniswapPoolAddress: Address;
}

export const MARKETS: Record<ClammPair, ClammMarket> = {
  'ARB-USDC': {
    underlyingTokenSymbol: 'ARB',
    collateralTokenSymbol: 'USDC',
    underlyingTokenAddress: '0x912CE59144191C1204E64559FE8253a0e49E6548',
    collateralTokenAddress: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
    uniswapPoolAddress: '0xcda53b1f66614552f834ceef361a8d12a0b8dad8',
    optionPools: '',
  },
  // '42069inu': {
  //   underlyingSymbol: '42069inu',
  //   collateralTokenAddress: '0x912CE59144191C1204E64559FE8253a0e49E6548',
  //   uniswapPoolAddress: undefined,
  // },
  // USDC: {
  //   underlyingSymbol: 'USDC',
  //   collateralTokenAddress: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
  //   uniswapPoolAddress: undefined,
  // },
};

export const FALLBACK_SLUG = '?pair=ARB-USDC';

export const MARKETS_MENU = Object.keys(MARKETS)
  .filter((token) => token !== 'USDC')
  .map((key) => ({
    textContent: `${key} - USDC`,
    isDisabled: false,
  }));
