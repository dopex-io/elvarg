import axios from 'axios';

import { VARROCK_BASE_API_URL } from 'constants/env';

async function getStrikesChain(
  chainId: number,
  optionMarket: string,
  first: number,
  skip: number,
  onSuccessCallback: (data: StrikesChainAPIResponse) => void,
  onErrorCallback?: (error: string) => void,
) {
  await axios
    .get(`${VARROCK_BASE_API_URL}/clamm/strikes`, {
      params: {
        chainId,
        optionMarket,
        first,
        skip,
      },
    })
    .then(({ data }) => onSuccessCallback(data as StrikesChainAPIResponse))
    .catch((err) => {
      if (
        !err ||
        !err.response ||
        !err.response.data ||
        !err.response.data.message
      ) {
        console.error(err);
        return [];
      }
      onErrorCallback?.(err.response.data.message);
      return [];
    });
}

export default getStrikesChain;

export type StrikesChainAPIResponse = {
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
  tokenPrice: string;
  tokenDecimals: number;
  sources: { name: string; compositionPercentage: number }[];
  meta: {
    tickLower: number;
    tickUpper: number;
    liquidity: string;
  };
}[];
