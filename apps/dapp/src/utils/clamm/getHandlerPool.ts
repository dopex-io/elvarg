import { Address } from 'viem';

const getHandlerPool = (
  name: string,
  chainId: number,
  callToken: Address,
  putToken: Address,
  fee: number,
): Address | undefined => {
  if (chainId == 42161) {
    if (name === 'uniswap') {
      if (fee === 500) {
        if (
          callToken.toLowerCase() ===
            '0x82af49447d8a07e3bd95bd0d56f35241523fbab1' &&
          putToken.toLowerCase() ===
            '0xaf88d065e77c8cc2239327c5edb3a432268e5831'
        ) {
          return '0xC6962004f452bE9203591991D15f6b388e09E8D0';
        }
      }
    }
  }
};

export default getHandlerPool;
