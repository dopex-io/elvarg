import { zeroAddress } from 'viem';

import queryClient from 'queryClient';

import { VARROCK_BASE_API_URL } from 'constants/env';

import { GetExerciseTxDataParam } from './types';

async function getExerciseTxData(params: GetExerciseTxDataParam) {
  const { optionMarket, positionId, slippage, type } = params;
  const response = await queryClient.fetchQuery({
    queryKey: ['CLAMM-EXERCISE-TX-DATA', optionMarket],
    queryFn: async () => {
      const url = new URL(`${VARROCK_BASE_API_URL}/clamm/exercise/${type}`);
      url.searchParams.set('optionMarket', optionMarket);
      url.searchParams.set('positionId', positionId);
      url.searchParams.set('slippage', slippage);
      return await fetch(url).then((res) => res.json());
    },
  });

  if (!response.txData) {
    return {
      txData: '0x0',
      to: zeroAddress,
      error: true,
    };
  } else {
    return {
      ...response,
      error: false,
    };
  }
}

export default getExerciseTxData;
