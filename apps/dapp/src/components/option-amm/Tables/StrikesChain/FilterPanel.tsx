import { useCallback, useEffect, useState } from 'react';

import { addDays } from 'date-fns';
import format from 'date-fns/format';

import useVaultStore from 'hooks/option-amm/useVaultStore';

import Pill from 'components/ssov-beta/Tables/Pill';

import getWeeklyExpiry from 'utils/date/getWeeklyExpiry';

import {
  AmmDuration,
  ammDurations,
  MARKETS,
  vaultZeroState,
} from 'constants/optionAmm/markets';

const getDailyExpiry = () => {
  return addDays(new Date().setUTCHours(8, 0, 0), 1);
};

const getExpiry = (duration: AmmDuration) => {
  switch (duration) {
    case 'WEEKLY':
      return getWeeklyExpiry();
    case 'MONTHLY':
      return getWeeklyExpiry();
    default:
      return getDailyExpiry();
  }
};

const findVault = (marketName: string) => {
  const market = MARKETS[marketName.split('-')[0]].vaults.find(
    (vault) => vault.symbol === marketName,
  );

  if (!market) return;

  return market;
};

const getMarketDurations = (marketName: string) => {
  const market = MARKETS[marketName.split('-')[0]];

  if (!market) return [];

  return ammDurations;
};

interface Props {
  market: string;
}

const FilterPanel = (props: Props) => {
  const { market } = props;

  const vault = useVaultStore((vault) => vault.vault);
  const update = useVaultStore((vault) => vault.update);

  const [isPut, setIsPut] = useState(false);
  const [duration, setDuration] = useState<AmmDuration>('WEEKLY');

  const handleSelectDuration = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const _duration = e.currentTarget.value as AmmDuration;
      setDuration(_duration);
      update({ ...vault, duration: _duration });
    },
    [update, vault],
  );

  const handleSelectSide = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!duration) return;
      const _isPut = e.currentTarget.value === 'PUT';
      let _duration = duration;

      setIsPut(_isPut);

      let _vault = findVault(market);

      if (!_vault) {
        setDuration(_duration);
        update({ ...vaultZeroState });
      }
      if (_vault) {
        update({
          symbol: market,
          address: _vault.address,
          duration: _duration,
          underlyingSymbol: market.split('-')[0],
          underlyingAddress: _vault.underlyingTokenAddress,
          isPut: _isPut,
          lp: '0x',
          collateralTokenAddress: _vault.collateralTokenAddress,
          collateralSymbol: market.split('-')[1],
        });
      }
    },
    [update, duration, market],
  );

  // updates default selection of duration/side if the market has been changed
  useEffect(() => {
    if (market) {
      setIsPut(MARKETS[market.split('-')[0]].default.isPut);
      setDuration(MARKETS[market.split('-')[0]].default.duration);
    }
  }, [market]);

  return (
    <div className="flex space-x-2 z-10">
      <Pill
        buttons={['CALL', 'PUT'].map((side) => ({
          textContent: side,
          value: side,
          handleClick: handleSelectSide,
        }))}
        active={isPut ? 'PUT' : 'CALL'}
      />
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
