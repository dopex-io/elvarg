import {
  ClammPair,
  CollateralTokenTypes,
  UnderlyingTokenTypes,
} from 'store/Vault/clamm';

function splitMarketPair(pair: ClammPair = 'ARB-USDC'): {
  underlyingTokenSymbol: UnderlyingTokenTypes;
  collateralTokenSymbol: CollateralTokenTypes;
} {
  const split = pair.split('-');
  return {
    underlyingTokenSymbol: split[0] as UnderlyingTokenTypes,
    collateralTokenSymbol: split[1] as CollateralTokenTypes,
  };
}

export default splitMarketPair;
