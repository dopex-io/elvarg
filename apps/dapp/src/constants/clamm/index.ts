import { Address } from 'viem';

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

export type FilterSettingsType = {
  bundleSize: string;
  range: number[];
  liquidityThreshold: number[];
};

export const DEFAULT_STRIKES_CHAIN_FILTER_SETTINGS = {
  bundleSize: '',
  range: [],
  liquidityThreshold: [0, 0],
};

export const UNISWAP_V3_SWAPPER: Address =
  '0x985A3f3D6822F037968d48Aa3F7D7d990D72F333';

export const EXERCISE_PLUGINS = {
  'LIMIT-EXERCISE': {
    name: 'Limit Price Exercise',
    description:
      "Configure prices at which you'd want your options to be exercised at.",
    contract: '0xF77739000753bFE15d23A4aF9f717e7db766c92e' as Address,
  },
  'AUTO-EXERCISE': {
    name: 'Time Based Auto Exericse',
    description:
      'ITM (Profitable) options are exercised 5 minutes before expiry.',
    contract: '0xb223eD797742E096632c39d1b2e0c313750B25FE' as Address,
  },
};
