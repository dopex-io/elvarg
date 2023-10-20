import React, { useCallback, useState } from 'react';

type OverviewStats = {
  oi: number;
  tvl: number;
  totalVolume: number;
};

const useOverviewStats = () => {
  const [stats, setStats] = useState<OverviewStats>({
    oi: 0,
    tvl: 0,
    totalVolume: 0,
  });
  const updateStats = useCallback(() => {
    setStats({
      oi: 1,
      tvl: 1,
      totalVolume: 1,
    });
  }, []);

  return { stats, updateStats };
};

export default useOverviewStats;
