import { useCallback, useEffect, useState } from 'react';

import format from 'date-fns/format';

import useVaultStore from 'hooks/ssov/useVaultStore';

import Pill from 'components/ssov-beta/Tables/Pill';

import findDefaultSsov from 'utils/ssov/findDefaultSsov';
import findSsov from 'utils/ssov/findSsov';
import getExpiry from 'utils/ssov/getExpiry';
import getMarketDurations from 'utils/ssov/getMarketDurations';
import getMarketSides from 'utils/ssov/getMarketSides';

import { SsovDuration } from 'types/ssov';

interface Props {
  market: string;
}

const FilterPanel = (props: Props) => {
  const { market } = props;

  const update = useVaultStore((state) => state.update);

  const [isPut, setIsPut] = useState(false);
  const [duration, setDuration] = useState<SsovDuration>('WEEKLY');

  const handleSelectSide = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!duration) return;
      const _isPut = e.currentTarget.value === 'PUT';
      let _duration = duration;

      setIsPut(_isPut);

      let vault = findSsov(market, _isPut, _duration);

      if (!vault) {
        _duration = duration === 'WEEKLY' ? 'MONTHLY' : 'WEEKLY';
        setDuration(_duration);
        vault = findSsov(market, _isPut, _duration);
      }

      if (vault) {
        update({
          address: vault.address,
          duration: vault.duration,
          underlyingSymbol: vault.underlyingSymbol,
          isPut: _isPut,
          collateralTokenAddress: vault.collateralTokenAddress,
        });
      }
    },
    [update, duration, market],
  );

  const handleSelectDuration = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const _duration = e.currentTarget.value as SsovDuration;

      setDuration(_duration);

      let vault = findSsov(market, isPut, _duration);

      if (vault) {
        update({
          address: vault.address,
          duration: _duration,
          collateralTokenAddress: vault.collateralTokenAddress,
          underlyingSymbol: vault.underlyingSymbol,
          isPut,
        });
      }
    },
    [isPut, market, update],
  );

  // updates default selection of duration/side if the market has been changed
  useEffect(() => {
    const vault = findDefaultSsov(market);

    if (vault) {
      setIsPut(vault?.isPut);
      setDuration(vault?.duration);
    }
  }, [market]);

  return (
    <div className="flex space-x-2 z-10">
      <Pill
        buttons={getMarketSides(market).map((side) => ({
          textContent: side,
          value: side,
          handleClick: handleSelectSide,
        }))}
        active={isPut ? 'PUT' : 'CALL'}
      />
      <Pill
        buttons={getMarketDurations(market, isPut).map((duration) => ({
          textContent: format(getExpiry(duration), 'dd MMM yyyy'),
          value: duration,
          handleClick: handleSelectDuration,
        }))}
        active={duration || 'WEEKLY'}
      />
    </div>
  );
};

export default FilterPanel;
