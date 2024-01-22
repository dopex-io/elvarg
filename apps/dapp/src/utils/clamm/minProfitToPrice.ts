import { formatUnits, parseUnits } from 'viem';

type Params = {
  isPut: boolean;
  strike: bigint;
  minProfit: bigint;
  optionsAmount: bigint;
  profitPrecision: number;
};

function minProfitToPrice({
  isPut,
  minProfit,
  optionsAmount,
  strike,
  profitPrecision,
}: Params) {
  if (isPut)
    minProfit = (minProfit * strike) / parseUnits('1', profitPrecision);
  const profitPrice =
    (minProfit * parseUnits('1', profitPrecision)) / optionsAmount;
  const limitPrice = formatUnits(
    isPut ? strike - profitPrice : profitPrice + strike,
    profitPrecision,
  );
  return Number(limitPrice);
}
export default minProfitToPrice;
