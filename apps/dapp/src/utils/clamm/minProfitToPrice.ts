type Params = {
  isPut: boolean;
  strike: number;
  minProfit: number;
  optionsAmount: number;
};

function minProfitToPrice({ isPut, minProfit, optionsAmount, strike }: Params) {
  const profitPrice = minProfit / optionsAmount;
  return isPut ? profitPrice - strike : profitPrice + strike;
}
export default minProfitToPrice;
