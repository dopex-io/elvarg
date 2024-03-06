import { Address } from 'viem';

const getHook = (chainId: number, name: string): Address | undefined => {
  if (chainId === 42161) {
    if (name === '24HTTL') {
      return '0x8c30c7F03421D2C9A0354e93c23014BF6C465a79';
    }
  }
  if (chainId === 5000) {
    if (name === '24HTTL') {
      return '0xe68Db25857261874359bC5CFB8D04C0C012ac24C';
    }
  }
};

export default getHook;
