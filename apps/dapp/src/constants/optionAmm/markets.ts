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
        address: '0x51A1ceB83B83F1985a81C295d1fF28Afef186E02',
        lp: '0x36b58F5C1969B7b6591D752ea6F5486D069010AB',
        underlyingSymbol: 'ARB',
        underlyingTokenAddress: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
        collateralSymbol: 'USDC',
        collateralTokenAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
        portfolioManager: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
        positionMinter: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
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
