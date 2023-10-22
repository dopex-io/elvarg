import { Address } from 'viem';

import axios from 'axios';

import { VARROACK_BASE_API_URL } from '../../constants';

export type OptionsPoolsAPIResponse = {
  pairName: string;
  pairTicker: string;
  callToken: {
    symbol: string;
    address: Address;
  };
  putToken: {
    symbol: string;
    address: Address;
  };
  optionsPoolAddress: Address;
  handlers: {
    handlerName: string;
    handlerAddress: Address;
    dexName: string;
    pairAddress: Address;
  }[];
}[];

async function getOptionsPools(
  chainId: number,
  onSuccessCallback: (response: OptionsPoolsAPIResponse) => void,
  onErrorCallback?: (error: string) => void,
) {
  axios
    .get(`${VARROACK_BASE_API_URL}/clamm/options-pools`, {
      params: {
        chainId,
      },
    })
    .then(({ data }) => {
      onSuccessCallback(data as OptionsPoolsAPIResponse);
    })
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

export default getOptionsPools;
