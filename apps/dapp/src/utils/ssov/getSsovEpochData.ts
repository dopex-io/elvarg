import { Address } from 'viem';

import { SsovV3__factory } from '@dopex-io/sdk';
import { readContract } from 'wagmi/actions';

const getSsovEpochData = async ({
  epoch,
  ssovAddress,
}: {
  epoch: number;
  ssovAddress: Address;
}) => {
  const data = await readContract({
    abi: SsovV3__factory.abi,
    address: ssovAddress,
    functionName: 'getEpochData',
    args: [BigInt(epoch)],
  });

  return data;
};

export default getSsovEpochData;
