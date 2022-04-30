import { utils as ethersUtils } from 'ethers';

function getOptionsContractId(
  isPut: boolean,
  expiry: string,
  strike: string,
  optionPoolAddress: string
): string {
  return ethersUtils.solidityKeccak256(
    ['uint256', 'uint256', 'bool', 'address'],
    [expiry, strike, isPut, optionPoolAddress]
  );
}

export default getOptionsContractId;
