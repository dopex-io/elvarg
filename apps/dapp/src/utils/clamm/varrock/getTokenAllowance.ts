import { Address } from 'viem';

import axios from 'axios';

import { VARROCK_BASE_API_URL } from 'constants/env';

async function getTokenAllowance(
  chainId: number,
  token: Address,
  account: Address,
  spender: Address,
) {
  return await axios
    .get(`${VARROCK_BASE_API_URL}/token/allowance`, {
      params: {
        chainId: chainId,
        token: token,
        account: account,
        spender: spender,
      },
    })
    .then(({ data: { allowance } }) => (allowance ? BigInt(allowance) : 0n))
    .catch((err) => {
      console.error(err);
      return 0n;
    });
}

export default getTokenAllowance;
