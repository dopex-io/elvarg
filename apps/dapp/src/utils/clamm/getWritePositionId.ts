import { BigNumber, ethers } from 'ethers';
import { Address } from 'viem';

function getWritePositionId(
  pool: Address,
  tickLower: number,
  tickUpper: number,
) {
  const encoded = ethers.utils.defaultAbiCoder.encode(
    ['address', 'int24', 'int24'],
    [pool, tickLower, tickUpper],
  );
  const hash = ethers.utils.keccak256(encoded);
  const tokenId = BigNumber.from(hash);
  return BigInt(tokenId.toString());
}

export default getWritePositionId;
