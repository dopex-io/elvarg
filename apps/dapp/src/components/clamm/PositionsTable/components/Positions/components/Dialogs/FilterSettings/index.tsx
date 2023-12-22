import React, { useState } from 'react';

import { Button, Dialog } from '@dopex-io/ui';

import CheckBox from 'components/UI/CheckBox/CheckBox';

import BundleSizeSelector from './components/BundleSizeSelector';
import SideSelector from './components/SideSelector';

type Props = {
  handleClose: any;
  isOpen: boolean;
};

const FilterSettings = ({ handleClose, isOpen }: Props) => {
  const [settings, setSettings] = useState({
    showAvailableOptionsOnly: true,
    sideFilter: ['call', 'put'],
  });
  return (
    <Dialog
      handleClose={handleClose}
      isOpen={isOpen}
      title="Filter Settings"
      showCloseIcon
    >
      <div className="flex flex-col space-y-[12px]">
        <div className="flex items-center justify-between text-xs">
          <div className="flex flex-col">
            <p>Strikes with options available</p>
            <p className="text-stieglitz text-[9px]">
              Display strikes with options available to purchase.
            </p>
          </div>
          <div className="flex items-center">
            <CheckBox
              checked={settings.showAvailableOptionsOnly}
              onClick={() => {
                setSettings((prev) => ({
                  ...prev,
                  showAvailableOptionsOnly: !prev.showAvailableOptionsOnly,
                }));
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex flex-col">
            <p>Side</p>
            <p className="text-stieglitz text-[9px]">
              Display call or put strikes, or both.
            </p>
          </div>
          <SideSelector
            onValueChange={(value) => {
              setSettings((prev) => ({
                ...prev,
                sideFilter: value,
              }));
            }}
          />
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex flex-col">
            <p>Bundle size</p>
            <p className="text-stieglitz text-[9px]">
              Stack strikes in bundles specified.
            </p>
          </div>
          <BundleSizeSelector />
        </div>
        <div className="flex items-center justify-between border-t border-carbon py-[12px]">
          <div className="flex items-center space-x-[6px]">
            <Button size="xsmall" variant="text" className="text-xs bg-carbon">
              Save locally
            </Button>
            <Button size="xsmall" variant="text" className="text-xs bg-carbon">
              Reset
            </Button>
          </div>
          <div className="flex items-center space-x-[6px]">
            <Button size="xsmall" variant="text" className="text-xs bg-carbon">
              Cancel
            </Button>
            <Button size="xsmall" className="text-xs">
              Apply
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default FilterSettings;
