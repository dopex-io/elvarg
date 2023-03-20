export const get1inchSwapData = async (
  caller: string,
  fromToken: string,
  toToken: string,
  amountIn: string,
  chainId: string
) => {
  const queryParams = {
    fromTokenAddress: fromToken,
    toTokenAddress: toToken,
    amount: amountIn,
    fromAddress: caller,
    slippage: '3',
    disableEstimate: 'true',
    allowPartialFill: 'false',
  };
  const url = `https://api.1inch.io/v5.0/${chainId}/swap?${new URLSearchParams(
    queryParams
  ).toString()}`;
  let data: any = await fetch(url);
  data = await data.json();

  if (data.statusCode == 400) {
    throw new Error('Error fetching swap data for 1inch: ' + data.description);
  }
  return data.tx.data;
};
