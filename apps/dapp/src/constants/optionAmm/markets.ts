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
        address: '0xd038A2EE73b64F30d65802Ad188F27921656f28F',
        lp: '0x666432Ccb747B2220875cE185f487Ed53677faC9',
        underlyingSymbol: 'ARB',
        underlyingTokenAddress: '0x398E4948e373Db819606A459456176D31C3B1F91',
        collateralSymbol: 'USDC',
        collateralTokenAddress: '0xFCFE742e19790Dd67a627875ef8b45F17DB1DaC6',
        portfolioManager: '0xeC1BB74f5799811c0c1Bff94Ef76Fb40abccbE4a',
        positionMinter: '0xF6a8aD553b265405526030c2102fda2bDcdDC177',
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
