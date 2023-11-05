import axios from 'axios';

import { VARROCK_BASE_API_URL } from 'constants/env';

async function getStats(
  chainId: number,
  callToken: string,
  putToken: string,
  onSuccessCallback: any,
  onErrorCallback: any,
) {
  return await axios
    .get(`${VARROCK_BASE_API_URL}/clamm/stats`, {
      params: {
        chainId: chainId,
        callToken: callToken,
        putToken: putToken,
      },
    })
    .then((res) => {
      onSuccessCallback({
        oi: res.data.oi ?? 0,
        tvl: res.data.tvl ?? 0,
      });
    })
    .catch((err) => {
      console.error(err);
      onErrorCallback('Failed to fetch stats');
    });
}

export default getStats;
