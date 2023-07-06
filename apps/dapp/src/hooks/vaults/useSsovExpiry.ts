import { Address } from 'viem';

import { SsovV3__factory } from '@dopex-io/sdk';
import { useContractRead } from 'wagmi';

const useSsovExpiry = ({
  epoch,
  ssovAddress,
}: {
  epoch: number;
  ssovAddress: Address;
}) => {
  const { data, isLoading, error } = useContractRead({
    abi: SsovV3__factory.abi,
    address: ssovAddress as `0x${string}`,
    functionName: 'getEpochTimes',
    args: [BigInt(epoch)],
  });

  if (isLoading || error || data?.[1]) return 0;

  return data?.[1] ? Number(data[1]) : 0;
};

export default useSsovExpiry;
