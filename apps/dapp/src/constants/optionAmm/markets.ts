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

export const MARKETS: { [key: string]: OptionAmmMarket } = {
  ARB: {
    vaults: [
      {
        symbol: 'ARB-USDC',
        address: '0x1eB5C49630E08e95Ba7f139BcF4B9BA171C9a8C7',
        lp: '0x6e0a5725dD4071e46356bD974E13F35DbF9ef367',
        underlyingSymbol: 'ARB',
        underlyingTokenAddress: '0x40A633EeF249F21D95C8803b7144f19AAfeEF7ae',
        collateralSymbol: 'USDC',
        collateralTokenAddress: '0x52173b6ac069619c206b9A0e75609fC92860AB2A',
        portfolioManager: '0xA9d0Fb5837f9c42c874e16da96094b14Af0e2784',
        positionMinter: '0x6B21b3ae41f818Fc91e322b53f8D0773d31eCB75',
      },
      // {
      //   symbol: 'ARB-ETH',
      //   underlyingSymbol: 'ARB',
      //   underlyingTokenAddress: '0x21dF544947ba3E8b3c32561399E88B52Dc8b2823',
      //   collateralSymbol: 'ETH',
      //   collateralTokenAddress: '0x4C4a2f8c81640e47606d3fd77B353E87Ba015584',
      //   lp: '0x',
      //   address: '0x',
      // },
    ],
    default: {
      duration: 'DAILY',
      isPut: false,
    },
  },
};

export const vaultZeroState: VaultState = {
  isPut: false,
  duration: 'WEEKLY',
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
