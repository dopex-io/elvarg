import { BigNumber } from 'ethers';

export const STRATEGY_FEE = 25000;
export const FEE_BPS_PRECISION = 10000000;

export function getEligiblePutStrike(
  liquidationPrice: BigNumber,
  tickSize: BigNumber
) {
  const noise = liquidationPrice.mod(tickSize);
  let putStrike = liquidationPrice.sub(noise);
  if (putStrike.lt(liquidationPrice)) {
    putStrike = putStrike.add(tickSize);
  }
  return putStrike;
}

export function getStrategyFee(sizeUsd: BigNumber) {
  const withFee = sizeUsd
    .mul(FEE_BPS_PRECISION + STRATEGY_FEE)
    .div(FEE_BPS_PRECISION);
  return withFee.sub(sizeUsd);
}
