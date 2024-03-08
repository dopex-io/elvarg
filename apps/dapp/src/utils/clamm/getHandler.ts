import { Address } from 'viem';



import { AMM_TO_HANDLER } from 'constants/clamm';

const getHandler = (name: string, chainId: number): Address | undefined => {
  name = name.toLowerCase();
  const amms = AMM_TO_HANDLER[chainId];
  if (!amms) throw Error('Chain AMM not set');
  const handler = amms[name];
  if (!handler) throw Error('AMM to handler not set');
  return handler;
};

export default getHandler;