import React, { useEffect } from 'react';

import { Skeleton } from '@mui/material';

import { useQuery } from '@tanstack/react-query';

import { formatAmount } from 'utils/general';

import { VARROCK_V2_bASE_API_URL } from '../../constants';

const Volume24h = () => {
  const optionsMarketAddress = '0x8a791620dd6260079bf849dc5567adc3f2fdc318';
  const chainId = 31337;

  const { data, refetch, isLoading } = useQuery<number>({
    queryKey: ['CLAMM', 'volume', optionsMarketAddress, chainId],
    queryFn: async () => {
      const url = new URL(`${VARROCK_V2_bASE_API_URL}/clamm/stats/volume`);
      url.searchParams.set('chainId', chainId.toString());
      url.searchParams.set('optionMarket', optionsMarketAddress.toLowerCase());
      url.searchParams.set(
        'from',
        ((new Date().getTime() - 86400000) / 1000).toFixed(0),
      );
      url.searchParams.set('to', (new Date().getTime() / 1000).toFixed(0));

      return fetch(url)
        .then((res) => res.json())
        .catch((err) => {
          console.error(err);
          return 0;
        });
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 10_000);
    return () => clearInterval(interval);
  }, [refetch]);

  return (
    <div className="flex flex-col items-start">
      <div className="flex items-center space-x-[4px]">
        <div className="text-stieglitz">$</div>
        {isLoading ? (
          <Skeleton height={13} width={80} />
        ) : (
          <div className="text-[13px] md:text-[16px]">
            {formatAmount(data ?? 0, 3)}
          </div>
        )}
      </div>
      <div className="text-[16px] text-stieglitz font-semibold">24h Volume</div>
    </div>
  );
};

export default Volume24h;
