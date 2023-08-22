import { useCallback, useEffect, useState } from 'react';

import format from 'date-fns/format';

import Pill from 'components/ssov-beta/Tables/Pill';

import getExpiry from 'utils/ssov/getExpiry';

import { AmmDuration, MARKETS } from 'constants/optionAmm/markets';

import { SsovDuration } from 'types/ssov';

const findDefaultMarket = (marketName: string) => {
  const market = MARKETS[marketName.split('-')[0]];

  if (!market) return;

  return market.vaults.find(
    (vault) => vault.duration === market.default.duration,
  );
};

const findAmmMarket = (marketName: string, duration: SsovDuration) => {
  const market = MARKETS[marketName.split('-')[0]];
  if (!market) return;
  return market.vaults.find((vault) => vault.duration === duration);
};

const getMarketDurations = (marketName: string) => {
  const market = MARKETS[marketName.split('-')[0]];

  if (!market) return [];

  return Array.from(
    new Set(
      market.vaults.map((vault) => {
        return vault.duration;
      }),
    ),
  );
};

interface Props {
  market: string;
}

const FilterPanel = (props: Props) => {
  const { market } = props;

  const [duration, setDuration] = useState<AmmDuration>('WEEKLY');

  const handleSelectDuration = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const _duration = e.currentTarget.value as SsovDuration;
      setDuration(_duration);

      // let vault = findAmmMarket(market, _duration);
    },
    [],
  );

  // updates default selection of duration/side if the market has been changed
  useEffect(() => {
    const vault = findDefaultMarket(market);

    if (vault) {
      setDuration(vault?.duration);
    }
  }, [market]);

  return (
    <div className="flex space-x-2 z-10">
      <Pill
        buttons={getMarketDurations(market).map((duration) => {
          return {
            textContent: format(getExpiry(duration), 'dd MMM yyyy'),
            value: duration,
            handleClick: handleSelectDuration,
          };
        })}
        active={duration || 'WEEKLY'}
      />
    </div>
  );
};

export default FilterPanel;
