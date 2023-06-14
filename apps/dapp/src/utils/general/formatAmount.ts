function formatAmount(
  amount: string | number = 0,
  decimalPoints: number = 0,
  showK: boolean = false,
  showDash: boolean = false
): string {
  const typecastedAmount = Math.abs(Number(amount));
  const isNeg = Number(amount) < 0;
  let result;

  if (showDash && typecastedAmount === 0) {
    result = '--';
  } else {
    if (showK && typecastedAmount > 999 && typecastedAmount < 1000000) {
      result = (typecastedAmount / 1000).toFixed(1) + 'K'; // convert to K for number from > 1000 < 1 million
    } else if (typecastedAmount >= 1000000 && typecastedAmount < 100000000000) {
      result = (typecastedAmount / 1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million
    } else if (typecastedAmount >= 100000000000) {
      result = '∞';
    } else {
      result = Number(typecastedAmount.toFixed(decimalPoints)).toLocaleString(); // if value < 1000, nothing to do
    }
  }

  return isNeg ? `-${result}` : result;
}

export default formatAmount;
