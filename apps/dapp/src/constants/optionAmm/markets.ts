// @todo duration N/A
import { Address } from 'viem';

import { VaultState } from 'hooks/option-amm/useVaultStore';

export const ammDurations = ['DAILY', 'WEEKLY', 'MONTHLY'] as const;

export type AmmDuration = (typeof ammDurations)[number];

interface Vault {
  symbol: string;
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
    isPut: boolean;
  };
}

export const MARKETS: { [key: string]: OptionAmmMarket } = {
  ARB: {
    vaults: [
      {
        symbol: 'ARB-USDC',
        underlyingSymbol: 'ARB',
        underlyingTokenAddress: '0x',
        collateralSymbol: 'USDC',
        collateralTokenAddress: '0x',
        lp: '0x',
        address: '0x',
      },
      {
        symbol: 'ARB-ETH',
        underlyingSymbol: 'ARB',
        underlyingTokenAddress: '0x',
        collateralSymbol: 'ETH',
        collateralTokenAddress: '0x',
        lp: '0x',
        address: '0x',
      },
    ],
    default: {
      duration: 'DAILY',
      isPut: false,
    },
  },
};

export const vaultZeroState: VaultState = {
  symbol: '',
  address: '0x',
  lp: '0x',
  underlyingAddress: '0x',
  underlyingSymbol: 'UNKNOWN',
  duration: 'WEEKLY',
  isPut: false,
  collateralTokenAddress: '0x',
  collateralSymbol: '0x',
};

export const MARKETS_MENU = Object.values(MARKETS)
  .map((val) => {
    return val.vaults.map((key) => ({
      textContent: key.symbol,
      isDisabled: false,
    }));
  })
  .flat();
