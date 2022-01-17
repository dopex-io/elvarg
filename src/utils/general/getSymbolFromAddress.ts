import { Addresses } from '@dopex-io/sdk';

export default function getSymbolFromAddress(address: string, chainId: number) {
  let output = null;
  Object.keys(Addresses[chainId]).map((symbol) => {
    if (typeof Addresses[chainId][symbol] === 'string') {
      if (Addresses[chainId][symbol].toLowerCase() === address.toLowerCase()) {
        output = symbol;
      }
    }
  });
  if (!output) {
    if (chainId === 1 || chainId === 42161 || chainId === 421611)
      output = 'ETH';
    else output = 'BNB';
  }
  return output;
}
