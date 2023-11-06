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
    oi: 0,
    tvl: 0,
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

    getStats(
      chain.id,
      selectedOptionsPool.callToken.address,
      selectedOptionsPool.putToken.address,
      setStats,
      toast.error,
    );
  }, [chain, selectedOptionsPool]);

  return (
    <div className="flex space-x-[24px] md:w-fit w-full justify-between md:justify-normal">
      <div className="flex flex-col">
        <h6 className="flex text-sm md:text-md font-medium text-white items-center space-x-2">
          <span className="text-stieglitz">$</span>
          <span>{Number(markPrice).toFixed(4)}</span>
        </h6>
        <h6 className="text-sm md:text-md font-medium text-stieglitz">
          Mark Price
        </h6>
      </div>
      <div className="flex flex-col">
        <h6 className="flex text-sm md:text-md font-medium text-white items-center space-x-2">
          <span className="text-stieglitz">$</span>{' '}
          <span>{formatAmount(stats.oi, 5)}</span>
        </h6>
        <h6 className="text-sm md:text-md font-medium text-stieglitz">
          Open Interest
        </h6>
      </div>
      <div className="flex flex-col">
        <h6 className="flex text-sm md:text-md font-medium text-white items-center space-x-2">
          <span className="text-stieglitz">$</span>{' '}
          <span>{formatAmount(stats.tvl, 5)}</span>
        </h6>
        <h6 className="text-sm md:text-md font-medium text-stieglitz">
          Total Value Locked
        </h6>
      </div>
    </div>
  );
};

export default OverViewStats;
