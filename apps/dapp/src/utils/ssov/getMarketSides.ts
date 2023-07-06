import MARKETS from 'constants/vaults/markets';

const getMarketSides = (marketName: string) => {
  const market = MARKETS[marketName];

  if (!market) return [];

  return Array.from(
    new Set(
      market.vaults.map((vault) => {
        return vault.isPut ? 'PUT' : 'CALL';
      })
    )
  );
};

export default getMarketSides;
