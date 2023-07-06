import { Address } from 'viem';

import { SsovV3__factory } from '@dopex-io/sdk';
import { readContract } from 'wagmi/actions';

const getSsovEpochTimes = async ({
  epoch,
  ssovAddress,
}: {
  epoch: number;
  ssovAddress: Address;
}) => {
  const data = await readContract({
    abi: SsovV3__factory.abi,
    address: ssovAddress as `0x${string}`,
    functionName: 'getEpochTimes',
    args: [BigInt(epoch)],
  });

  return data;
};

export default getSsovEpochTimes;
