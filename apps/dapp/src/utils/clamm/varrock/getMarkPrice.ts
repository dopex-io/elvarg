import axios from 'axios';

import { VARROCK_BASE_API_URL } from 'constants/clamm';

async function getMarkPrice(
  ticker: string,
  onSuccessCallback: ({ price, tick }: { price: number; tick: number }) => void,
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
      const tick = res.data.tick ? Number(res.data.tick) : 0;
      console.log(res.data);
      onSuccessCallback({
        price,
        tick,
      });
      return price;
    })
    .catch((err) => {
      onErrorCallback('Failed to fetch mark price');
      console.error(err);
      return 0;
    });
}
export default getMarkPrice;
