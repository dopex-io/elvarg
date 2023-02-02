import BigNumber from 'bignumber.js';

BigNumber.config({ EXPONENTIAL_AT: 1e9 });

const sanitizeValue = (x: string | number | BigNumber): string | number => {
  if (BigNumber.isBigNumber(x)) {
    return x.toString();
  }
  return x;
};

export default sanitizeValue;
