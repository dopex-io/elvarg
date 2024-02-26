import React, { Dispatch, useEffect, useMemo } from 'react';

import { useQueries } from '@tanstack/react-query';
import { useAccount, useNetwork } from 'wagmi';

import useClammStore from 'hooks/clamm/useClammStore';

import ClaimButton from 'components/clamm/StrikesChain/components/ClaimButton';

import getOptionMarketPairPools from 'utils/clamm/getOptionMarketPairPools';

import { DEFAULT_CHAIN_ID, VARROCK_BASE_API_URL } from 'constants/env';

import Positions from './Positions';

const LPPositions = ({
  setLpPositionsLength,
}: {
  setLpPositionsLength: Dispatch<React.SetStateAction<number>>;
}) => {
  const { selectedOptionsMarket } = useClammStore();
  const { chain } = useNetwork();
  const { address: userAddress } = useAccount();

  const pools = useMemo(() => {
    if (!chain || !selectedOptionsMarket) return [];
    return getOptionMarketPairPools(chain.id, selectedOptionsMarket.address);
  }, [chain, selectedOptionsMarket]);

  const data = useQueries({
    queries: pools.map((pool) => ({
      queryKey: [
        'clamm-lp-positions',
        pool,
        chain?.id,
        selectedOptionsMarket?.address,
      ],
      queryFn: async () => {
        if (!chain || !userAddress || !selectedOptionsMarket) return [];
        const url = new URL(`${VARROCK_BASE_API_URL}/clamm/deposit/positions`);

        url.searchParams.set(
          'chainId',
          (chain?.id ?? DEFAULT_CHAIN_ID).toString(),
        );
        url.searchParams.set('pool', pool);
        url.searchParams.set('user', userAddress);
        return fetch(url).then((res) => {
          return res.json();
        });
      },
    })),
  });

  useEffect(() => {
    if (!data) return;

    try {
      setLpPositionsLength(
        data.map(({ data }) => data).filter((data) => data.length > 0).length,
      );
    } catch {}
  }, [data, setLpPositionsLength]);

  return (
    <div className="flex flex-col bg-cod-gray">
      <div className="w-full flex items-center justify-end">
        {selectedOptionsMarket?.deprecated && <ClaimButton />}
      </div>
      <Positions
        positions={data.map(({ data }) => data)}
        refetches={data.map(({ refetch }) => refetch)}
      />
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
    lastReserve: number;
    token0: string;
    token1: string;
    withdrawable: {
      token0: string;
      token1: string;
      liquidity: string;
    };
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
    shares: string;
    newLiquidity: string;
    withdrawableLiquidity: string;
    hook: string;
    tokenId: string;
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
  };
};
