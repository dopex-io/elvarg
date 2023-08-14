import { SsovDuration } from 'types/ssov';

import { MARKETS } from 'constants/ssov/markets';

const findSsov = (
  marketName: string,
  isPut: boolean,
  duration: SsovDuration
) => {
  const market = MARKETS[marketName];

  if (!market) return;

  return market.vaults.find((vault) => {
    if (vault.duration === duration && vault.isPut === isPut) {
      return true;
    }
  });
};

export default findSsov;
