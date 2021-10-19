import { ethers } from 'ethers';
import { OptionPricingCustom } from '@dopex-io/sdk';

interface Args {
  strikePrice: number;
  currentPrice: number;
  expiryDate: number;
  optionPoolAddress: string;
  optionPricing: OptionPricingCustom;
}

function ivGetter(args: Args) {
  const {
    strikePrice,
    currentPrice,
    expiryDate,
    optionPoolAddress,
    optionPricing,
  } = args;

  return [
    optionPricing.getIV(
      optionPoolAddress,
      ethers.utils.parseUnits(strikePrice.toString(), 8).toString(),
      ethers.utils.parseUnits(currentPrice.toString(), 8).toString(),
      Math.round(expiryDate / 1000),
      false
    ),
    optionPricing.getIV(
      optionPoolAddress,
      ethers.utils.parseUnits(strikePrice.toString(), 8).toString(),
      ethers.utils.parseUnits(currentPrice.toString(), 8).toString(),
      Math.round(expiryDate / 1000),
      true
    ),
  ];
}

export default ivGetter;
