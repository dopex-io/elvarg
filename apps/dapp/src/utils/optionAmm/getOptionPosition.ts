import { Address } from 'viem';

import { OptionAmm__factory } from '@dopex-io/sdk';
import { readContract } from 'wagmi/actions';

const getOptionPosition = async ({
  optionAmm,
  tokenId,
}: {
  optionAmm: Address;
  tokenId: bigint;
}) => {
  const data = await readContract({
    abi: OptionAmm__factory.abi,
    address: optionAmm,
    functionName: 'optionPositions',
    args: [tokenId],
  });
  return data;
};

export default getOptionPosition;

// @todo: amend implementation in hook
