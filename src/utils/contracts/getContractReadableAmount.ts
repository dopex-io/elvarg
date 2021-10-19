import { BigNumber, utils } from 'ethers';

export default function getContractReadableAmount(
  amount: string | number,
  decimals: string | number
): BigNumber {
  if (!Number(amount)) return BigNumber.from(0);
  const fAmount = utils.parseEther(String(amount));
  return fAmount.div(
    BigNumber.from(10).pow(BigNumber.from(18 - Number(decimals)))
  );
}
