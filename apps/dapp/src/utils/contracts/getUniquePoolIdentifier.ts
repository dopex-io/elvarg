import { ethers } from 'ethers';

function getUniqueRebateIdentifier(
  optionPoolAddress: string,
  epoch: number
): string {
  return ethers.utils.solidityKeccak256(
    ['address', 'uint256'],
    [optionPoolAddress, epoch]
  );
}

export default getUniqueRebateIdentifier;
