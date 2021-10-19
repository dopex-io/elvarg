export default function isValidStrike(
  range: number,
  currentPrice: number,
  incrementedPrice: number
): boolean {
  const max = currentPrice + (currentPrice * range) / 100;
  const min = currentPrice - (currentPrice * range) / 100;

  return min <= incrementedPrice && incrementedPrice <= max;
}
