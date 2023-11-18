import { formatUnits } from 'viem';

import { DECIMALS_TOKEN } from 'constants/index';

import { PriceInterval } from './types';

export const getPrice = (d: PriceInterval) => d.priceRange[0];
export const getAvailableLiquidity = (d: PriceInterval) =>
  Number(formatUnits(d.availableAssets, DECIMALS_TOKEN));
