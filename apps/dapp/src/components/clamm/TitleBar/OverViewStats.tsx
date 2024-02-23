import React, { useEffect } from 'react';
import { checksumAddress } from 'viem';

import { Skeleton } from '@dopex-io/ui';
import { useQuery } from '@tanstack/react-query';
import { useAccount, useNetwork } from 'wagmi';

import useClammStore from 'hooks/clamm/useClammStore';
import useMerklRewards from 'hooks/clamm/useMerklRewards';

import Stat from 'components/clamm/TitleBar/Stat';

import { DEFAULT_CHAIN_ID, VARROCK_BASE_API_URL } from 'constants/env';
import { TOKENS } from 'constants/tokens';

const OverViewStats = () => {
  const { selectedOptionsMarket, markPrice, setMarkPrice, setTick } =
    useClammStore();

  const { address: user = '0x' } = useAccount();

  const { chain } = useNetwork();

  const { data: incomingMarkPrice, isLoading: markPriceLoading } = useQuery<{
    markPrice: number;
    tick: number;
  }>({
    refetchInterval: 3500,
    queryKey: ['clamm-mark-price', selectedOptionsMarket?.address, chain?.id],
    queryFn: async () => {
      if (!selectedOptionsMarket) return 0;
      const url = new URL(`${VARROCK_BASE_API_URL}/uniswap-prices/mark-price`);
      url.searchParams.set(
        'chainId',
        (chain?.id ?? DEFAULT_CHAIN_ID).toString(),
      );
      url.searchParams.set('ticker', selectedOptionsMarket.ticker);
      return fetch(url).then((res) => res.json());
    },
  });

  const { data: tvl } = useQuery<number>({
    queryKey: ['clamm-tvl', selectedOptionsMarket?.address, chain?.id],
    queryFn: async () => {
      if (!selectedOptionsMarket) return 0;
      const url = new URL(`${VARROCK_BASE_API_URL}/clamm/stats/tvl`);
      url.searchParams.set(
        'chainId',
        (chain?.id ?? DEFAULT_CHAIN_ID).toString(),
      );

      url.searchParams.set('optionMarket', selectedOptionsMarket.address);
      return fetch(url).then((res) => res.json());
    },
  });
  const { data: openInterest } = useQuery<number>({
    queryKey: [
      'clamm-open-interest',
      selectedOptionsMarket?.address,
      chain?.id,
    ],
    queryFn: async () => {
      if (!selectedOptionsMarket) return 0;
      const url = new URL(`${VARROCK_BASE_API_URL}/clamm/stats/open-interest`);
      url.searchParams.set(
        'chainId',
        (chain?.id ?? DEFAULT_CHAIN_ID).toString(),
      );

      url.searchParams.set('optionMarket', selectedOptionsMarket.address);
      return fetch(url).then((res) => res.json());
    },
  });

  useEffect(() => {
    if (!incomingMarkPrice) return;
    setMarkPrice(incomingMarkPrice.markPrice);
    setTick(incomingMarkPrice.tick);
  }, [incomingMarkPrice, setMarkPrice, setTick]);

  const { avgAPR } = useMerklRewards({
    user,
    chainId: chain ? chain.id : DEFAULT_CHAIN_ID,
    rewardToken: TOKENS[chain ? chain.id : DEFAULT_CHAIN_ID]
      ? TOKENS[chain ? chain.id : DEFAULT_CHAIN_ID].find(
          (token) => token.symbol.toUpperCase() === 'ARB',
        )
      : undefined,
    pool: checksumAddress(selectedOptionsMarket?.primePool || '0x'),
  });

  return (
    <div className="grid grid-flow-col md:grid-rows-1 grid-rows-2 gap-y-4 w-full md:w-2/4">
      {!markPriceLoading ? (
        <>
          <Stat
            stat={{
              symbol: '$',
              value: markPrice?.toString() ?? '0',
            }}
            label="Mark Price"
          />
          <Stat
            stat={{
              symbol: '$',
              value: openInterest?.toString() ?? '0',
            }}
            label="Open Interest"
          />
          <Stat
            stat={{
              symbol: '$',
              value: tvl?.toString() ?? '0',
            }}
            label="Liquidity"
          />
          <Stat
            stat={{
              symbol: '$',
              value: selectedOptionsMarket?.totalVolume ?? '0',
            }}
            label="Volume"
          />
          <Stat
            stat={{
              symbol: '$',
              value: selectedOptionsMarket?.totalPremium ?? '0',
            }}
            label="Premium"
          />
          <Stat
            stat={{
              symbol: '%',
              value: avgAPR?.toString(),
            }}
            label="Reward APR"
            suffix
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
