import React, { useEffect, useState } from 'react';

import axios from 'axios';
import toast from 'react-hot-toast';
import { useNetwork } from 'wagmi';

import useClammStore from 'hooks/clamm/useClammStore';

import { formatAmount } from 'utils/general';

import { VARROCK_BASE_API_URL } from '../../constants';
import getMarkPrice from '../../utils/varrock/getMarkPrice';
import getStats from '../../utils/varrock/getStats';

const OverViewStats = () => {
  const { chain } = useNetwork();
  const { selectedOptionsPool, markPrice, setMarkPrice } = useClammStore();
  const [stats, setStats] = useState({
    oi: 0,
    tvl: 0,
  });

  useEffect(() => {
    if (!selectedOptionsPool) return;
    getMarkPrice(selectedOptionsPool.pairTicker, setMarkPrice, toast.error);
  }, [selectedOptionsPool, setMarkPrice]);

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
