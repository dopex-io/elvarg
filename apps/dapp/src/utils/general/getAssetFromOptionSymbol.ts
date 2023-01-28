export default function getAssetFromOptionSymbol(symbol: string) {
  const regex = /^[a-zA-Z0-9]+/;

  const match = symbol.match(regex);
  // @ts-ignore TODO: FIX
  return match[0];
}
