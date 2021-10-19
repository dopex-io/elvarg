import { ethers } from 'ethers';

function isZeroAddress(address: string): boolean {
  return address === ethers.constants.AddressZero;
}

export default isZeroAddress;
