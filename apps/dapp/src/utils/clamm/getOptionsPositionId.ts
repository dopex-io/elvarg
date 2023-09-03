import { BigNumber, ethers } from 'ethers';

function getOptionsId(
  writePositionId: bigint,
  expiry: bigint,
  callOrPut: boolean,
) {
  const encoded2 = ethers.utils.defaultAbiCoder.encode(
    ['uint256', 'uint256', 'bool'],
    [writePositionId, expiry, callOrPut],
  );
  const hash2 = ethers.utils.keccak256(encoded2);
  return BigInt(BigNumber.from(hash2).toString());
}

export default getOptionsId;
