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

export const getHandlerPool = (
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

export const getHook = (chainId: number, name: string): Address | undefined => {
  if (chainId === 42161) {
    if (name === '24HTTL') {
      return '0x8c30c7F03421D2C9A0354e93c23014BF6C465a79';
    }
  }
};
