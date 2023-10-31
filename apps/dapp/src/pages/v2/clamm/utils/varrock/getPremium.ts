import axios from 'axios';

import { VARROCK_BASE_API_URL } from '../../constants';

async function getPremium(
  callToken: string,
  putToken: string,
  tick: number,
  ttl: number,
  isCall: boolean,
  chainId: number,
) {
  return axios
    .get(`${VARROCK_BASE_API_URL}/clamm/premium`, {
      params: {
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
