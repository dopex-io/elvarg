type Params = {
  isPut: boolean;
  strike: number;
  minProfit: number;
  optionsAmount: number;
};

function minProfitToPrice({ isPut, minProfit, optionsAmount, strike }: Params) {
  const profitPrice = minProfit / optionsAmount;
  return isPut ? strike - profitPrice : profitPrice + strike;
}
export default minProfitToPrice;
