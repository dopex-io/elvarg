import MARKETS from 'constants/vaults/markets';

const getMarketDurations = (marketName: string) => {
  const market = MARKETS[marketName];

  if (!market) return [];

  return Array.from(
    new Set(
      market.vaults.map((vault) => {
        return vault.duration;
      })
    )
  );
};

export default getMarketDurations;
