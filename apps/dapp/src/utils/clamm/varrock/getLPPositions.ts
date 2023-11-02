import { Address, Hex } from 'viem';

import axios from 'axios';

import { VARROCK_BASE_API_URL } from 'constants/clamm';

async function getLPPositions(
  chainId: number,
  user: string,
  callToken: string,
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
        callToken,
        first,
        skip,
      },
    })
    .then(({ data }) => {
      onSuccessCallback(data as LPPositionAPIResponse);
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

export type LPPositionAPIResponse = {
  strikePrice: number;
  token0LiquidityInToken: string;
  token1LiquidityInToken: string;
  token0Earned: string;
  token1Earned: string;
  token0Symbol: string;
  token1Symbol: string;
  token0Decimals: number;
  token1Decimals: number;
  token0Withdrawable: string;
  token1Withdrawable: string;
  meta: {
    pool: Address;
    handler: Address;
    withdrawableShares: string;
    withdrawTx: {
      txData: Hex;
      to: Address;
    };
    tickLower: number;
    tickUpper: number;
    shares: string;
  };
};
