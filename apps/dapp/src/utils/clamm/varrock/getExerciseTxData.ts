import { Address, Hex, zeroAddress } from 'viem';

import queryClient from 'queryClient';

import { VARROCK_BASE_API_URL } from 'constants/env';

type GetExerciseTxDataParam = {
  optionMarket: Address;
  positionId: string;
  slippage: string;
};
async function getExerciseTxData(params: GetExerciseTxDataParam): Promise<{
  txData: Hex;
  to: Address;
  error: boolean;
}> {
  const { optionMarket, positionId, slippage } = params;
  const response = await queryClient.fetchQuery({
    queryKey: ['CLAMM-EXERCISE-TX-DATA'],
    queryFn: async () => {
      const url = new URL(`${VARROCK_BASE_API_URL}/clamm/exercise/`);
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
