import decimals from 'constants/decimals.json';

export default function getDecimalsFromSymbol(symbol: string, chainId: number) {
  return decimals[chainId][symbol] || 18;
}
