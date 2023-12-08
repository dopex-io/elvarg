import { Address } from 'viem';

import queryClient from 'queryClient';

import { VARROCK_BASE_API_URL } from 'constants/env';

async function getStrikesChain(
  chainId: number,
  optionMarket: string,
  first: number,
  skip: number,
): Promise<StrikesChainAPIResponse> {
  const strikes = await queryClient.fetchQuery({
    queryKey: ['CLAMM-STRIKES-CHAIN', optionMarket],
    queryFn: async () => {
      const url = new URL(`${VARROCK_BASE_API_URL}/clamm/strikes`);
      url.searchParams.set('chainId', chainId.toString());
      url.searchParams.set('optionMarket', optionMarket);
      url.searchParams.set('first', first.toString());
      url.searchParams.set('skip', skip.toString());

      return await fetch(url).then((res) => res.json());
    },
  });

  return strikes.message ? [] : strikes;
}

export default getStrikesChain;

export type Strike = {
  type: string;
  strike: number;
  utilization: number;
  earningsApy: string;
  rewardsApy: number;
  liquidityUsd: string;
  liquidityAvailableUsd: string;
  liquidityInToken: string;
  liquidityAvailableInToken: string;
  totalOptions: string;
  optionsAvailable: string;
  optionsAvailableInLiquidity: string;
  tokenSymbol: string;
  tokenAddress: Address;
  tokenPrice: string;
  tokenDecimals: number;
  sources: { name: string; compositionPercentage: number }[];
  meta: {
    tickLower: number;
    tickUpper: number;
    liquidity: string;
  };
};

export type StrikesChainAPIResponse = Strike[];
