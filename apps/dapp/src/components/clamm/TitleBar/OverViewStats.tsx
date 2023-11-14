import React, { useCallback, useEffect, useState } from 'react';

import { useNetwork } from 'wagmi';

import useClammStore from 'hooks/clamm/useClammStore';

import getMarkPrice from 'utils/clamm/varrock/getMarkPrice';
import getStats from 'utils/clamm/varrock/getStats';
import { formatAmount } from 'utils/general';

type Stats = {
  openInterest: {
    openInterest: string;
    symbol: string;
  };
  tvl: {
    tvl: string;
    symbol: string;
  };
  volume: {
    volume: string;
    symbol: string;
  };
  fees: {
    fees: string;
    symbol: string;
  };
  invoked: false;
};

const OverViewStats = () => {
  const { selectedOptionsPool, markPrice, setMarkPrice, setTick } =
    useClammStore();
  const [stats, setStats] = useState<Stats>({
    openInterest: {
      openInterest: '0',
      symbol: '$',
    },
    tvl: {
      tvl: '0',
      symbol: '$',
    },
    volume: {
      volume: '0',
      symbol: '$',
    },
    fees: {
      fees: '0',
      symbol: '$',
    },
    invoked: false,
  });

  useEffect(() => {
    if (!selectedOptionsPool) return;
    const interval = setInterval(async () => {
      await getMarkPrice(
        selectedOptionsPool.pairTicker,
        ({ price, tick }) => {
          setMarkPrice(price);
          setTick(tick);
        },
        () => {},
      );
    }, 10000);

    return () => clearInterval(interval);
  }, [selectedOptionsPool, setMarkPrice, setTick]);

  const updateStats = useCallback(async () => {
    if (!selectedOptionsPool) return;

    await getStats(selectedOptionsPool.optionsPoolAddress).then((data) =>
      setStats((prev) => ({ ...prev, ...data })),
    );
  }, [selectedOptionsPool]);

  useEffect(() => {
    updateStats();
  }, [updateStats]);

  useEffect(() => {
    if (!selectedOptionsPool) return;

    if (stats.invoked) {
      const interval = setInterval(async () => updateStats(), 15000);
      return () => clearInterval(interval);
    } else {
      updateStats();
    }
  }, [selectedOptionsPool, stats.invoked, updateStats]);

  return (
    <div className="flex space-x-[24px] md:w-fit w-full justify-between md:justify-center flex-wrap md:pt-[4px]">
      <div className="flex flex-col">
        <h6 className="flex text-xs sm:text-sm md:text-md font-medium text-white items-center space-x-2">
          <span className="text-stieglitz">$</span>
          <span>{formatAmount(markPrice, 5)}</span>
        </h6>
        <h6 className="text-xs sm:text-sm md:text-md font-medium text-stieglitz">
          Mark Price
        </h6>
      </div>
      <div className="xl:flex flex-col hidden">
        <h6 className="text-xs sm:text-sm md:text-md font-medium text-white items-center space-x-2">
          <span className="text-stieglitz">{stats.openInterest.symbol}</span>
          <span>
            {formatAmount(
              stats.openInterest.openInterest
                ? stats.openInterest.openInterest
                : 0,
              5,
            )}
          </span>
        </h6>
        <h6 className="text-xs sm:text-sm md:text-md font-medium text-stieglitz">
          Open Interest
        </h6>
      </div>
      <div className="xl:flex flex-col hidden">
        <h6 className="text-xs sm:text-sm md:text-md font-medium text-white items-center space-x-2">
          <span className="text-stieglitz">{stats.tvl.symbol}</span>
          <span>{formatAmount(stats.tvl.tvl ?? 0, 5)}</span>
        </h6>
        <h6 className="text-xs sm:text-sm md:text-md font-medium text-stieglitz">
          Total Deposits
        </h6>
      </div>
      <div className="flex flex-col">
        <h6 className="flex text-xs sm:text-sm md:text-md font-medium text-white items-center space-x-2">
          <span className="text-stieglitz">{stats.volume.symbol}</span>
          <span>{formatAmount(stats.volume.volume ?? 0, 5)}</span>
        </h6>
        <h6 className="text-xs sm:text-sm md:text-md font-medium text-stieglitz">
          Total Volume
        </h6>
      </div>
      <div className="flex flex-col">
        <h6 className="flex text-xs sm:text-sm md:text-md font-medium text-white items-center space-x-2">
          <span className="text-stieglitz">{stats.fees.symbol}</span>
          <span>{formatAmount(stats.fees.fees ?? 0, 5)}</span>
        </h6>
        <h6 className="text-xs sm:text-sm md:text-md font-medium text-stieglitz">
          Total Fees
        </h6>
      </div>
    </div>
  );
};

export default OverViewStats;
