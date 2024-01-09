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
  return (isPut ? strike - limitPrice : limitPrice - strike) * optionsAmount;
}

export default priceToMinProfit;
