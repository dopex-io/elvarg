import { Address } from 'viem';

import { readContract } from 'wagmi/actions';

import OptionPoolsAbi from './OptionPoolsAbi';

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
    abi: OptionPoolsAbi,
    address: optionPool,
    functionName: 'getPremiumAmount',
    args: [isPut, expiry, strike, lastPrice, baseIv, amount],
  });
};

export default getPremium;
