import { BigNumber } from 'ethers';

import getContractReadableAmount from '../getContractReadableAmount';

export const SWAP_FEE_BASIS_POINTS = 40;
export const MARGIN_FEE_BASIS_POINTS = 10;
export const BASIS_POINTS_DIVISOR = 10000;
export const USD_PRECISION = getContractReadableAmount(1, 30);
export const LIQUIDATION_FEE_USD = getContractReadableAmount(5, 30);
export const USD_DECIMALS = 30;

export function tokenToUsdMin(
  tokenMinPrice: BigNumber,
  tokenAmount: BigNumber,
  tokenDecimals: number
) {
  if (tokenMinPrice.isZero() || tokenAmount.isZero() || !tokenDecimals)
    return BigNumber.from(0);

  return tokenMinPrice
    .mul(tokenAmount)
    .div(getContractReadableAmount(1, tokenDecimals));
}

export function getSwapFees(
  fromTokenMinPrice: BigNumber,
  toTokenMaxPrice: BigNumber,
  fromTokenAmount: BigNumber,
  fromTokenDecimals: number,
  toTokenDecimals: number
) {
  const usdAmount = tokenToUsdMin(
    fromTokenMinPrice,
    fromTokenAmount,
    fromTokenDecimals
  );

  const amountOut = usdAmount
    .mul(getContractReadableAmount(1, toTokenDecimals))
    .div(toTokenMaxPrice);

  const amountUsd = amountOut
    .mul(toTokenMaxPrice)
    .div(getContractReadableAmount(1, toTokenDecimals));

  return usdToTokenMin(
    fromTokenMinPrice,
    amountUsd
      .mul(BigNumber.from(BASIS_POINTS_DIVISOR).add(SWAP_FEE_BASIS_POINTS))
      .div(BASIS_POINTS_DIVISOR)
      .sub(amountUsd),
    fromTokenDecimals
  );
}

export function getPositionFee(sizeUsd: BigNumber) {
  return sizeUsd.mul(MARGIN_FEE_BASIS_POINTS).div(BASIS_POINTS_DIVISOR);
}

export function usdToTokenMin(
  tokenMinPrice: BigNumber,
  usdAmount: BigNumber,
  tokenDecimals: number
) {
  if (tokenMinPrice.isZero() || usdAmount.isZero() || !tokenDecimals)
    return BigNumber.from(0);
  return usdAmount
    .mul(getContractReadableAmount(1, tokenDecimals))
    .div(tokenMinPrice);
}
