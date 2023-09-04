import { Address } from 'viem';

import { SsovV3__factory } from '@dopex-io/sdk';
import { readContract } from 'wagmi/actions';

const getSsovPurchaseFees = async ({
  ssov,
  strike,
  amount,
}: {
  ssov: Address;
  strike: bigint;
  amount: bigint;
}) => {
  const data = readContract({
    address: ssov,
    abi: SsovV3__factory.abi,
    functionName: 'calculatePurchaseFees',
    args: [strike, amount],
  });

  return data;
};

export default getSsovPurchaseFees;
