import React, { useState } from 'react';

import { ArrowPathIcon, LinkIcon } from '@heroicons/react/24/solid';
import * as Tooltip from '@radix-ui/react-tooltip';

import { cn } from 'utils/general';

type Props = {
  refresh: () => Promise<void>;
  selectAll: () => void;
  deselectAll: () => void;
};
const UtilityButtons = ({ refresh, selectAll, deselectAll }: Props) => {
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [selectedAllmode, setSelectAllMode] = useState(false);

  return (
    <div className="flex items-center space-x-[6px]">
      <div className="w-[22px] h-[22px] p-[4px] bg-carbon flex items-center justify-center rounded-md">
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger
              disabled={refreshLoading}
              onClick={() => {
                setRefreshLoading(true);
                refresh().finally(() => {
                  setTimeout(() => setRefreshLoading(false), 5000);
                });
              }}
            >
              <ArrowPathIcon
                className={cn(
                  'text-stieglitz hover:text-white',
                  refreshLoading &&
                    'animate-spin opacity-50 cursor-progress hover:none',
                )}
                role="button"
                height={16}
                width={16}
              />
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className="text-xs bg-carbon p-[4px] rounded-md mb-[6px]">
                Re-sync LP positions data
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>
      <div className="w-[22px] h-[22px] p-[4px] bg-carbon flex items-center justify-center rounded-md">
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger
              onClick={() => {
                if (selectedAllmode) {
                  deselectAll();
                  setSelectAllMode(false);
                } else {
                  setSelectAllMode(true);
                  selectAll();
                }
              }}
            >
              <LinkIcon
                className={cn(
                  'text-stieglitz hover:text-white',
                  selectedAllmode && 'text-white',
                )}
                role="button"
                height={16}
                width={16}
              />
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className="text-xs bg-carbon p-[4px] rounded-md mb-[6px]">
                Select all withdrawable strikes
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>
    </div>
  );
};

export default UtilityButtons;
