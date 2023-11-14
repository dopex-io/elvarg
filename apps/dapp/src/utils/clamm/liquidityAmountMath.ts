const Q96 = BigInt('0x1000000000000000000000000');
const RESOLUTION = BigInt(96);

export function getLiquidityForAmount0(
  sqrtRatioAX96: bigint,
  sqrtRatioBX96: bigint,
  amount0: bigint,
) {
  if (sqrtRatioAX96 > sqrtRatioBX96) {
    const temp = sqrtRatioBX96;
    sqrtRatioBX96 = sqrtRatioAX96;
    sqrtRatioAX96 = temp;
  }
  const mid = (sqrtRatioAX96 * sqrtRatioBX96) / Q96;
  return (amount0 * mid) / (sqrtRatioBX96 - sqrtRatioAX96);
}

export function getLiquidityForAmount1(
  sqrtRatioAX96: bigint,
  sqrtRatioBX96: bigint,
  amount1: bigint,
) {
  if (sqrtRatioAX96 > sqrtRatioBX96) {
    const temp = sqrtRatioBX96;
    sqrtRatioBX96 = sqrtRatioAX96;
    sqrtRatioAX96 = temp;
  }
  return (amount1 * Q96) / (sqrtRatioBX96 - sqrtRatioAX96);
}

export function getLiquidityForAmounts(
  sqrtRatioX96: bigint,
  sqrtRatioAX96: bigint,
  sqrtRatioBX96: bigint,
  amount0: bigint,
  amount1: bigint,
) {
  let liquidity = 0n;
  if (sqrtRatioAX96 > sqrtRatioBX96) {
    const temp = sqrtRatioBX96;
    sqrtRatioBX96 = sqrtRatioAX96;
    sqrtRatioAX96 = temp;
  }

  if (sqrtRatioX96 <= sqrtRatioAX96) {
    liquidity = getLiquidityForAmount0(sqrtRatioAX96, sqrtRatioBX96, amount0);
  } else if (sqrtRatioX96 < sqrtRatioBX96) {
    const liquidity0 = getLiquidityForAmount0(
      sqrtRatioX96,
      sqrtRatioBX96,
      amount0,
    );
    const liquidity1 = getLiquidityForAmount1(
      sqrtRatioAX96,
      sqrtRatioX96,
      amount1,
    );
    liquidity = liquidity0 < liquidity1 ? liquidity0 : liquidity1;
  } else {
    liquidity = getLiquidityForAmount1(sqrtRatioAX96, sqrtRatioBX96, amount1);
  }

  return liquidity;
}

export function getAmount0ForLiquidity(
  sqrtRatioAX96: bigint,
  sqrtRatioBX96: bigint,
  liquidity: bigint,
) {
  if (sqrtRatioAX96 > sqrtRatioBX96) {
    const temp = sqrtRatioBX96;
    sqrtRatioBX96 = sqrtRatioAX96;
    sqrtRatioAX96 = temp;
  }

  return (
    ((liquidity << RESOLUTION) * (sqrtRatioBX96 - sqrtRatioAX96)) /
    sqrtRatioBX96 /
    sqrtRatioAX96
  );
}

export function getAmount1ForLiquidity(
  sqrtRatioAX96: bigint,
  sqrtRatioBX96: bigint,
  liquidity: bigint,
) {
  if (sqrtRatioAX96 > sqrtRatioBX96) {
    const temp = sqrtRatioBX96;
    sqrtRatioBX96 = sqrtRatioAX96;
    sqrtRatioAX96 = temp;
  }
  return (liquidity * (sqrtRatioBX96 - sqrtRatioAX96)) / Q96;
}

export function getAmountsForLiquidity(
  sqrtRatioX96: bigint,
  sqrtRatioAX96: bigint,
  sqrtRatioBX96: bigint,
  liquidity: bigint,
) {
  if (sqrtRatioAX96 > sqrtRatioBX96) {
    const temp = sqrtRatioBX96;
    sqrtRatioBX96 = sqrtRatioAX96;
    sqrtRatioAX96 = temp;
  }

  let amount0 = 0n;
  let amount1 = 0n;
  if (sqrtRatioX96 <= sqrtRatioAX96) {
    amount0 = getAmount0ForLiquidity(sqrtRatioAX96, sqrtRatioBX96, liquidity);
  } else if (sqrtRatioX96 < sqrtRatioBX96) {
    amount0 = getAmount0ForLiquidity(sqrtRatioX96, sqrtRatioBX96, liquidity);
    amount1 = getAmount1ForLiquidity(sqrtRatioAX96, sqrtRatioX96, liquidity);
  } else {
    amount1 = getAmount1ForLiquidity(sqrtRatioAX96, sqrtRatioBX96, liquidity);
  }

  return {
    amount0,
    amount1,
  };
}
