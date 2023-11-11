import React, { useEffect, useState } from 'react';

import toast from 'react-hot-toast';
import { useNetwork } from 'wagmi';

import useClammStore from 'hooks/clamm/useClammStore';

import getMarkPrice from 'utils/clamm/varrock/getMarkPrice';
import getStats from 'utils/clamm/varrock/getStats';
import { formatAmount } from 'utils/general';

const OverViewStats = () => {
  const { chain } = useNetwork();
  const { selectedOptionsPool, markPrice, setMarkPrice, setTick } =
    useClammStore();
  const [stats, setStats] = useState({
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
        toast.error,
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedOptionsPool, setMarkPrice, setTick]);

  useEffect(() => {
    if (!selectedOptionsPool || !chain) return;
    getStats(selectedOptionsPool.optionsPoolAddress).then((data) =>
      setStats(data),
    );

    const interval = setInterval(() => {
      getStats(selectedOptionsPool.optionsPoolAddress).then((data) =>
        setStats(data),
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [chain, selectedOptionsPool]);

  return (
    <div className="flex space-x-[24px] md:w-fit w-full justify-between md:justify-normal flex-wrap">
      <div className="flex flex-col">
        <h6 className="flex text-xs sm:text-sm md:text-md font-medium text-white items-center space-x-2">
          <span className="text-stieglitz">$</span>
          <span>{Number(markPrice).toFixed(4)}</span>
        </h6>
        <h6 className="text-xs sm:text-sm md:text-md font-medium text-stieglitz">
          Mark Price
        </h6>
      </div>
      {/* <div className="flex flex-col">
        <h6 className="flex text-xs sm:text-sm md:text-md font-medium text-white items-center space-x-2">
          <span className="text-stieglitz">{stats.openInterest.symbol}</span>{' '}
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
      </div> */}
      {/* <div className="flex flex-col">
        <h6 className="flex text-xs sm:text-sm md:text-md font-medium text-white items-center space-x-2">
          <span className="text-stieglitz">{stats.tvl.symbol}</span>{' '}
          <span>{formatAmount(stats.tvl.tvl ?? 0, 5)}</span>
        </h6>
        <h6 className="text-xs sm:text-sm md:text-md font-medium text-stieglitz">
          Total Deposits
        </h6>
      </div> */}
      <div className="flex flex-col">
        <h6 className="flex text-xs sm:text-sm md:text-md font-medium text-white items-center space-x-2">
          <span className="text-stieglitz">{stats.volume.symbol}</span>{' '}
          <span>{formatAmount(stats.volume.volume ?? 0, 5)}</span>
        </h6>
        <h6 className="text-xs sm:text-sm md:text-md font-medium text-stieglitz">
          Total Volume
        </h6>
      </div>
      <div className="flex flex-col">
        <h6 className="flex text-xs sm:text-sm md:text-md font-medium text-white items-center space-x-2">
          <span className="text-stieglitz">{stats.fees.symbol}</span>{' '}
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
