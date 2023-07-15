import { Address, erc20ABI } from 'wagmi';
import { readContract } from 'wagmi/actions';

export const getTokenSymbol = async (token: Address) => {
  const symbol = await readContract({
    abi: erc20ABI,
    address: token,
    functionName: 'symbol',
  });
  return symbol;
};
