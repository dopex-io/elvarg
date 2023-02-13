import axios from 'axios';
import { BigNumber } from 'ethers';

interface Args {
  fromTokenAddress: string;
  toTokenAddress: string;
  amount: BigNumber;
  chainId: number;
  accountAddress: string;
}

const get1inchSwap = async ({
  fromTokenAddress,
  toTokenAddress,
  amount,
  chainId,
  accountAddress,
}: Args) => {
  console.log(
    fromTokenAddress,
    toTokenAddress,
    amount,
    chainId,
    accountAddress
  );

  try {
    const { data } = await axios.get(
      `https://api.1inch.exchange/v5.0/${chainId}/swap?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amount=${amount.toString()}&fromAddress=${accountAddress}&slippage=0&disableEstimate=true`
    );
    return data;
  } catch {
    return { tx: '' };
  }
};

export default get1inchSwap;
