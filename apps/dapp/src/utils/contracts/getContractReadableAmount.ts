import { BigNumber, utils } from 'ethers';

export default function getContractReadableAmount(
  amount: string | number,
  decimals: string | number
): BigNumber {
  if (!Number(amount)) return BigNumber.from(0);
  return utils.parseUnits(String(amount), Number(decimals));
}
