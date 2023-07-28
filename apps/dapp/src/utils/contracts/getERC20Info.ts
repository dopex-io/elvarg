import { Address, erc20ABI } from 'wagmi';
import { readContracts } from 'wagmi/actions';

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
