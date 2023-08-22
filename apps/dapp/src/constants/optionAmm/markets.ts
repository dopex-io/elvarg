// @todo duration N/A
import { Address } from 'viem';

export const ammDurations = ['WEEKLY', 'MONTHLY'] as const;

export type AmmDuration = (typeof ammDurations)[number];

interface Vault {
  symbol: string;
  duration: AmmDuration;
  underlyingSymbol: string;
  address: Address;
  collateralTokenAddress: Address;
}

export interface OptionAmmMarket {
  vaults: Vault[];
  default: {
    duration: AmmDuration;
  };
}

export const MARKETS: { [key: string]: OptionAmmMarket } = {
  ETH: {
    vaults: [
      {
        symbol: 'ETH-USDC',
        duration: 'WEEKLY',
        underlyingSymbol: 'ETH',
        collateralTokenAddress: '0x',
        address: '0x',
      },
      {
        symbol: 'ETH-ARB',
        duration: 'WEEKLY',
        underlyingSymbol: 'ETH',
        collateralTokenAddress: '0x',
        address: '0x',
      },
    ],
    default: {
      duration: 'WEEKLY',
    },
  },
  ARB: {
    vaults: [
      {
        symbol: 'ARB-USDC',
        duration: 'MONTHLY',
        underlyingSymbol: 'ARB',
        collateralTokenAddress: '0x',
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
