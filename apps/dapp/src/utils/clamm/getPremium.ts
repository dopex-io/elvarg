import { Address } from 'viem';

import { OptionPools__factory } from '@dopex-io/sdk';
import { readContract } from 'wagmi/actions';

const getPremium = async (
  optionPool: Address,
  isPut: boolean,
  expiry: number,
  strike: bigint,
  lastPrice: bigint,
  baseIv: bigint,
  amount: bigint,
): Promise<bigint | unknown> => {
  return readContract({
    abi: OptionPools__factory.abi,
    address: optionPool,
    functionName: 'getPremiumAmount',
    args: [isPut, BigInt(expiry), strike, lastPrice, baseIv, amount],
  });
};

export default getPremium;
