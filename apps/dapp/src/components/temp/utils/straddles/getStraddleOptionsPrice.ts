import blackScholes from 'utils/math/blackScholes';

export function getStraddleOptionsPrice(
  strike: number,
  currentPrice: number,
  volatility: number,
  expiry: number,
) {
  const secondsInOneYear = 365 * 24 * 60 * 60000;
  expiry = (expiry - new Date().getTime()) / secondsInOneYear;
  if (expiry < 0) return 0;

  const callOptionPrice = blackScholes(
    currentPrice,
    strike,
    expiry,
    volatility,
    0,
    'call',
  );

  const putOptionPrice = blackScholes(
    strike,
    strike,
    expiry,
    volatility,
    0,
    'put',
  );

  return callOptionPrice + putOptionPrice;
}
