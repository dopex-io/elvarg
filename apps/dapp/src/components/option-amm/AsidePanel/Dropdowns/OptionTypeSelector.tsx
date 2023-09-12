import React, { useCallback } from 'react';

import useVaultStore from 'hooks/option-amm/useVaultStore';

import Pill from 'components/ssov-beta/Tables/Pill';

const OptionTypeSelector = () => {
  const vault = useVaultStore((store) => store.vault);
  const update = useVaultStore((store) => store.update);

  const handleSelectSide = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      update({
        ...vault,
        isPut: e.target.textContent === 'Put',
      });
    },
    [update, vault],
  );

  return (
    <Pill
      buttons={['Call', 'Put'].map((side) => ({
        textContent: side,
        value: side,
        handleClick: handleSelectSide,
      }))}
      active={vault.isPut ? 'Put' : 'Call'}
      maxWidth
    />
  );
};

export default OptionTypeSelector;
