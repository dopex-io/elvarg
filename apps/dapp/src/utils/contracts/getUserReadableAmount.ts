import { BigNumberish, utils as ethersUtils } from 'ethers';

export default function getUserReadableAmount(
  amount: BigNumberish,
  decimals: string | number = 18
): number {
  if (amount === undefined || amount === null) return 0;
  if (typeof amount === 'number') amount = String(amount);
  return Number(ethersUtils.formatUnits(amount, Number(decimals)));
}
