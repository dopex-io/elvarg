import axios from 'axios';

import { VARROCK_BASE_API_URL } from 'constants/env';

import { LPPositionsResponse } from './types';

async function getLPPositions(
  chainId: number,
  user: string,
  optionMarket: string,
  first: number,
  skip: number,
  onSuccessCallback: (response: any) => void,
  onErrorCallback: (error: string) => void,
) {
  axios
    .get(`${VARROCK_BASE_API_URL}/clamm/positions/deposit`, {
      params: {
        chainId,
        user: user,
        optionMarket,
        first,
        skip,
      },
    })
    .then(({ data }) => {
      onSuccessCallback(data as LPPositionsResponse);
    })
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
export default getLPPositions;
