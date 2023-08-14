import {
  getDelta,
  getGamma,
  getTheta,
  getVega,
} from 'utils/math/blackScholes/greeks';

interface Args {
  spot: number;
  strike: number;
  expiryInYears: number;
  ivInDecimals: number;
  isPut: boolean;
}

const computeOptionGreeks = ({
  spot,
  strike,
  expiryInYears,
  ivInDecimals,
  isPut,
}: Args) => {
  const delta = getDelta(spot, strike, expiryInYears, ivInDecimals, 0, isPut);
  const gamma = getGamma(spot, strike, expiryInYears, ivInDecimals, 0);
  const vega = getVega(spot, strike, expiryInYears, ivInDecimals, 0);
  const theta = getTheta(
    spot,
    strike,
    expiryInYears,
    ivInDecimals,
    0,
    isPut,
    365
  );

  return {
    delta,
    gamma,
    vega,
    theta,
  };
};

export default computeOptionGreeks;
