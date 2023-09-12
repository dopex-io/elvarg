import { useCallback, useEffect, useState } from 'react';

import format from 'date-fns/format';

import useVaultStore from 'hooks/option-amm/useVaultStore';

import Pill from 'components/ssov-beta/Tables/Pill';

import getExpiry from 'utils/date/getExpiry';
import findVault from 'utils/optionAmm/findVault';

import {
  AmmDuration,
  ammDurations,
  MARKETS,
  vaultZeroState,
} from 'constants/optionAmm/markets';

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

  useEffect(() => {
    setDuration(vault.duration);
    setIsPut(vault.isPut);
  }, [vault.duration, vault.isPut]);

  const handleSelectSide = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!duration) return;
      const _isPut = e.currentTarget.value === 'Put';
      let _duration = duration;

      setIsPut(_isPut);

      let _vault = findVault(market);

      if (!_vault) {
        setDuration(_duration);
        update({ ...vaultZeroState });
      }
      if (_vault) {
        update({
          ...vault,
          symbol: market,
          duration: _duration,
          underlyingSymbol: market.split('-')[0],
          underlyingTokenAddress: _vault.underlyingTokenAddress,
          isPut: _isPut,
          collateralTokenAddress: _vault.collateralTokenAddress,
          collateralSymbol: market.split('-')[1],
        });
      }
    },
    [duration, market, update, vault],
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
        buttons={['Call', 'Put'].map((side) => ({
          textContent: side,
          value: side,
          handleClick: handleSelectSide,
        }))}
        active={isPut ? 'Put' : 'Call'}
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
