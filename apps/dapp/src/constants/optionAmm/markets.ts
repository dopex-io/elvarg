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
        address: '0x7A443B3b8C6b017fC9Fa0Dcfa315566B48DeD2B7',
        lp: '0x24641718B39Ed76C22BfbA1eC3Aa9fE1621b8c41',
        underlyingSymbol: 'ARB',
        underlyingTokenAddress: '0x8Db611597A39075518583775f98cc389b5a11953',
        collateralSymbol: 'USDC',
        collateralTokenAddress: '0x806A5893CC00Ad8655237700a5A86D45788c2b98',
        portfolioManager: '0xFCC8528f29E74941175b1269f3707f3F8CA78031',
        positionMinter: '0x72e1699F44B8Cb04f381e791e76927b3AeEAeeA7',
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
