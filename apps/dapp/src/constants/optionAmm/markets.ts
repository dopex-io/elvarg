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
        address: '0xf29783976c4DA24AD53Ea259Aa23865A305c9C76',
        lp: '0x7f7bd2A2fFeD309034D5C219deD74355F4314D18',
        underlyingSymbol: 'ARB',
        underlyingTokenAddress: '0x7Ca50C95B7db5D08DFe7586D29841f3Ec1Ff55FA',
        collateralSymbol: 'USDC',
        collateralTokenAddress: '0xe1C8b19262fF2FB661957CC2280F242a02a64f4E',
        portfolioManager: '0x53070153e439423Bd8d4249d2ab9584428aAffBf',
        positionMinter: '0x5077B887aE9fED6F009f8144aa5FF26A086D8939',
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
