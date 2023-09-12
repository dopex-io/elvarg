import { useCallback } from 'react';

import { Menu } from '@dopex-io/ui';

import useVaultStore from 'hooks/option-amm/useVaultStore';

import { AmmDuration, ammDurations } from 'constants/optionAmm/markets';

const ExpirySelector = () => {
  const vault = useVaultStore((store) => store.vault);
  const update = useVaultStore((store) => store.update);

  const handleSelectExpiry = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      update({
        ...vault,
        duration: e.target.textContent as AmmDuration,
      });
    },
    [update, vault],
  );

  return (
    <Menu
      color="mineshaft"
      dropdownVariant="icon"
      handleSelection={handleSelectExpiry}
      selection={vault.duration}
      data={ammDurations.map((duration) => ({
        textContent: duration,
      }))}
      className="z-10 flex-grow py-0 h-[32px]"
      showArrow
    />
  );
};

export default ExpirySelector;
