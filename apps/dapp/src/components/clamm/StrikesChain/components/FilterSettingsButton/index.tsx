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
import toast from 'react-hot-toast';

import useLoadingStates from 'hooks/clamm/useLoadingStates';

import BundleSizeSelector from 'components/clamm/PositionsTable/components/Positions/components/Dialogs/FilterSettings/components/BundleSizeSelector';

import { cn } from 'utils/general';

import {
  DEFAULT_STRIKES_CHAIN_FILTER_SETTINGS,
  FilterSettingsType,
} from 'constants/clamm';

import RangeSelector from '../FilterSettings/components/RangeSelector';
import LiquidityThresholdInput from '../FilterSettings/components/RangeSelector/components/Slider/LiquidityThresholdInput';

type Props = {
  filterSettings: FilterSettingsType;
  setFilterSettings: Dispatch<React.SetStateAction<FilterSettingsType>>;
};
const FilterSettingsButton = ({ filterSettings, setFilterSettings }: Props) => {
  const { isLoading } = useLoadingStates();
  const [_filterSettings, _setFilterSettings] =
    useState<FilterSettingsType>(filterSettings);

  const handleApply = useCallback(() => {
    setFilterSettings(_filterSettings);
    toast.success('Changes applied!');
  }, [_filterSettings, setFilterSettings]);

  const handleReset = useCallback(() => {
    _setFilterSettings(DEFAULT_STRIKES_CHAIN_FILTER_SETTINGS);
    setFilterSettings(DEFAULT_STRIKES_CHAIN_FILTER_SETTINGS);
  }, [setFilterSettings]);

  return (
    <>
      <Root>
        <Trigger disabled={isLoading('strikes-chain')}>
          <AdjustmentsHorizontalIcon
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
          <Overlay className="fixed inset-0" />
          <Content className="fixed top-[50%] left-[50%] w-[90vw] max-w-[450px] translate-x-[-50%]  translate-y-[-50%] bg-umbra p-[12px] rounded-xl flex flex-col  h-fit">
            <div className="flex flex-col pb-[12px] font-medium">
              <Title className="text-lg">Strikeschain filter settings</Title>
              <Description className="text-stieglitz text-xs">
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
            <div className="py-[12px] flex flex-col space-y-[12px] h-fit">
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
            <div className="flex flex-col space-y-[12px] pb-[12px]">
              <div className="h-fit w-full flex flex-col">
                <p className="text-[12px] font-medium">Bundling</p>
                <p className="text-[10px] font-medium text-stieglitz">
                  Bundle strikes into a single row for a brief visibility
                </p>
              </div>
              <BundleSizeSelector
                value={_filterSettings.bundleSize}
                onValueChange={(v) =>
                  _setFilterSettings((prev) => ({
                    ...prev,
                    bundleSize: v,
                  }))
                }
              />
            </div>
            <Close>
              <XMarkIcon
                className="absolute top-[12px] right-[12px] inline-flex h-[18px] w-[18px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                height={18}
                width={18}
              />
            </Close>
            <div className="flex items-center justify-between border-t border-carbon pt-[12px] pb-[4px]">
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
                  <Button
                    onClick={handleApply}
                    size="xsmall"
                    className="text-xs"
                  >
                    Apply
                  </Button>
                </Close>
              </div>
            </div>
          </Content>
        </Portal>
      </Root>
    </>
  );
};

export default FilterSettingsButton;
