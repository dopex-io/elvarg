import { Address } from 'viem';

import { ERC721__factory } from '@dopex-io/sdk';
import { readContract } from 'wagmi/actions';

const balanceOf = async ({
  positionMinter,
  accountAddress,
}: {
  positionMinter: Address;
  accountAddress: Address;
}) => {
  const data = readContract({
    address: positionMinter,
    abi: ERC721__factory.abi,
    functionName: 'balanceOf',
    args: [accountAddress],
  });
  return data;
};

const getPositionIds = async ({
  positionMinter,
  owner,
}: {
  positionMinter: Address;
  owner: Address;
}) => {
  const balance = await balanceOf({
    positionMinter,
    accountAddress: owner,
  });
  const promises: Promise<bigint>[] = [];
  for (let i = 0; i < balance; i++) {
    const promise = readContract({
      address: positionMinter,
      abi: ERC721__factory.abi,
      functionName: 'tokenOfOwnerByIndex',
      args: [owner, BigInt(i)],
    });
    promises.push(promise);
  }
  return await Promise.all(promises);
};

export default getPositionIds;

// @todo: amend implementation in hook
