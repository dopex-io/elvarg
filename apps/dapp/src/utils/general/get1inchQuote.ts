import axios from 'axios';
import { string } from 'yup/lib/locale';

export interface TokenData {
  address: string;
  decimals: number;
  logoURI: string;
  symbol: string;
  name: string;
  tags: string[];
}

interface IProtocol {
  name: string;
  part: number;
  fromTokenAddress: string;
}

export interface I1inchQuote {
  estimatedGas: number;
  fromToken: TokenData;
  fromTokenAmount: string;
  protocols: IProtocol[][];
  toToken: TokenData;
  toTokenAmount: string;
}

export const defaultQuoteData: I1inchQuote = {
  estimatedGas: 0,
  fromToken: {
    address: '',
    decimals: 0,
    logoURI: '',
    symbol: '',
    name: '',
    tags: [],
  },
  fromTokenAmount: '0',
  protocols: [],
  toToken: {
    address: '',
    decimals: 0,
    logoURI: '',
    symbol: '',
    name: '',
    tags: [],
  },
  toTokenAmount: '0',
};

const get1inchQuote = async (
  fromTokenAddress: string,
  toTokenAddress: string,
  amount: string,
  chainId: number,
  accountAddress: string
): Promise<I1inchQuote> => {
  if (fromTokenAddress === toTokenAddress) return defaultQuoteData;

  console.log(
    chainId,
    fromTokenAddress,
    toTokenAddress,
    amount,
    accountAddress
  );
  const { data } = await axios.get(
    `https://api.1inch.exchange/v4.0/${chainId}/quote?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amount=${amount}&fromAddress=${accountAddress}&slippage=0&disableEstimate=true`
  );

  return data;
};

export default get1inchQuote;
