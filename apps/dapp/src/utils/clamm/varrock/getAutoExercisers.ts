import { Address, Hex } from 'viem';

import queryClient from 'queryClient';

import { VARROCK_BASE_API_URL } from 'constants/env';

type Options = {
  account: string | Address;
  optionMarket: string | Address;
};

export type Delegators = {
  name: string;
  approved: boolean;
  revokeApproveTxData: {
    txData: Hex;
    to: Address;
  };
  approveTxData: {
    txData: Hex;
    to: Address;
  };
};
async function getAutoExercisers({ account, optionMarket }: Options) {
  const delegators = await queryClient.fetchQuery({
    queryKey: ['CLAMM-AUTO-EXERCISERS'],
    queryFn: async () => {
      const url = new URL(
        `${VARROCK_BASE_API_URL}/clamm/auto-exerciser/delegators`,
      );
      url.searchParams.set('account', account);
      url.searchParams.set('optionMarket', optionMarket);
      return await fetch(url).then((res) => res.json());
    },
  });

  if (delegators.error) {
    return [];
  }
  return delegators as Delegators[];
}
export default getAutoExercisers;
