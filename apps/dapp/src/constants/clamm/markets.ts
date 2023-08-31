import { ClamMarket } from 'types/clamm';

export const MARKETS: { [key: string]: ClamMarket } = {
  ARB: {
    underlyingSymbol: 'ARB',
    collateralTokenAddress: '0x912CE59144191C1204E64559FE8253a0e49E6548',
  },
  '42069inu': {
    underlyingSymbol: '42069inu',
    collateralTokenAddress: '0x912CE59144191C1204E64559FE8253a0e49E6548',
  },
  USDC: {
    underlyingSymbol: 'USDC',
    collateralTokenAddress: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
  },
};

export const FALLBACK_SLUG = '?tokenA=ARB';

export const MARKETS_MENU = Object.keys(MARKETS).map((key) => ({
  textContent: `${key} - USDC`,
  isDisabled: false,
}));
