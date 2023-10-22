import React from 'react';

import { Skeleton } from '@dopex-io/ui';

import useLoadingStates from 'hooks/clamm/useLoadingStates';

const OverViewStats = () => {
  const { isLoading } = useLoadingStates();
  return (
    <div className="flex space-x-[24px]">
      <div className="flex flex-col">
        <h6 className="flex text-md font-medium text-white items-center space-x-2">
          <span className="text-stieglitz">$</span>
          {isLoading('initial_pool_load') ? (
            <Skeleton width={'24px'} height={'12px'} variant="rounded" />
          ) : (
            <span>{(0).toFixed(5)}</span>
          )}
        </h6>
        <h6 className="text-md font-medium text-stieglitz">Mark Price</h6>
      </div>
      <div className="flex flex-col">
        <h6 className="flex text-md font-medium text-white items-center space-x-2">
          <span className="text-stieglitz">$</span>{' '}
          {isLoading('initial_pool_load') ? (
            <Skeleton width={'24px'} height={'12px'} variant="rounded" />
          ) : (
            <span>{(0).toFixed(5)}</span>
          )}
        </h6>
        <h6 className="text-md font-medium text-stieglitz">Open Interest</h6>
      </div>
      <div className="flex flex-col">
        <h6 className="flex text-md font-medium text-white items-center space-x-2">
          <span className="text-stieglitz">$</span>{' '}
          {isLoading('initial_pool_load') ? (
            <Skeleton width={'24px'} height={'12px'} variant="rounded" />
          ) : (
            <span>{(0).toFixed(5)}</span>
          )}
        </h6>
        <h6 className="text-md font-medium text-stieglitz">Total Volume</h6>
      </div>
      <div className="flex flex-col">
        <h6 className="flex text-md font-medium text-white items-center space-x-2">
          <span className="text-stieglitz">$</span>{' '}
          {isLoading('initial_pool_load') ? (
            <Skeleton width={'24px'} height={'12px'} variant="rounded" />
          ) : (
            <span>{(0).toFixed(5)}</span>
          )}
        </h6>
        <h6 className="text-md font-medium text-stieglitz">
          Total Value Locked
        </h6>
      </div>
    </div>
  );
};

export default OverViewStats;
