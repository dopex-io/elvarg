import React, { useCallback, useMemo, useState } from 'react';
import { zeroAddress } from 'viem';

import { Button } from '@dopex-io/ui';
import {
  PencilSquareIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/24/solid';
import * as Popover from '@radix-ui/react-popover';
import toast from 'react-hot-toast';
import { useDebounce } from 'use-debounce';
import { useAccount } from 'wagmi';

import useClammPlugins from 'hooks/clamm/useClammPlugins';
import useClammStore from 'hooks/clamm/useClammStore';

import NumberInput from 'components/common/NumberInput/NumberInput';

import { cn, formatAmount } from 'utils/general';

import { EXERCISE_PLUGINS } from 'constants/clamm';

type Props = {
  strike: number;
  isCall: boolean;
  currentLimit: number;
  createLimit: (limit: number) => Promise<void>;
};
const LimitExercisePopover = ({
  createLimit,
  currentLimit,
  isCall,
  strike,
}: Props) => {
  const { address } = useAccount();
  const { selectedOptionsPool } = useClammStore();
  const [limit, setLimit] = useState<string | undefined>();
  const [debouncedLimit] = useDebounce(limit, 1000);
  const { plugins, refetch } = useClammPlugins({
    optionMarket: selectedOptionsPool?.optionsPoolAddress ?? zeroAddress,
    account: address ?? zeroAddress,
  });

  const limitOrderPlugin = useMemo(() => {
    if (plugins.length === 0) return;
    return plugins.find(
      ({ name }) => EXERCISE_PLUGINS['LIMIT-EXERCISE'].name === name,
    );
  }, [plugins]);

  const errorMessage = useMemo(() => {
    if (!debouncedLimit) return;
    const limitNumber = Number(debouncedLimit);

    if (isCall && limitNumber < strike) {
      return `Limit price less than strike`;
    }
    if (!isCall && limitNumber > strike) {
      return `Limit price more than strike`;
    }
  }, [isCall, debouncedLimit, strike]);

  const onConfirm = useCallback(() => {
    createLimit(Number(debouncedLimit));
  }, [createLimit, debouncedLimit]);
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <div className="flex items-center justify-center space-x-[4px]">
          <p>
            <span className="text-stieglitz">$</span>
            <span
              className={cn(
                currentLimit === 0 ? 'text-stieglitz' : 'text-white',
              )}
            >
              {formatAmount(currentLimit, 4)}
            </span>
          </p>
          <PencilSquareIcon
            className="text-stieglitz hover:cursor-pointer"
            width={14}
            height={14}
          />
        </div>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="rounded p-[12px] w-[260px] bg-umbra"
          sideOffset={5}
        >
          <div className="flex flex-col gap-2.5">
            <p className="flex items-center space-x-[4px]">
              <span className="text-stieglitz text-xs">
                Configure limit price
              </span>
              <QuestionMarkCircleIcon
                height={13}
                width={13}
                className="text-stieglitz hover:cursor-pointer"
              />
            </p>
            <div className="flex flex-col items-center justify-center w-full space-y-[12px]">
              <fieldset className="flex items-center justify-center w-full border-carbon border rounded-md">
                <label className="text-stieglitz text-xs flex-1 px-[4px]">
                  Limit price
                </label>
                <NumberInput
                  value={limit ?? ''}
                  onValueChange={(e) => setLimit(e.target.value)}
                  className="bg-umbra rounded-md text-xs p-[4px] text-right text-white default-stieglitz placeholder-stieglitz w-full focus:outline-none flex-[2]"
                  placeholder="0"
                />
              </fieldset>
              {Boolean(errorMessage) && (
                <p className="text-down-bad text-xs bg-opacity-5 bg-down-bad border-down-bad border w-full p-[10px] rounded-md">
                  {errorMessage}
                </p>
              )}
              <div className="flex items-center space-x-[4px] w-full">
                <Popover.Close className="flex-1">
                  <Button
                    size="xsmall"
                    className="flex-1 text-xs bg-mineshaft w-full"
                    variant="text"
                  >
                    Cancel
                  </Button>
                </Popover.Close>

                <Button
                  size="xsmall"
                  disabled={
                    (limitOrderPlugin &&
                      limitOrderPlugin.enabled &&
                      !Boolean(limit)) ||
                    Boolean(errorMessage)
                  }
                  className={'text-xs w-full bg-primary flex-1'}
                  onClick={() => {
                    if (limitOrderPlugin && limitOrderPlugin.enabled) {
                      onConfirm();
                    } else {
                      const loadingId = toast.loading('Opening wallet');
                      limitOrderPlugin?.enable().finally(() => {
                        refetch().finally(() => toast.remove(loadingId));
                      });
                    }
                  }}
                >
                  {limitOrderPlugin && limitOrderPlugin.enabled
                    ? 'confirm'
                    : 'Enable'}
                </Button>
              </div>
            </div>
          </div>
          <Popover.Close className="inline-flex items-center justify-center absolute top-[12px] right-[12px]">
            <XMarkIcon
              height={14}
              width={14}
              className="text-stieglitz hover:text-white hover:cursor-pointer"
            />
          </Popover.Close>
          <Popover.Arrow className="fill-umbra" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default LimitExercisePopover;
