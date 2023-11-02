import axios from 'axios';

import { VARROCK_BASE_API_URL } from '../../constants';

async function getMarkPrice(
  ticker: string,
  onSuccessCallback: any,
  onErrorCallback: any,
): Promise<number> {
  return await axios
    .get(`${VARROCK_BASE_API_URL}/uniswap-prices/last-price`, {
      params: {
        ticker: ticker,
      },
    })
    .then((res) => {
      const price = res.data.lastPrice ? Number(res.data.lastPrice) : 0;
      onSuccessCallback(price);
      return price;
    })
    .catch((err) => {
      onErrorCallback('Failed to fetch mark price');
      console.error(err);
      return 0;
    });
}
export default getMarkPrice;
