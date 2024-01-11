import { zeroAddress } from 'viem';

import { Button } from '@dopex-io/ui';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import * as Tooltip from '@radix-ui/react-tooltip';
import toast from 'react-hot-toast';
import { useAccount } from 'wagmi';

import useClammPlugins from 'hooks/clamm/useClammPlugins';
import useClammStore from 'hooks/clamm/useClammStore';

import { cn } from 'utils/general';

const AutoExercisers = () => {
  const { selectedOptionsPool } = useClammStore();
  const { address } = useAccount();

  const { plugins, refetch } = useClammPlugins({
    optionMarket: selectedOptionsPool?.optionsPoolAddress ?? zeroAddress,
    account: address ?? zeroAddress,
  });

  return (
    <div className="w-full h-fit bg-umbra p-[12px] space-y-[10px]">
      <div className="text-stieglitz font-medium text-[13px] w-full flex items-center justify-between">
        <span>Plugins</span>
      </div>
      <div className="text-stieglitz font-medium text-[13px] ">
        <div className="w-full flex flex-col space-y-[6px]">
          {plugins.map(
            ({ name, enable, enabled, disable, description }, id) => (
              <div
                key={`CLAMM_PLUGIN_${id}`}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-[4px]">
                  <p>{name}</p>
                  <Tooltip.Provider>
                    <Tooltip.Root>
                      <Tooltip.Trigger>
                        <InformationCircleIcon
                          className="text-stiegitz"
                          height={14}
                          width={14}
                        />
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content className="text-xs bg-carbon p-[4px] rounded-md mb-[6px]">
                          {description}
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                  </Tooltip.Provider>
                </div>
                <Button
                  size="xsmall"
                  variant={enabled ? 'text' : 'contained'}
                  className={cn('text-xs w-[80px]', enabled && 'bg-mineshaft')}
                  onClick={() => {
                    const loadingId = toast.loading('Opening wallet');
                    (enabled ? disable() : enable())
                      .finally(() => refetch())
                      .finally(() => toast.remove(loadingId));
                  }}
                >
                  {enabled ? 'Disable' : 'Enable'}
                </Button>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
};

export default AutoExercisers;
