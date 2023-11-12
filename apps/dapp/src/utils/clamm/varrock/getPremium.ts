import axios from 'axios';

import { VARROCK_BASE_API_URL } from 'constants/env';

async function getPremium(
  callToken: string,
  putToken: string,
  tick: number,
  ttl: number,
  amount: string,
  isCall: boolean,
  chainId: number,
) {
  return axios
    .get(`${VARROCK_BASE_API_URL}/clamm/premium`, {
      params: {
        amount,
        callToken,
        putToken,
        tick,
        ttl,
        isCall,
        chainId,
      },
    })
    .then(({ data }) => data);
}
export default getPremium;
