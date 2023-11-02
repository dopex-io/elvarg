import axios from 'axios';

import { VARROCK_BASE_API_URL } from 'constants/clamm';

async function getBuyPositions(
  chainId: number,
  user: string,
  callToken: string,
  first: number,
  skip: number,
  onSuccessCallback: (response: any) => void,
  onErrorCallback: (error: string) => void,
) {
  axios
    .get(`${VARROCK_BASE_API_URL}/clamm/positions/purchase`, {
      params: {
        chainId,
        callToken,
        user,
        first,
        skip,
      },
    })
    .then(({ data }) => {
      onSuccessCallback(data as any);
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
export default getBuyPositions;
