// @todo duration N/A
import { Address } from 'viem';

export const ammDurations = ['DAILY', 'WEEKLY', 'MONTHLY'] as const;

export type AmmDuration = (typeof ammDurations)[number];

interface Vault {
  symbol: string;
  duration: AmmDuration;
  underlyingSymbol: string;
  underlyingTokenAddress: Address;
  collateralSymbol: string;
  collateralTokenAddress: Address;
  address: Address;
  lp: Address;
}

export interface OptionAmmMarket {
  vaults: Vault[];
  default: {
    duration: AmmDuration;
  };
}

export const MARKETS: { [key: string]: OptionAmmMarket } = {
  ARB: {
    vaults: [
      {
        symbol: 'ARB-USDC',
        duration: 'DAILY',
        underlyingSymbol: 'ARB',
        underlyingTokenAddress: '0x',
        collateralSymbol: 'USDC',
        collateralTokenAddress: '0x',
        lp: '0x',
        address: '0x',
      },
      {
        symbol: 'ARB-ETH',
        duration: 'WEEKLY',
        underlyingSymbol: 'ARB',
        underlyingTokenAddress: '0x',
        collateralSymbol: 'ETH',
        collateralTokenAddress: '0x',
        lp: '0x',
        address: '0x',
      },
    ],
    default: {
      duration: 'MONTHLY',
    },
  },
};

export const MARKETS_MENU = Object.values(MARKETS)
  .map((val) => {
    return val.vaults.map((key) => ({
      textContent: key.symbol,
      isDisabled: false,
    }));
  })
  .flat();
