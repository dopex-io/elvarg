// @todo duration N/A
import { Address } from 'viem';

export const ammDurations = ['DAILY', 'WEEKLY', 'MONTHLY'] as const;

export type AmmDuration = (typeof ammDurations)[number];

interface Vault {
  symbol: string;
  duration: AmmDuration;
  underlyingSymbol: string;
  address: Address;
  lp: Address;
  collateralTokenAddress: Address;
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
        collateralTokenAddress: '0x',
        lp: '0x',
        address: '0x',
      },
      {
        symbol: 'ARB-USDC',
        duration: 'WEEKLY',
        underlyingSymbol: 'ARB',
        collateralTokenAddress: '0x',
        lp: '0x',
        address: '0x',
      },
      {
        symbol: 'ARB-USDC',
        duration: 'MONTHLY',
        underlyingSymbol: 'ARB',
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
