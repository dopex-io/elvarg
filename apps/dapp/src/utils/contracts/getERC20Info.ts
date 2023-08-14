import { Address, erc20ABI } from 'wagmi';
import { readContract, readContracts } from 'wagmi/actions';

const fnNames = ['symbol', 'name', 'decimals', 'totalSupply'] as const;
type Erc20InfoType = {
  [key in (typeof fnNames)[number]]: string | number | bigint | undefined;
};

export const getERC20Info = async (token: Address): Promise<Erc20InfoType> => {
  const result = await readContracts({
    contracts: fnNames.map((fn) => ({
      abi: erc20ABI,
      address: token,
      functionName: fn,
    })),
  });
  let obj = {};
  for (let i = 0; i < result.length; i++) {
    obj = Object.fromEntries(
      result.map((result, index) => [fnNames[index], result.result]),
    );
  }
  return obj as Erc20InfoType;
};

interface Args {
  owner: Address;
  spender: Address;
  tokenAddress: Address;
  amount?: bigint;
}

export const getAllowance = async ({ owner, spender, tokenAddress }: Args) => {
  const data = await readContract({
    abi: erc20ABI,
    address: tokenAddress,
    functionName: 'allowance',
    args: [owner, spender],
  });

  return data;
};

export const isApproved = async ({
  owner,
  spender,
  tokenAddress,
  amount = 0n,
}: Args) => {
  const allowance = await getAllowance({
    owner,
    spender,
    tokenAddress,
  });

  return allowance >= amount;
};

export const getUserBalance = async ({
  owner,
  tokenAddress,
}: Partial<Args>) => {
  if (!owner || !tokenAddress) return undefined;
  const balance = await readContract({
    abi: erc20ABI,
    address: tokenAddress,
    functionName: 'balanceOf',
    args: [owner],
  });

  return balance;
};
