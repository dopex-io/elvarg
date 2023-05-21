import { useCallback, useEffect, useRef, useState } from 'react';

import { Menu } from '@dopex-io/ui';
import { useBoundStore } from 'store';

import { DurationType } from 'store/Vault/vault';

import { MenuDataType } from '.';

interface Props {
  isPut: boolean;
  expiries: MenuDataType;
}

const FilterPanel = (props: Props) => {
  const { updateFromBatch, updateVaultsBatch, vaultsBatch, filter } =
    useBoundStore();
  const { expiries } = props;

  const side = useRef(false);
  const durationType = useRef('WEEKLY');

  const handleSelectSide = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      side.current = e.currentTarget.textContent === 'PUTS';
      updateFromBatch({
        isPut: side.current,
        durationType: durationType.current as DurationType,
      });
    },
    [durationType, updateFromBatch]
  );

  const handleSelectDuration = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      durationType.current = e.currentTarget.textContent || 'WEEKLY';
      updateFromBatch({
        isPut: side.current,
        durationType: durationType.current as DurationType,
      });
    },
    [updateFromBatch]
  );

  useEffect(() => {
    updateFromBatch({
      isPut: side.current,
      durationType: durationType.current as DurationType,
    });
  }, [durationType, side, updateFromBatch]);

  useEffect(() => {
    side.current = filter.isPut;
    durationType.current = filter.durationType;
    if (vaultsBatch.length === 0 || !filter.base) return;
    updateVaultsBatch(filter.base);
  }, [
    filter.base,
    filter.durationType,
    filter.isPut,
    updateVaultsBatch,
    vaultsBatch.length,
  ]);

  return (
    <div className="flex space-x-2 absolute z-10">
      <Menu
        color="mineshaft"
        selection={side.current ? 'PUTS' : 'CALLS'}
        handleSelection={handleSelectSide}
        data={[{ textContent: 'CALLS' }, { textContent: 'PUTS' }]}
      />
      <Menu
        color="mineshaft"
        selection={durationType.current}
        handleSelection={handleSelectDuration}
        data={expiries}
      />
    </div>
  );
};

export default FilterPanel;
