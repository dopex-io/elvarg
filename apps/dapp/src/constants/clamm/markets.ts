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
  // 'ARB-USDC': {
  //   underlyingTokenSymbol: 'ARB',
  //   collateralTokenSymbol: 'USDC',
  //   underlyingTokenAddress: '0x912CE59144191C1204E64559FE8253a0e49E6548',
  //   collateralTokenAddress: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
  //   uniswapPoolAddress: '0xcda53b1f66614552f834ceef361a8d12a0b8dad8',
  //   optionPools: '0x0',
  // },

  // '42069inu': {
  //   underlyingSymbol: '42069inu',
  //   collateralTokenAddress: '0x912CE59144191C1204E64559FE8253a0e49E6548',
  //   uniswapPoolAddress: undefined,
  // },
  // USDC: {
  //   underlyingSymbol: 'USDC',
  //   collateralTokenAddress: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
  //   uniswapPoolAddress: undefined,
  // },
};

export const FALLBACK_SLUG = '?pair=ARB-USDC';

export const MARKETS_MENU = Object.keys(MARKETS)
  .filter((token) => token !== 'USDC')
  .map((key) => ({
    textContent: `${key} - USDC`,
    isDisabled: false,
  }));
