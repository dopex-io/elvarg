import { Address } from 'viem';

import { HANDLER_TO_POOLS } from 'constants/clamm';

type Params = {
  name: string;
  chainId: number;
  callSymbol: string;
  putSymbol: string;
};
const getHandlerPool = ({
  callSymbol,
  chainId,
  name,
  putSymbol,
}: Params): Address => {
  const poolKey = callSymbol
    .toLowerCase()
    .concat('-')
    .concat(putSymbol.toLowerCase());
  const handlersToPools = HANDLER_TO_POOLS[chainId];
  if (!handlersToPools) throw Error('ChainID Handler config not set');

  const handlerPools = handlersToPools[name];
  if (!handlerPools) throw Error('handler pool config not set');

  const pool = handlerPools[poolKey];

  if (!pool) throw Error('handler pool not set');

  return pool;
};

export default getHandlerPool;
