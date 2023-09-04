import { ethers } from 'ethers';
import { Address } from 'viem';

import {
  ClammPair,
  CollateralTokenTypes,
  UnderlyingTokenTypes,
} from 'store/Vault/clamm';

export interface ClammMarket {
  underlyingTokenSymbol: UnderlyingTokenTypes;
  collateralTokenSymbol: CollateralTokenTypes;
  underlyingTokenAddress: Address;
  collateralTokenAddress: Address;
  optionPool: Address;
  uniswapPoolAddress: Address;
}

export const positionManagerAddress =
  '0x2a9a9f63F13dD70816C456B2f2553bb648EE0F8F';

/// @TODO: checksum the addresses
export const MARKETS: Record<ClammPair, ClammMarket> = {
  'ARB-USDC': {
    underlyingTokenSymbol: 'ARB',
    collateralTokenSymbol: 'USDC',
    underlyingTokenAddress: ethers.utils.getAddress(
      '0x63a38a21f74e69f75209ae5a76dbe7f1558ab890',
    ) as Address,
    collateralTokenAddress: ethers.utils.getAddress(
      '0x50dfff781e60875d304cac5f034d3f9e275445a9',
    ) as Address,
    uniswapPoolAddress: ethers.utils.getAddress(
      '0xce0F8EfCa1Bc21Dd9AaEE6ee8F2c0F2155980bBB',
    ) as Address,
    optionPool: ethers.utils.getAddress(
      '0x090fdA0F2c26198058530A0A8cFE53362d54d9f1',
    ) as Address,
  },
};

export const FALLBACK_SLUG = '?pair=ARB-USDC';

export const MARKETS_MENU = Object.keys(MARKETS)
  .filter((token) => token !== 'USDC')
  .map((key) => ({
    textContent: `${key} - USDC`,
    isDisabled: false,
  }));
