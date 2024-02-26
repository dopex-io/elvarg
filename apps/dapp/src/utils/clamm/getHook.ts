import { Address } from 'viem';

const getHook = (chainId: number, name: string): Address | undefined => {
  if (chainId === 42161) {
    if (name === '24HTTL') {
      return '0x8c30c7F03421D2C9A0354e93c23014BF6C465a79';
    }
  }
};

export default getHook;
