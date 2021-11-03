function formatAmount(
  amount: string | number = 0,
  decimalPoints: number = 0,
  showK: boolean = false,
  showDash: boolean = false
): string {
  const typecastedAmount = Number(amount);
  if (showDash && typecastedAmount === 0) return '--';
  if (showK && typecastedAmount > 999 && typecastedAmount < 1000000) {
    return (typecastedAmount / 1000).toFixed(1) + 'K'; // convert to K for number from > 1000 < 1 million
  } else if (typecastedAmount > 1000000) {
    return (typecastedAmount / 1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million
  }
  return Number(typecastedAmount.toFixed(decimalPoints)).toLocaleString(); // if value < 1000, nothing to do
}

export default formatAmount;
