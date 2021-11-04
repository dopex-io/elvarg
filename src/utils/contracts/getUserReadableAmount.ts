import { BigNumber } from 'ethers';
import { BigNumber as BigNumber_ } from 'bignumber.js';

export default function getUserReadableAmount(
  amount: string | number | BigNumber | BigNumber_,
  decimals: string | number = 18
): number {
  if (amount === undefined) return 0;
  return new BigNumber_(amount.toString())
    .dividedBy(new BigNumber_(10).pow(decimals))
    .toNumber();
}
