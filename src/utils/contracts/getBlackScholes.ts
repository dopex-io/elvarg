const RISK_FREE_RATE: number = 0.03;

// https://gist.github.com/santacruz123/3623310
export default function getBlackScholes(
  isPut: boolean,
  spot: number,
  strike: number,
  timeToMaturity: number,
  volatility: number
): number {
  var d1 =
    (Math.log(spot / strike) +
      (RISK_FREE_RATE + (volatility * volatility) / 2) * timeToMaturity) /
    (volatility * Math.sqrt(timeToMaturity));
  var d2 = d1 - volatility * Math.sqrt(timeToMaturity);
  if (!isPut) {
    return (
      spot * CND(d1) -
      strike * Math.exp(-RISK_FREE_RATE * timeToMaturity) * CND(d2)
    );
  }
  return (
    strike * Math.exp(-RISK_FREE_RATE * timeToMaturity) * CND(-d2) -
    spot * CND(-d1)
  );
}

/* The cumulative Normal distribution function: */
function CND(x: number): number {
  if (x < 0) {
    return 1 - CND(-x);
  }
  const k = 1 / (1 + 0.2316419 * x);
  return (
    1 -
    (Math.exp((-x * x) / 2) / Math.sqrt(2 * Math.PI)) *
      k *
      (0.31938153 +
        k *
          (-0.356563782 +
            k * (1.781477937 + k * (-1.821255978 + k * 1.330274429))))
  );
}
