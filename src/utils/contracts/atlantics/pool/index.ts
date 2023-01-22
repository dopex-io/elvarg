import { BigNumber } from 'ethers';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';

export const FUNDING_RATE = 5000;
export const FUNDING_INTERVAL = 86400;
export const FEE_PRECISION = 10000000;
export const OPTIONS_TOKEN_DECIMALS = 18;
export const STRIKE_DECIMALS = 8;
export const PURCHASE_FEE_BPS = 100000;

export const discountsMapping = [
  {
    maxDiscount: 250000,
    discountPerToken: 0,
  },
];
export function getPurchaseFees(
  currentPrice: BigNumber,
  strike: BigNumber,
  amount: BigNumber,
  collateralTokenDecimals: number
) {
  let finalFee = amount
    .mul(BigNumber.from(FEE_PRECISION).add(PURCHASE_FEE_BPS))
    .div(FEE_PRECISION)
    .sub(amount);

  finalFee = finalFee.div(
    getContractReadableAmount(
      1,
      OPTIONS_TOKEN_DECIMALS - collateralTokenDecimals
    )
  );

  if (currentPrice.lt(strike)) {
    const feeMultiplier = strike.mul(100).div(currentPrice).sub(100);

    finalFee = feeMultiplier.mul(finalFee).div(100);
  }

  return finalFee;
}

export function getFundingFees(
  collateralAccess: BigNumber,
  currentTimestamp: BigNumber,
  expiry: BigNumber
) {
  console.log(expiry.toString());
  const fees = expiry
    .sub(currentTimestamp)
    .div(FUNDING_INTERVAL)
    .mul(FUNDING_RATE);
  console.log('fees for borrow', fees.toString());
  console.log('collateralAccess', collateralAccess.toString());

  return collateralAccess
    .mul(fees.add(FEE_PRECISION))
    .div(FEE_PRECISION)
    .sub(collateralAccess);
}
