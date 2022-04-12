export default function getAssetFromOptionSymbol(symbol: string) {
  const regex = /^[a-zA-Z0-9]+/;

  const match = symbol.match(regex);

  return match[0];
}
