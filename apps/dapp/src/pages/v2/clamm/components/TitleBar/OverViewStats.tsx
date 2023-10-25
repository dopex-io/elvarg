import React, { useEffect } from 'react';

import { Skeleton } from '@dopex-io/ui';
import { useQueries, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useNetwork } from 'wagmi';

import useClammStore from 'hooks/clamm/useClammStore';
import useLoadingStates from 'hooks/clamm/useLoadingStates';

import { formatAmount } from 'utils/general';

import { VARROACK_BASE_API_URL } from '../../constants';

const OverViewStats = () => {
  const { chain } = useNetwork();
  const { selectedOptionsPool } = useClammStore();

  const { data: markPriceData } = useQuery({
    queryKey: ['clamm-mark-price'],
    refetchOnWindowFocus: true,
    initialData: {
      lastPrice: 0,
    },
    queryFn: async () => {
      const queryUrl = new URL(
        `${VARROACK_BASE_API_URL}/uniswap-prices/last-price`,
      );
      queryUrl.searchParams.set(
        'ticker',
        selectedOptionsPool?.pairTicker ?? 'ARB/USDC',
      );
      return fetch(queryUrl).then((res) => res.json());
    },
  });

  const { data: statsData } = useQuery({
    queryKey: ['clamm-stats'],
    refetchOnWindowFocus: true,
    initialData: {
      openInterest: 0,
      tvl: 0,
    },
    queryFn: async () => {
      const queryUrl = new URL(`${VARROACK_BASE_API_URL}/clamm/stats`);
      queryUrl.searchParams.set('chainId', chain?.id.toString() ?? '42161');
      queryUrl.searchParams.set(
        'callToken',
        selectedOptionsPool?.callToken.symbol ?? 'ARB',
      );
      queryUrl.searchParams.set(
        'putToken',
        selectedOptionsPool?.putToken.symbol ?? 'USDC',
      );
      return fetch(queryUrl).then((res) => res.json());
    },
  });

  return (
    <div className="flex space-x-[24px] md:w-fit w-full justify-between md:justify-normal">
      <div className="flex flex-col">
        <h6 className="flex text-sm md:text-md font-medium text-white items-center space-x-2">
          <span className="text-stieglitz">$</span>
          <span>
            {markPriceData.lastPrice
              ? Number(markPriceData.lastPrice).toFixed(4)
              : 0}
          </span>
        </h6>
        <h6 className="text-sm md:text-md font-medium text-stieglitz">
          Mark Price
        </h6>
      </div>
      <div className="flex flex-col">
        <h6 className="flex text-sm md:text-md font-medium text-white items-center space-x-2">
          <span className="text-stieglitz">$</span>{' '}
          <span>{formatAmount(statsData ? statsData.openInterest : 0, 5)}</span>
        </h6>
        <h6 className="text-sm md:text-md font-medium text-stieglitz">
          Open Interest
        </h6>
      </div>
      <div className="flex flex-col">
        <h6 className="flex text-sm md:text-md font-medium text-white items-center space-x-2">
          <span className="text-stieglitz">$</span>{' '}
          <span>{formatAmount(statsData ? statsData.tvl : 0, 5)}</span>
        </h6>
        <h6 className="text-sm md:text-md font-medium text-stieglitz">
          Total Value Locked
        </h6>
      </div>
    </div>
  );
};

export default OverViewStats;
