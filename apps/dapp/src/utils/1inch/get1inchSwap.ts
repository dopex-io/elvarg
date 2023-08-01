import axios from 'axios';

import { DOPEX_API_BASE_URL } from 'constants/env';

interface Args {
  chainId: number;
  src: string;
  dst: string;
  amount: string;
  from: string;
}

const get1inchSwap = async ({ chainId, src, dst, amount, from }: Args) => {
  try {
    const { data } = await axios.get(
      `${DOPEX_API_BASE_URL}/v2/1inch/swap?chainId=${chainId}&src=${src}&dst=${dst}&amount=${amount}&from=${from}`,
    );
    return data;
  } catch {
    return { tx: '' };
  }
};

export default get1inchSwap;
