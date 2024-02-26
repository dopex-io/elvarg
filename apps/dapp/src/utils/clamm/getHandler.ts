import { Address } from 'viem';

const getHandler = (name: string, chainId: number): Address | undefined => {
  if (chainId === 42161) {
    if (name.toLowerCase() === 'uniswap') {
      return '0x29BbF7EbB9C5146c98851e76A5529985E4052116';
    }
  }
};

export default getHandler;
