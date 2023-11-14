import { Address } from 'viem';

import axios from 'axios';

import { VARROCK_BASE_API_URL } from 'constants/env';

import { OptionsPositionsResponse } from './types';

type BuyPositionQuery = {
  account: Address;
  optionMarket: Address;
  first: number;
  skip: number;
};
async function getBuyPositions(
  queryOptions: BuyPositionQuery,
  onSuccessCallback: (response: any) => void,
  onErrorCallback: (error: string) => void,
) {
  const { account, optionMarket } = queryOptions;
  axios
    .get(`${VARROCK_BASE_API_URL}/clamm/positions/purchase`, {
      params: {
        account,
        optionMarket,
      },
    })
    .then(({ data }) => {
      onSuccessCallback(data as OptionsPositionsResponse[]);
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
      return [];
    });
}
export default getBuyPositions;
