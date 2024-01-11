import { parseUnits } from 'viem';

type Params = {
  isPut: boolean;
  strike: bigint;
  limitPrice: bigint;
  profitTokenDecimals: number;
  optionsAmount: bigint;
};

function priceToMinProfit({
  isPut,
  limitPrice,
  optionsAmount,
  strike,
  profitTokenDecimals,
}: Params) {
  if (limitPrice === 0n) return 0n;
  return (
    ((isPut ? strike - limitPrice : limitPrice - strike) * optionsAmount) /
    parseUnits('1', profitTokenDecimals)
  );
}

export default priceToMinProfit;
