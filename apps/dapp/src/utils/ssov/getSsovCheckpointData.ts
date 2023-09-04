import { Address } from 'viem';

import { SsovV3__factory } from '@dopex-io/sdk';
import { readContract } from 'wagmi/actions';

const getSsovCheckpointData = async ({
  positionId,
  ssovAddress,
}: {
  positionId: number;
  ssovAddress: Address;
}) => {
  const writePosition = await readContract({
    abi: SsovV3__factory.abi,
    address: ssovAddress as `0x${string}`,
    functionName: 'writePosition',
    args: [BigInt(positionId)],
  });

  const checkpointData = await readContract({
    abi: SsovV3__factory.abi,
    address: ssovAddress as `0x${string}`,
    functionName: 'checkpoints',
    args: [writePosition[0], writePosition[1], writePosition[3]],
  });

  return {
    activeCollateral: checkpointData[0],
    totalCollateral: checkpointData[1],
    accruedPremium: checkpointData[2],
  };
};

export default getSsovCheckpointData;
