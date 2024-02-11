import React, { useMemo } from 'react';

import { useQueries, useQuery } from '@tanstack/react-query';
import { VARROCK_V2_bASE_API_URL } from 'pages/clamm-v2/constants';

import Dashboard from './Dashboard';
import Positions from './Positions';

const LPPositions = () => {
  const optionMarketAddress = '0x8a791620dd6260079bf849dc5567adc3f2fdc318';
  const chainId = 31337;
  const pools = ['0x53b27D62963064134D60D095a526e1E72b74A5C4'];
  const user = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

  //   const { data, dataUpdatedAt, refetch, isLoading } = useQuri({
  //     queryKey: ['CLAMM', 'LPPositions', optionMarketAddress],
  //     queryFn: async () => {
  //       const url = new URL(`${VARROCK_V2_bASE_API_URL}/clamm/deposit/positions`);

  //       url.searchParams.set('chainId', chainId.toString());
  //     },
  //   });

  const data = useQueries({
    queries: pools.map((pool) => ({
      queryKey: [],
      queryFn: async () => {
        const url = new URL(
          `${VARROCK_V2_bASE_API_URL}/clamm/deposit/positions`,
        );

        url.searchParams.set('chainId', chainId.toString());
        url.searchParams.set('pool', pool);
        url.searchParams.set('user', user);
        return fetch(url).then((res) => {
          if (!res.ok) return [];
          return res.json();
        });
      },
    })),
  });

  return (
    <div className="flex flex-col flex-start">
      <Dashboard />
      <Positions positions={data.map(({ data }) => data)} />
    </div>
  );
};

export default LPPositions;

export type LPPosition = {
  strikes: {
    call: number;
    put: number;
  };
  liquidity: {
    token0: string;
    token1: string;
  };
  earned: {
    token0: string;
    token1: string;
  };
  reserved: {
    token0: string;
    token1: string;
  };
  tokens: {
    token0: {
      address: string;
      decimals: number;
      symbol: string;
    };
    token1: {
      address: string;
      decimals: number;
      symbol: string;
    };
  };
  withdrawable: {
    token0: string;
    token1: string;
  };
  meta: {
    reservedLiquidity: string;
    initialLiquidity: string;
    tickLower: number;
    tickUpper: number;
    handler: {
      name: string;
      deprecated: boolean;
      handler: string;
      pool: string;
    };
    withdrawTx: string;
  };
};
