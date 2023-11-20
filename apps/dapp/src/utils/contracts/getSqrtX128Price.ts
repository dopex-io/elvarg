export default function getSqrtX128Price(
  sqrtX96: bigint,
  token0Precision: number,
  token1Precision: number,
  inversePrice: boolean,
) {
  const num = Number((sqrtX96 * sqrtX96).toString());
  const denom = 2 ** 256;
  const price1 = ((num / denom) * token0Precision) / token1Precision;
  return inversePrice ? 1 / price1 : price1;
}
