import { Address } from 'viem';

import axios from 'axios';

import { VARROCK_BASE_API_URL } from 'constants/clamm';

export type OptionsPoolsAPIResponse = {
  pairName: string;
  pairTicker: string;
  callToken: {
    symbol: string;
    address: Address;
    decimals: number;
  };
  putToken: {
    symbol: string;
    address: Address;
    decimals: number;
  };
  optionsPoolAddress: Address;
  tokenURIFetcher: Address;
  ttls: string[];
  ivs: string[];
  primePool: Address;
}[];

function getOptionsPools(
  chainId: number,
  onSuccessCallback: (response: OptionsPoolsAPIResponse) => void,
  onErrorCallback?: (error: string) => void,
) {
  axios
    .get(`${VARROCK_BASE_API_URL}/clamm/pools`, {
      params: {
        chainId,
      },
    })
    .then(({ data }) => onSuccessCallback(data as OptionsPoolsAPIResponse))
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

export default getOptionsPools;
