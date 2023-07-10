import { useCallback, useEffect, useState } from 'react';

import { SsovV3__factory } from '@dopex-io/sdk';
import { SsovDuration } from 'types/ssov';

import useVaultStore from 'hooks/ssov/useVaultStore';

import Pill from 'components/ssov-new/Tables/Pill';

import findDefaultSsov from 'utils/ssov/findDefaultSsov';
import findSsov from 'utils/ssov/findSsov';
import getMarketDurations from 'utils/ssov/getMarketDurations';
import getMarketSides from 'utils/ssov/getMarketSides';

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
      const _isPut = e.currentTarget.textContent?.toUpperCase() === 'PUT';
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
          abi: SsovV3__factory.abi,
          base: vault.underlyingSymbol,
          isPut: _isPut,
          currentEpoch: 0,
          underlyingPrice: 0,
        });
      }
    },
    [update, duration, market]
  );

  const handleSelectDuration = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const _duration =
        e.currentTarget.textContent?.toUpperCase() as SsovDuration;

      setDuration(_duration);

      let vault = findSsov(market, isPut, _duration);

      if (vault) {
        update({
          address: vault.address,
          duration: _duration,
          abi: SsovV3__factory.abi,
          base: vault.underlyingSymbol,
          isPut,
          currentEpoch: 0,
          underlyingPrice: 0,
        });
      }
    },
    [isPut, market, update]
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
          handleClick: handleSelectSide,
        }))}
        active={isPut ? 'PUT' : 'CALL'}
      />
      <Pill
        buttons={getMarketDurations(market, isPut).map((duration) => ({
          textContent: duration,
          handleClick: handleSelectDuration,
        }))}
        active={duration || 'WEEKLY'}
      />
    </div>
  );
};

export default FilterPanel;
