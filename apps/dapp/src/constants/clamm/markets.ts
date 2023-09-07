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

// export const ARB_USDC_UNISWAP_POOL_ADDRESS =
//   '0x6551Be4EE5A600576a356bBdc5e43ACa35B5e9D9' as Address;
export const ARB_USDC_UNISWAP_POOL_ADDRESS =
  '0x090fdA0F2c26198058530A0A8cFE53362d54d9f1' as Address;

/// @TODO: checksum the addresses
export const MARKETS: Record<ClammPair, ClammMarket> = {
  'ARB-USDC': {
    underlyingTokenSymbol: 'ARB',
    collateralTokenSymbol: 'USDC',
    underlyingTokenAddress: ethers.utils.getAddress(
      '0x63A38A21F74E69F75209ae5a76DbE7f1558AB890',
    ) as Address,
    collateralTokenAddress: ethers.utils.getAddress(
      '0x50DfFf781E60875d304Cac5f034d3F9E275445A9',
    ) as Address,
    uniswapPoolAddress: ethers.utils.getAddress(
      '0xce0F8EfCa1Bc21Dd9AaEE6ee8F2c0F2155980bBB',
    ) as Address,
    optionPool: ethers.utils.getAddress(
      ARB_USDC_UNISWAP_POOL_ADDRESS,
    ) as Address,
  },
};

export const FALLBACK_SLUG = '?pair=ARB-USDC';

export const MARKETS_MENU = Object.keys(MARKETS).map((key) => ({
  textContent: key,
  isDisabled: false,
}));
