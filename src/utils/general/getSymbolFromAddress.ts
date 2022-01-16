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
  return output;
}
