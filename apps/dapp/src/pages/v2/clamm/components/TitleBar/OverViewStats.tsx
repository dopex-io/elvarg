import React from 'react';

import { Skeleton } from '@dopex-io/ui';
import { useQuery } from '@tanstack/react-query';
import { useNetwork } from 'wagmi';

import useClammStore from 'hooks/clamm/useClammStore';
import useLoadingStates from 'hooks/clamm/useLoadingStates';

import { formatAmount } from 'utils/general';

import { VARROACK_BASE_API_URL } from '../../constants';

const OverViewStats = () => {
  const { chain } = useNetwork();
  const { selectedOptionsPool } = useClammStore();

  const { data, refetch, dataUpdatedAt, isLoading } = useQuery({
    queryKey: ['clamm-pools-stats'],
    initialData: {
      tvl: 0,
      openInterest: 0,
      markPrice: 0,
    },
    queryFn: () => {
      const queryUrl = new URL(`${VARROACK_BASE_API_URL}/clamm/stats`);
      queryUrl.searchParams.set('chainId', chain?.id.toString() ?? '42161');
      queryUrl.searchParams.set(
        'callToken',
        selectedOptionsPool?.callToken.symbol ?? '',
      );
      queryUrl.searchParams.set(
        'putToken',
        selectedOptionsPool?.putToken.symbol ?? '',
      );
      return fetch(queryUrl).then((res) => res.json());
    },
  });

  return (
    <div className="flex space-x-[24px] md:w-fit w-full justify-between md:justify-normal">
      <div className="flex flex-col">
        <h6 className="flex text-sm md:text-md font-medium text-white items-center space-x-2">
          <span className="text-stieglitz">$</span>
          {isLoading ? (
            <Skeleton width={'24px'} height={'12px'} variant="rounded" />
          ) : (
            <span>{formatAmount(data.markPrice ?? 0, 5)}</span>
          )}
        </h6>
        <h6 className="text-sm md:text-md font-medium text-stieglitz">
          Mark Price
        </h6>
      </div>
      <div className="flex flex-col">
        <h6 className="flex text-sm md:text-md font-medium text-white items-center space-x-2">
          <span className="text-stieglitz">$</span>{' '}
          {isLoading ? (
            <Skeleton width={'24px'} height={'12px'} variant="rounded" />
          ) : (
            <span>{formatAmount(data.openInterest ?? 0, 5)}</span>
          )}
        </h6>
        <h6 className="text-sm md:text-md font-medium text-stieglitz">
          Open Interest
        </h6>
      </div>
      <div className="flex flex-col">
        <h6 className="flex text-sm md:text-md font-medium text-white items-center space-x-2">
          <span className="text-stieglitz">$</span>{' '}
          {isLoading ? (
            <Skeleton width={'24px'} height={'12px'} variant="rounded" />
          ) : (
            <span>{formatAmount(data.tvl ?? 0, 5)}</span>
          )}
        </h6>
        <h6 className="text-sm md:text-md font-medium text-stieglitz">
          Total Value Locked
        </h6>
      </div>
    </div>
  );
};

export default OverViewStats;
