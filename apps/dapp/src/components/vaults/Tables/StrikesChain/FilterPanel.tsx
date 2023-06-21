import { useCallback, useEffect, useMemo, useState } from 'react';

import { SsovV3__factory } from '@dopex-io/sdk';
import useVaultQuery from 'hooks/vaults/query';
import useVaultState, {
  durations,
  DurationType,
  Side,
  sides,
} from 'hooks/vaults/state';

import Pill from 'components/vaults/Tables/Pill';

interface Props {
  selectedToken: string;
  durationType: DurationType | undefined;
  isPut: boolean | undefined;
}

const FilterPanel = (props: Props) => {
  const { selectedToken, durationType, isPut } = props;

  const vault = useVaultState((state) => state.vault);
  const update = useVaultState((state) => state.update);
  const { updateSelectedVault, vaults, selectedVault } = useVaultQuery({
    vaultSymbol: selectedToken,
  });

  const [side, setSide] = useState<Side>();
  const [_durationType, setDurationType] = useState<DurationType>();

  const handleSelectSide = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSide(e.currentTarget.textContent?.toUpperCase() as Side);
      update({
        ...vault,
        isPut: (e.currentTarget.textContent?.toUpperCase() as Side) === 'PUT',
      });
    },
    [update, vault]
  );

  const handleSelectDuration = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDurationType(e.target.textContent?.toUpperCase() as DurationType);
    update({
      ...vault,
      durationType: e.target.textContent?.toUpperCase() as DurationType,
    });
  };

  const validSidesFromSelectedDuration = useMemo(() => {
    const filtered = vaults
      .filter((vault) => vault.durationType === _durationType)
      .map((vault) =>
        sides.filter((side) => side === (vault.isPut ? 'PUT' : 'CALL'))
      )
      .flat();

    return [...new Set(filtered)];
  }, [_durationType, vaults]);

  const validDurationFromSelectedSide = useMemo(() => {
    const filtered = vaults
      .filter((vault) => side === (vault.isPut ? 'PUT' : 'CALL'))
      .map((vault) =>
        durations.filter((duration) => duration === vault.durationType)
      )
      .flat();
    return [...new Set(filtered)];
  }, [side, vaults]);

  // updates default selection of duration/side if the base asset has been changed
  useEffect(() => {
    if (!vaults[0] || selectedVault?.symbol === vault.base) return;
    setDurationType(vaults[0].durationType as DurationType);
    setSide(vaults[0].isPut ? 'PUT' : 'CALL');
  }, [selectedVault, vault.base, vaults]);

  // updates selected vault for the same base asset
  useEffect(() => {
    updateSelectedVault(_durationType as DurationType, side === 'PUT');
  }, [_durationType, side, update, updateSelectedVault, vault]);

  useEffect(() => {
    if (!selectedVault) return;
    update({
      address: selectedVault.contractAddress,
      isPut: selectedVault.isPut,
      durationType: selectedVault.durationType,
      abi: SsovV3__factory.abi,
      base: selectedVault.underlyingSymbol,
      currentEpoch: selectedVault.currentEpoch,
    });
  }, [selectedVault, update]);

  return (
    <div className="flex space-x-2 z-10">
      <Pill
        buttons={validSidesFromSelectedDuration.map((side) => ({
          textContent: side,
          handleClick: handleSelectSide,
        }))}
        active={side || 'PUT'}
      />
      <Pill
        buttons={validDurationFromSelectedSide.map((duration) => ({
          textContent: duration,
          handleClick: handleSelectDuration,
        }))}
        active={_durationType || 'WEEKLY'}
      />
    </div>
  );
};

export default FilterPanel;
