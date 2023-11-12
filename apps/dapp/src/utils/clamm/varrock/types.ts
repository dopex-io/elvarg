import { Address } from 'viem';

export type OptionsPositionsResponse = {
  strike: number;
  side: 'call' | 'put';
  size: {
    amountInToken: string;
    decimals: number;
    symbol: string;
    usdValue: string;
  };
  premium: {
    amountInToken: string;
    decimals: number;
    symbol: string;
    usdValue: string;
  };
  profit: {
    amountInToken: string;
    symbol: string;
    decimals: number;
    usdValue: string;
  };
  expiry: string;
  meta: {
    tickLower: number;
    tickUpper: number;
    liquiditiesUsed: string[];
    pools: string[];
    handlers: string[];
    tokenId: string;
  };
};

export type GetExerciseTxDataParam = {
  optionMarket: Address;
  positionId: string;
  slippage: string;
  type: 'uni-v3' | '1inch';
};
