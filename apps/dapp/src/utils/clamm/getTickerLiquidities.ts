import request from 'graphql-request';

import queryClient from 'queryClient';

import { getTickerLiquidities } from 'graphql/clamm';

import { DOPEX_CLAMM_SUBGRAPH_API_URL } from 'constants/subgraphs';

async function getTickesrData() {
  // @ts-ignore
  const { tickerLiquidities } = await queryClient.fetchQuery({
    queryKey: ['tickersLiquidityData'],
    queryFn: async () =>
      request(DOPEX_CLAMM_SUBGRAPH_API_URL, getTickerLiquidities, {
        first: 1000,
      }),
  });

  return tickerLiquidities;
}

export default getTickesrData;
