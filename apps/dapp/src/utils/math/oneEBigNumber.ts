import { BigNumber } from 'ethers';

function oneEBigNumber(pow: number | string): BigNumber {
  return BigNumber.from(10).pow(pow);
}

export default oneEBigNumber;
