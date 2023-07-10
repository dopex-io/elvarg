import MARKETS from 'constants/vaults/markets';

const getMarketDurations = (marketName: string, isPut: boolean) => {
  const market = MARKETS[marketName];

  if (!market) return [];

  return Array.from(
    new Set(
      market.vaults
        .filter((vault) => vault.isPut === isPut)
        .map((vault) => {
          return vault.duration;
        })
    )
  );
};

export default getMarketDurations;
