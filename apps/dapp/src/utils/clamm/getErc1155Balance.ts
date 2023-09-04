import { Address } from 'viem';

import { readContract } from 'wagmi/actions';

import { positionManagerAddress } from 'constants/clamm/markets';

import { Erc1155Abi } from './Erc1155Abi';

const getErc1155Balance = async (account: Address, id: bigint) => {
  const data = await readContract({
    abi: Erc1155Abi,
    address: positionManagerAddress,
    functionName: 'balanceOf',
    args: [account, id],
  });
  return data;
};

export default getErc1155Balance;
