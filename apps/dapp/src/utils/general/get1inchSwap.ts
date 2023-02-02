import axios from 'axios';

const get1inchSwap = async ({
  fromTokenAddress,
  toTokenAddress,
  amount,
  chainId,
  accountAddress,
}: any) => {
  if (fromTokenAddress === toTokenAddress) return {};
  const { data } = await axios.get(
    `https://api.1inch.exchange/v4.0/${chainId}/swap?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amount=${Math.round(
      amount
    )}&fromAddress=${accountAddress}&slippage=0&disableEstimate=true`
  );

  return data;
};

export default get1inchSwap;
