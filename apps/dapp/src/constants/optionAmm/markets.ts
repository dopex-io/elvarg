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
        address: '0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44',
        lp: '0xa85233C63b9Ee964Add6F2cffe00Fd84eb32338f',
        underlyingSymbol: 'ARB',
        underlyingTokenAddress: '0x3Aa5ebB10DC797CAC828524e59A333d0A371443c',
        collateralSymbol: 'USDC',
        collateralTokenAddress: '0x68B1D87F95878fE05B998F19b66F4baba5De1aed',
        portfolioManager: '0x4A679253410272dd5232B3Ff7cF5dbB88f295319',
        positionMinter: '0x7a2088a1bFc9d81c55368AE168C2C02570cB814F',
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
