import axios from 'axios';

import { VARROACK_BASE_API_URL } from '../../constants';

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
    .get(`${VARROACK_BASE_API_URL}/clamm/strikes-chain`, {
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
      )
        console.error(err);
      console.error(err.response.data.message);
      onErrorCallback?.(err.response.data.message);
      return [];
    });
}

export default getStrikesChain;

export type StrikesChainAPIResponse = {
  strike: number;
  utilization: number;
  rewardsApy: number;
  earningsApy: number;
  composition: {
    call: {
      liquidityUsd: string;
      availableUsd: string;
      tokensLiquidity: string;
      tokensAvailable: string;
      optionsLiquidity: string;
      optionsAvailable: string;
      liquidityUsable: string;
      symbol: string;
      decimals: number;
      priceUsd: string;
      premiumTTLIVs: PremiumTTLIVs;
    };
    put: {
      liquidityUsd: string;
      availableUsd: string;
      tokensLiquidity: string;
      tokensAvailable: string;
      optionsLiquidity: string;
      optionsAvailable: string;
      liquidityUsable: string;
      symbol: string;
      decimals: number;
      priceUsd: string;
      premiumTTLIVs: PremiumTTLIVs;
    };
  };
  sources: { name: string; compositionPercentage: number }[];
  meta: {
    tickLower: number;
    tickUpper: number;
    liquidity: string;
  };
}[];

type PremiumTTLIVs = Record<number, PremiumTTLIV>;
type PremiumTTLIV = {
  iv: number;
  premiumInToken: string;
  premiumUsd: number;
};
