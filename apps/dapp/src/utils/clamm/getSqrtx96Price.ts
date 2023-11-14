function getSqrtx96Price(
  sqrtx96: bigint,
  token0Precision: number,
  token1Precision: number,
  inversePrice: boolean,
) {
  const num = Number((sqrtx96 * sqrtx96).toString());
  const denom = 2 ** 192;
  const price1 = ((num / denom) * token0Precision) / token1Precision;
  return inversePrice ? 1 / price1 : price1;
}

export default getSqrtx96Price;
