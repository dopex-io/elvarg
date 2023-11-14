import { zeroAddress } from 'viem';

import queryClient from 'queryClient';

import { VARROCK_BASE_API_URL } from 'constants/env';

async function getAddresses() {
  const [positionManager, handler] = await Promise.all([
    queryClient.fetchQuery({
      queryKey: ['CLAMM-POSITION-MANAGER'],
      queryFn: async () => {
        return await fetch(
          `${VARROCK_BASE_API_URL}/clamm/addresses/position-manager`,
        ).then((res) => res.json());
      },
    }),
    queryClient.fetchQuery({
      queryKey: ['CLAMM-POSITION-HANDLERS'],
      queryFn: async () => {
        return await fetch(
          `${VARROCK_BASE_API_URL}/clamm/addresses/handlers`,
        ).then((res) => res.json());
      },
    }),
  ]);

  return {
    positionManager: positionManager.address
      ? positionManager.address
      : zeroAddress,
    handler: handler.address ? handler.address : zeroAddress,
  };
}
export default getAddresses;
