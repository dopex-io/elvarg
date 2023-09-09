import { Address } from 'viem';

import { ERC20__factory } from '@dopex-io/sdk';
import { multicall } from 'wagmi/actions';

type TokensData = {
  token0Decimals: number;
  token1Decimals: number;
  token0Symbol: string;
  token1Symbol: string;
};
async function getTokensData(
  token0: Address,
  token1: Address,
): Promise<TokensData> {
  const token0Contract = {
    address: token0,
    abi: ERC20__factory.abi,
  };
  const token1Contract = {
    address: token1,
    abi: ERC20__factory.abi,
  };

  try {
    const data = await multicall({
      contracts: [
        {
          ...token0Contract,
          functionName: 'symbol',
        },
        {
          ...token0Contract,
          functionName: 'decimals',
        },
        {
          ...token1Contract,
          functionName: 'symbol',
        },
        {
          ...token1Contract,
          functionName: 'decimals',
        },
      ],
    });

    return {
      token0Symbol: data[0].result!,
      token0Decimals: data[1].result!,
      token1Symbol: data[2].result!,
      token1Decimals: data[3].result!,
    };
  } catch (err) {
    console.error(err);
    return {
      token0Symbol: 'ARB',
      token0Decimals: 18,
      token1Symbol: 'USDC',
      token1Decimals: 6,
    };
  }
}

export default getTokensData;
