export const EXPIRIES: { [key: string]: number } = {
  '20m': 20 * 60,
  '1h': 60 * 60,
  '2h': 2 * 60 * 60,
  '6h': 6 * 60 * 60,
  '12h': 12 * 60 * 60,
  '24h': 24 * 60 * 60,
};

export const EXPIRIES_TO_KEY: { [key: number]: string } = {
  [20 * 60]: '20m',
  [60 * 60]: '1h',
  [2 * 60 * 60]: '2h',
  [6 * 60 * 60]: '6h',
  [12 * 60 * 60]: '12h',
  [24 * 60 * 60]: '24h',
};

export const EXPIRIES_MENU = Object.keys(EXPIRIES);
export const EXPIRIES_BY_INDEX = Object.values(EXPIRIES);

export const MULTI_CALL_FN_SIG =
  'function multicall(bytes[] calldata data) external returns (bytes[] memory results)';

export const PROTOCOL_FEES_MULTIPLIER = 1.34;
