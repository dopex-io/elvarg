import { BigNumber, utils as ethersUtils } from 'ethers';

export default function getUserReadableAmount(
  amount: BigNumber | undefined,
  decimals: string | number = 18
): number {
  if (amount === undefined || amount === null) return 0;
  return Number(ethersUtils.formatUnits(amount, Number(decimals)));
}
