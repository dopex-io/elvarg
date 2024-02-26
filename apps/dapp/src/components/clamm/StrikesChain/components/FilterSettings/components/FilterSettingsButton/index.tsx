import React, { Dispatch, useCallback, useState } from 'react';

import { Button } from '@dopex-io/ui';
import {
  AdjustmentsHorizontalIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import {
  Close,
  Content,
  Description,
  Overlay,
  Portal,
  Root,
  Title,
  Trigger,
} from '@radix-ui/react-dialog';
import spindl from '@spindl-xyz/attribution';
import toast from 'react-hot-toast';
import { useAccount } from 'wagmi';

import useLoadingStates from 'hooks/clamm/useLoadingStates';

import { cn } from 'utils/general';

import {
  DEFAULT_STRIKES_CHAIN_FILTER_SETTINGS,
  FilterSettingsType,
} from 'constants/clamm';

import RangeSelector from '../RangeSelector';
import LiquidityThresholdInput from '../RangeSelector/components/Slider/LiquidityThresholdInput';

type Props = {
  filterSettings: FilterSettingsType;
  setFilterSettings: Dispatch<React.SetStateAction<FilterSettingsType>>;
};
const FilterSettingsButton = ({ filterSettings, setFilterSettings }: Props) => {
  const { isLoading } = useLoadingStates();
  const { address } = useAccount();
  const [_filterSettings, _setFilterSettings] =
    useState<FilterSettingsType>(filterSettings);

  const onFilterSettingsClick = useCallback(() => {
    spindl.track('clamm_filter_settings_button', {}, { address });
  }, [address]);

  const handleApply = useCallback(() => {
    setFilterSettings(_filterSettings);
    toast.success('Changes applied!');
  }, [_filterSettings, setFilterSettings]);

  const handleReset = useCallback(() => {
    _setFilterSettings(DEFAULT_STRIKES_CHAIN_FILTER_SETTINGS);
    setFilterSettings(DEFAULT_STRIKES_CHAIN_FILTER_SETTINGS);
  }, [setFilterSettings]);

  return (
    <Root>
      <Trigger disabled={isLoading('strikes-chain')}>
        <AdjustmentsHorizontalIcon
          onClick={onFilterSettingsClick}
          role="button"
          height={18}
          width={18}
          className={cn(
            'text-white',
            isLoading('strikes-chain') && 'text-stieglitz cursor-wait',
          )}
        />
      </Trigger>
      <Portal>
        <Overlay className="fixed inset-0 backdrop-blur-sm" />
        <Content className="fixed top-[50%] left-[50%] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] bg-umbra p-[12px] rounded-xl flex flex-col h-fit space-y-[12px]">
          <div className="flex flex-col font-medium">
            <Title className="text-lg">Strikeschain filter settings</Title>
            <Description className="text-stieglitz text-[10px]">
              Customize strikes displayed on the strikes chain based on your
              preference.
            </Description>
          </div>
          <LiquidityThresholdInput
            threshold={_filterSettings.liquidityThreshold}
            setThreshold={(v) =>
              _setFilterSettings((prev) => ({
                ...prev,
                liquidityThreshold: v,
              }))
            }
          />
          <div className="flex flex-col space-y-[12px] h-fit">
            <div className="h-[150px] w-full flex flex-col">
              <p className="text-[12px] font-medium">Strikes Range</p>
              <p className="text-[10px] font-medium text-stieglitz">
                Adjust the sliders below to show strikes according to your
                preferred range
              </p>
              <RangeSelector
                selectedStrikes={_filterSettings.range}
                setSelectedStrikes={(range) =>
                  _setFilterSettings((prev) => ({
                    ...prev,
                    range,
                  }))
                }
                liquidityThreshold={_filterSettings.liquidityThreshold}
              />
            </div>
          </div>
          <Close>
            <XMarkIcon
              className="absolute top-[12px] right-[12px] inline-flex h-[18px] w-[18px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              height={18}
              width={18}
            />
          </Close>
          <div className="flex items-center justify-between border-t border-carbon">
            <div className="flex items-center space-x-[6px]">
              <Button
                size="xsmall"
                variant="text"
                className="text-xs bg-carbon"
                onClick={handleReset}
              >
                Reset
              </Button>
            </div>
            <div className="flex items-center space-x-[6px]">
              <Close>
                <Button
                  size="xsmall"
                  variant="text"
                  className="text-xs bg-carbon"
                >
                  Cancel
                </Button>
              </Close>

              <Close>
                <Button onClick={handleApply} size="xsmall" className="text-xs">
                  Apply
                </Button>
              </Close>
            </div>
          </div>
        </Content>
      </Portal>
    </Root>
  );
};

export default FilterSettingsButton;
