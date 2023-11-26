import { Address } from 'viem';

export type OptionsPositionsResponse = {
  strike: number;
  side: 'call' | 'put';
  size: {
    tokenAddress: Address;
    amountInToken: string;
    decimals: number;
    symbol: string;
    usdValue: string;
  };
  premium: {
    tokenAddress: Address;
    amountInToken: string;
    decimals: number;
    symbol: string;
    usdValue: string;
  };
  profit: {
    tokenAddress: Address;
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

export type LPPositionsResponse = {
  strikePrice: number;
  token0LiquidityInToken: string;
  token1LiquidityInToken: string;
  token0Earned: string;
  token1Earned: string;
  token0Symbol: string;
  token1Symbol: string;
  token0Decimals: number;
  token1Decimals: number;
  token0Withdrawable: string;
  token1Withdrawable: string;
  meta: {
    pool: string;
    handler: string;
    withdrawableShares: string;
    withdrawTx: {
      txData: string;
      to: string;
    };
    tickLower: number;
    tickUpper: number;
    shares: string;
  };
};

export type GetExerciseTxDataParam = {
  optionMarket: Address;
  positionId: string;
  slippage: string;
  type: 'uni-v3' | '1inch';
};
