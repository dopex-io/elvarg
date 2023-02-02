// @ts-nocheck TODO: FIX
export const getValueInUsdFromSymbol = (
  symbol,
  tokenPrices,
  userAssetBalances,
  decimals
) => {
  let value = 0;
  tokenPrices.map((record) => {
    if (record['name'] === symbol) {
      value =
        (record['price'] * parseInt(userAssetBalances[symbol])) /
        10 ** decimals;
    }
  });
  return value;
};
