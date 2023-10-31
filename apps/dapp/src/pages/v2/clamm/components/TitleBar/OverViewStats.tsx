import React, { useEffect, useState } from 'react';

import axios from 'axios';
import toast from 'react-hot-toast';
import { useNetwork } from 'wagmi';

import useClammStore from 'hooks/clamm/useClammStore';

import { formatAmount } from 'utils/general';

import { VARROCK_BASE_API_URL } from '../../constants';

const OverViewStats = () => {
  const { chain } = useNetwork();
  const { selectedOptionsPool } = useClammStore();
  const [markPrice, setMarkPrice] = useState<number | string>(0);
  const [stats, setStats] = useState({
    oi: 0,
    tvl: 0,
  });

  useEffect(() => {
    if (!selectedOptionsPool) return;
    axios
      .get(`${VARROCK_BASE_API_URL}/uniswap-prices/last-price`, {
        params: {
          ticker: selectedOptionsPool.pairTicker,
        },
      })
      .then((res) => {
        setMarkPrice(res.data.lastPrice);
      })
      .catch((err) => {
        console.error(err);
        toast.error('Failed to fetch mark price');
      });
  }, [selectedOptionsPool]);

  useEffect(() => {
    if (!selectedOptionsPool || !chain) return;
    axios
      .get(`${VARROCK_BASE_API_URL}/clamm/stats`, {
        params: {
          chainId: chain.id,
          callToken: selectedOptionsPool.callToken.address,
          putToken: selectedOptionsPool.putToken.address,
        },
      })
      .then((res) => {
        setStats({
          oi: res.data.oi ?? 0,
          tvl: res.data.tvl ?? 0,
        });
      })
      .catch((err) => {
        console.error(err);
        toast.error('Failed to fetch stats');
      });
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
