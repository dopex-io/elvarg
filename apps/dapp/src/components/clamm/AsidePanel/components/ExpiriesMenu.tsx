import React from 'react';

import Tooltip from '@mui/material/Tooltip';

type ExpiriesMenuProps = {
  selectedExpiry: number;
  handleSelectExpiry: (i: number) => void;
  expiries: { expiry: string; disabled: boolean }[];
};
const ExpiriesMenu = ({
  handleSelectExpiry,
  selectedExpiry,
  expiries,
}: ExpiriesMenuProps) => {
  return (
    <div className="flex border border-[#1E1E1E] bg-[#1E1E1E] rounded-md p-2 gap-3">
      <div className="w-full">
        <span className="text-stieglitz text-sm">Expiry</span>
        <div className="flex">
          {expiries.map(({ expiry, disabled }, i: number) => (
            <Tooltip
              key={i}
              title={
                disabled
                  ? 'This expiry is not available for this strike since its premium is zero.'
                  : ''
              }
            >
              <span
                role="button"
                className={`p-0.5 py-1 text-sm flex items-center justify-center border-0 hover:border-0 w-full m-1 transition ease-in-out duration-500 rounded-sm ${
                  selectedExpiry === i
                    ? 'bg-mineshaft hover:bg-mineshaf'
                    : 'bg-umbra hover:bg-umbra'
                } ${disabled && 'cursor-not-allowed text-mineshaft bg-umbra'}`}
                onClick={() => {
                  if (disabled) return;
                  handleSelectExpiry(i);
                }}
              >
                {expiry}
              </span>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpiriesMenu;
