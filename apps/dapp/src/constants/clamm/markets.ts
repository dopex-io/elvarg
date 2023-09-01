import { Address } from 'viem';

interface ClamMarket {
  underlyingSymbol: string;
  collateralTokenAddress: Address;
  uniswapPoolAddress: Address | undefined;
}

export const MARKETS: { [key: string]: ClamMarket } = {
  ARB: {
    underlyingSymbol: 'ARB',
    collateralTokenAddress: '0x912CE59144191C1204E64559FE8253a0e49E6548',
    uniswapPoolAddress: '0xcda53b1f66614552f834ceef361a8d12a0b8dad8',
  },
  '42069inu': {
    underlyingSymbol: '42069inu',
    collateralTokenAddress: '0x912CE59144191C1204E64559FE8253a0e49E6548',
    uniswapPoolAddress: undefined,
  },
  USDC: {
    underlyingSymbol: 'USDC',
    collateralTokenAddress: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
    uniswapPoolAddress: undefined,
  },
};

export const FALLBACK_SLUG = '?tokenA=ARB';

export const MARKETS_MENU = Object.keys(MARKETS)
  .filter((token) => token !== 'USDC')
  .map((key) => ({
    textContent: `${key} - USDC`,
    isDisabled: false,
  }));
