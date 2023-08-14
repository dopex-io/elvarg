import { Address } from 'viem';

export const ssovDurations = ['WEEKLY', 'MONTHLY'] as const;

export type SsovDuration = (typeof ssovDurations)[number];

interface Vault {
  symbol: string;
  isPut: boolean;
  duration: SsovDuration;
  underlyingSymbol: string;
  address: Address;
  collateralTokenAddress: Address;
}

export interface SsovMarket {
  vaults: Vault[];
  default: {
    isPut: boolean;
    duration: SsovDuration;
  };
}
