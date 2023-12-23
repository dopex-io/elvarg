import React, { Dispatch, useState } from 'react';

import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/solid';

import FilterSettings from '../Positions/components/Dialogs/FilterSettings';

export type FilterSettingsType = {
  showAvailableOptionsOnly: boolean;
  sideFilter: string[];
};
type Props = {
  settings: FilterSettingsType;
  setSettings: Dispatch<React.SetStateAction<FilterSettingsType>>;
};

const FilterSettingsButton = ({ setSettings, settings }: Props) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const closeDialog = () => {
    setDialogOpen(false);
  };
  const openDialog = () => {
    setDialogOpen(true);
  };

  return (
    <>
      <AdjustmentsHorizontalIcon
        role="button"
        height={16}
        width={16}
        className="text-white"
        onClick={openDialog}
      />
      <FilterSettings
        handleClose={closeDialog}
        isOpen={dialogOpen}
        setSettings={setSettings}
        settings={settings}
      />
    </>
  );
};

export default FilterSettingsButton;
