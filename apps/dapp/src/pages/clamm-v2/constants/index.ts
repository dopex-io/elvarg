import { Address } from 'viem';

export const VARROCK_V2_bASE_API_URL = 'http://localhost:6969';
export const getPositionManagerAddress = (chainId: number) => {
  if (chainId === 42161) {
    return '0xe4ba6740af4c666325d49b3112e4758371386adc';
  }
};
export const getHandler = (
  name: string,
  chainId: number,
): Address | undefined => {
  if (chainId === 42161) {
    if (name.toLowerCase() === 'uniswap') {
      return '0x29BbF7EbB9C5146c98851e76A5529985E4052116';
    }
  }
};
