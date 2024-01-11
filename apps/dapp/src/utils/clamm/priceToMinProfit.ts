type Params = {
  isPut: boolean;
  strike: number;
  limitPrice: number;
  optionsAmount: number;
};

function priceToMinProfit({
  isPut,
  limitPrice,
  optionsAmount,
  strike,
}: Params) {
  if (limitPrice === 0) return 0;
  return (isPut ? strike - limitPrice : limitPrice - strike) * optionsAmount;
}

export default priceToMinProfit;
