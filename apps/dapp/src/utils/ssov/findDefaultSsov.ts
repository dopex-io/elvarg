import MARKETS from 'constants/vaults/markets';

const findDefaultSsov = (marketName: string) => {
  const market = MARKETS[marketName];

  if (!market) return;

  return market.vaults.find((vault) => {
    if (
      vault.duration === market.default.duration &&
      vault.isPut === market.default.isPut
    ) {
      return true;
    }
  });
};

export default findDefaultSsov;
