// @todo duration N/A
import { Address } from 'viem';

import { VaultState } from 'hooks/option-amm/useVaultStore';

export const ammDurations = ['DAILY', 'WEEKLY', 'MONTHLY'] as const;

export type AmmDuration = (typeof ammDurations)[number];

interface Vault {
  symbol: string;
  address: Address;
  lp: Address;
  underlyingSymbol: string;
  underlyingTokenAddress: Address;
  collateralSymbol: string;
  collateralTokenAddress: Address;
  portfolioManager: Address;
  positionMinter: Address;
}

export interface OptionAmmMarket {
  vaults: Vault[];
  default: {
    duration: AmmDuration;
    isPut: boolean;
  };
}

// arbitrum goerli
export const MARKETS: { [key: string]: OptionAmmMarket } = {
  ARB: {
    vaults: [
      {
        symbol: 'ARB-USDC',
        address: '0xC3fabaFf137934DcC990154B597208b706Aaa40B',
        lp: '0xE641891e7FF553C3f1a886cd1F0BD4BCa5b01f96',
        underlyingSymbol: 'ARB',
        underlyingTokenAddress: '0x7Ca50C95B7db5D08DFe7586D29841f3Ec1Ff55FA',
        collateralSymbol: 'USDC',
        collateralTokenAddress: '0xe1C8b19262fF2FB661957CC2280F242a02a64f4E',
        portfolioManager: '0x578943308C8ee7163c0785777BDC7A3bc13D2edd',
        positionMinter: '0x4B6D07D54ecA170525A661a3aA7Bfb61FC0D05F5',
      },
    ],
    default: {
      duration: 'DAILY',
      isPut: false,
    },
  },
};

export const vaultZeroState: VaultState = {
  isPut: false,
  duration: 'DAILY',
  symbol: '',
  address: '0x',
  lp: '0x',
  underlyingSymbol: 'UNKNOWN',
  underlyingTokenAddress: '0x',
  collateralSymbol: 'UNKNOWN',
  collateralTokenAddress: '0x',
  portfolioManager: '0x',
  positionMinter: '0x',
};

export const MARKETS_MENU = Object.values(MARKETS)
  .map((val) => {
    return val.vaults.map((key) => ({
      textContent: key.symbol,
      isDisabled: false,
    }));
  })
  .flat();
