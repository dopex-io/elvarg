import { utils as ethersUtils } from 'ethers';

function getPositionId(
  isPut: boolean,
  expiry: string,
  strike: string,
  optionPoolAddress: string,
  collateral: string
): string {
  return ethersUtils.solidityKeccak256(
    ['bool', 'uint256', 'uint256', 'address', 'address'],
    [isPut, strike, expiry, optionPoolAddress, collateral]
  );
}

export default getPositionId;
