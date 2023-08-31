const EXPIRIES: { [key: string]: number } = {
  '5m': 5 * 60,
  '10m': 10 * 60,
  '15m': 15 * 60,
  '2h': 2 * 60 * 60,
  '6h': 6 * 60 * 60,
  '12h': 12 * 60 * 60,
  '24h': 24 * 60 * 60,
};

export const EXPIRIES_MENU = Object.keys(EXPIRIES);
