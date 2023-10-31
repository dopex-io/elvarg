import axios from 'axios';

import { VARROCK_BASE_API_URL } from '../../constants';

async function getStrikesChain(
  chainId: number,
  callToken: string,
  putToken: string,
  first: number,
  skip: number,
  onSuccessCallback: (data: StrikesChainAPIResponse) => void,
  onErrorCallback?: (error: string) => void,
) {
  axios
    .get(`${VARROCK_BASE_API_URL}/clamm/strikes`, {
      params: {
        chainId,
        callToken,
        putToken,
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
  earningsApy: number;
  rewardsApy: number;
  liquidityUsd: string;
  liquidityAvailableUsd: string;
  liquidityInToken: string;
  liquidityAvailableInToken: string;
  optionsAvailable: number;
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
