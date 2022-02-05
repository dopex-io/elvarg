export const getValueInUsdFromSymbol = (
  symbol,
  tokenPrices,
  userAssetBalances
) => {
  let value = 0;
  tokenPrices.map((record) => {
    if (record['name'] === symbol) {
      value =
        (record['price'] * parseInt(userAssetBalances[symbol])) / 10 ** 18;
    }
  });
  return value;
};
