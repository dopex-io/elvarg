import axios from 'axios';

import { DOPEX_API_BASE_URL } from 'constants/env';

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

interface Args {
  chainId: number;
  src: string;
  dst: string;
  amount: string;
  from: string;
}

const get1inchQuote = async ({
  chainId,
  src,
  dst,
  amount,
  from,
}: Args): Promise<I1inchQuote> => {
  if (src === dst || amount === '' || amount === '0') return defaultQuoteData;

  const { data } = await axios.get(
    `${DOPEX_API_BASE_URL}/v2/1inch/quote?chainId=${chainId}&src=${src}&dst=${dst}&amount=${amount}&from=${from}`,
  );

  return data;
};

export default get1inchQuote;
