import queryClient from 'queryClient';

import { VARROCK_BASE_API_URL } from 'constants/env';

async function getStats(optionMarket: string) {
  const baseStatsPath = `${VARROCK_BASE_API_URL}/clamm/stats`;
  const statsResponse = await Promise.all([
    queryClient.fetchQuery({
      queryKey: ['CLAMM-STATS-OI'],
      queryFn: async () => {
        const url = new URL(`${baseStatsPath}/open-interest`);
        url.searchParams.set('optionMarket', optionMarket);
        return fetch(url).then((res) => res.json());
      },
    }),
    queryClient.fetchQuery({
      queryKey: ['CLAMM-STATS-TVL'],
      queryFn: async () => {
        const url = new URL(`${baseStatsPath}/tvl`);
        url.searchParams.set('optionMarket', optionMarket);
        return fetch(url).then((res) => res.json());
      },
    }),
    queryClient.fetchQuery({
      queryKey: ['CLAMM-STATS-VOLUME'],
      queryFn: async () => {
        const url = new URL(`${baseStatsPath}/volume`);
        url.searchParams.set('optionMarket', optionMarket);
        return fetch(url).then((res) => res.json());
      },
    }),
    queryClient.fetchQuery({
      queryKey: ['CLAMM-STATS-FEE'],
      queryFn: async () => {
        const url = new URL(`${baseStatsPath}/fees`);
        url.searchParams.set('optionMarket', optionMarket);
        return fetch(url).then((res) => res.json());
      },
    }),
  ]);

  return {
    openInterest: {
      ...statsResponse[0],
    },
    tvl: {
      ...statsResponse[1],
    },
    volume: {
      ...statsResponse[2],
    },
    fees: {
      ...statsResponse[3],
    },
  };
}

export default getStats;
