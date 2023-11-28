import React, { useCallback, useEffect, useState } from 'react';

import { Skeleton } from '@dopex-io/ui';

import useClammStore from 'hooks/clamm/useClammStore';

import Stat from 'components/clamm/TitleBar/Stat';

import getMarkPrice from 'utils/clamm/varrock/getMarkPrice';
import getStats from 'utils/clamm/varrock/getStats';

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
  activePair: string;
};

const OverViewStats = () => {
  const { selectedOptionsPool, markPrice, setMarkPrice, setTick } =
    useClammStore();

  const [loading, setLoading] = useState(false);
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
    activePair: 'ARB-USDC',
  });

  const updateStats = useCallback(async () => {
    if (!selectedOptionsPool) return;

    await getStats(selectedOptionsPool.optionsPoolAddress).then((data) =>
      setStats((prev) => ({
        ...prev,
        ...data,
        activePair: selectedOptionsPool.pairName,
      })),
    );
  }, [selectedOptionsPool]);

  const updatePrice = useCallback(async () => {
    if (!selectedOptionsPool) return;

    return await getMarkPrice(
      selectedOptionsPool.pairTicker,
      ({ price, tick }) => {
        setMarkPrice(price);
        setTick(tick);
      },
      () => {},
    );
  }, [selectedOptionsPool, setMarkPrice, setTick]);

  useEffect(() => {
    setLoading(true);
    updateStats().finally(() => setLoading(false));
    const updateStatsInterval = setInterval(() => updateStats(), 15000);
    return () => clearInterval(updateStatsInterval);
  }, [updateStats]);

  useEffect(() => {
    setLoading(true);
    updatePrice().finally(() => setLoading(false));
    const updatePriceInterval = setInterval(() => updatePrice(), 5000);
    return () => clearInterval(updatePriceInterval);
  }, [updatePrice]);

  return (
    <div className="grid grid-flow-col md:grid-rows-1 grid-rows-2 gap-y-4 w-full md:w-2/5">
      {!loading ? (
        <>
          <Stat
            stat={{
              symbol: '$',
              value: markPrice.toString(),
            }}
            label="Mark Price"
          />
          <Stat
            stat={{
              symbol: stats.openInterest.symbol,
              value: stats.openInterest.openInterest,
            }}
            label="Open Interest"
          />
          <Stat
            stat={{
              symbol: stats.tvl.symbol,
              value: stats.tvl.tvl,
            }}
            label="Total Deposits"
          />
          <Stat
            stat={{
              symbol: stats.volume.symbol,
              value: stats.volume.volume,
            }}
            label="Total Volume"
          />
          <Stat
            stat={{
              symbol: stats.fees.symbol,
              value: stats.fees.fees,
            }}
            label="Total Fees"
          />
        </>
      ) : (
        <>
          {Array.from(Array(5)).map((_, index) => (
            <div key={index} className="flex flex-col space-y-2">
              <Skeleton height={10} width={75} />
              <Skeleton height={10} width={50} />
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default OverViewStats;
