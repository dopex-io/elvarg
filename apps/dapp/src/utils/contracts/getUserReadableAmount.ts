import { BigNumber } from 'bignumber.js';
import { BigNumber as ethersBigNumber } from 'ethers';

export default function getUserReadableAmount(
  amount: string | number | BigNumber | ethersBigNumber,
  decimals: string | number = 18
): number {
  if (amount === undefined || amount === null) return 0;
  return new BigNumber(amount.toString())
    .dividedBy(new BigNumber(10).pow(decimals))
    .toNumber();
}
