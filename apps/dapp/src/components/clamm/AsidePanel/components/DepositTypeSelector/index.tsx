import React, { Dispatch } from 'react';

import { ChartBarIcon, ListBulletIcon } from '@heroicons/react/24/solid';

import { cn } from 'utils/general';

type Props = {
  selectionModeIndex: number;
  setSelectionMode: Dispatch<React.SetStateAction<0 | 1>>;
};

const DepositTypeSelector = ({
  selectionModeIndex,
  setSelectionMode,
}: Props) => {
  return (
    <div className="text-[13px] flex items-center justify-between w-full p-[12px] bg-umbra">
      <div className="text-stieglitz">
        <span>Selection Mode</span>
      </div>
      <div className="text-stieglitz flex items-center space-x-[4px] justify-end">
        <ChartBarIcon
          role="button"
          onClick={() => {
            setSelectionMode(1);
          }}
          className={cn(
            'hover:text-white cursor-pointer',
            selectionModeIndex === 1 && 'text-white',
          )}
          height={18}
          width={18}
        />
        <ListBulletIcon
          role="button"
          onClick={() => {
            setSelectionMode(0);
          }}
          className={cn(
            'hover:text-white cursor-pointer',
            selectionModeIndex === 0 && 'text-white',
          )}
          height={18}
          width={18}
        />
      </div>
    </div>
  );
};

export default DepositTypeSelector;
