export const EXPIRIES: { [key: string]: number } = {
  '1h': 60 * 60,
  '2h': 2 * 60 * 60,
  '6h': 6 * 60 * 60,
  '12h': 12 * 60 * 60,
  '24h': 24 * 60 * 60,
};

export const EXPIRIES_TO_KEY: { [key: number]: string } = {
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
export const AUTO_EXERCISER_TIME_BASED =
  '0xb223eD797742E096632c39d1b2e0c313750B25FE';

export type FilterSettingsType = {
  bundleSize: string;
  range: number[];
  liquidityThreshold: number[];
};

export const DEFAULT_STRIKES_CHAIN_FILTER_SETTINGS = {
  bundleSize: '',
  range: [],
  liquidityThreshold: [1, 0],
};
