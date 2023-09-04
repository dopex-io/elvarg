import { Address } from 'viem';

import { SsovV3__factory } from '@dopex-io/sdk';
import { readContract } from 'wagmi/actions';

const getSsovSide = async (ssov: Address) => {
  const result = await readContract({
    abi: SsovV3__factory.abi,
    address: ssov,
    functionName: 'isPut',
  });
  return result;
};

export default getSsovSide;
