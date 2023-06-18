/**
 * @param symbol Symbol of the option token in the format of:
 *               [underlying symbol]-[expiry]-[strike]-[type].
 *               ex: DPX-23JUN23-104-C
 */
export default function parseOptionSymbol(symbol: string) {
  const split = symbol.split(' ');
  const callStrike = `${split[3] + split[2]}`;
  const underlying = split[0];
  const expiry = split[1];

  return `${underlying} ${callStrike} ${expiry}`;
}
