import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

export default function sanitizeOptionSymbol(symbol: string) {
  const regex = /(CALL)(\d+)/;

  const match = symbol.match(regex);

  const newSymbol = match
    ? // @ts-ignore TODO: FIX
      symbol.replace(match[2], getUserReadableAmount(match[2], 8).toString())
    : symbol;

  return newSymbol;
}
