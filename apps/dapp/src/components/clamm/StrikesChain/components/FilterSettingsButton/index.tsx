import React, { useState } from 'react';

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

import RangeSelector from '../FilterSettings/components/RangeSelector';

const FilterSettingsButton = () => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  return (
    <>
      <Root>
        <Trigger>
          <AdjustmentsHorizontalIcon
            role="button"
            height={18}
            width={18}
            className="text-white"
          />
        </Trigger>
        <Portal>
          <Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
          <Content className="data-[state=open]:animate-contentShow fixed top-[40%] left-[50%] w-[90vw] max-w-[450px] translate-x-[-50%]  translate-y-[-50%] bg-umbra p-[12px] rounded-xl flex flex-col max-h-[85vh]">
            <div className="flex flex-col pb-[12px] font-medium">
              <Title className="text-lg">Strikeschain filter settings</Title>
              <Description className="text-stieglitz text-xs">
                Customize strikes displayed on the strikes chain based on your
                preference.
              </Description>
            </div>
            <div className="py-[12px] flex flex-col space-y-[12px] h-fit">
              <div className="h-[150px] w-full flex flex-col">
                <p className="text-[12px] font-medium">Strikes Range</p>
                <p className="text-[12px] font-medium text-stieglitz">
                  Adjust the sliders below to show strikes according to your
                  preferred range
                </p>
                <RangeSelector />
              </div>
            </div>
            <Close>
              <XMarkIcon
                className="absolute top-[12px] right-[12px] inline-flex h-[18px] w-[18px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                height={18}
                width={18}
              />
            </Close>
            {/* <div className="flex items-center justify-between border-t border-carbon pt-[12px] pb-[4px]">
              <div className="flex items-center space-x-[6px]">
                <Button
                  size="xsmall"
                  variant="text"
                  className="text-xs bg-carbon"
                >
                  Save locally
                </Button>
                <Button
                  size="xsmall"
                  variant="text"
                  className="text-xs bg-carbon"
                >
                  Reset
                </Button>
              </div>
              <div className="flex items-center space-x-[6px]">
                <Button
                  size="xsmall"
                  variant="text"
                  className="text-xs bg-carbon"
                >
                  Cancel
                </Button>
                <Button size="xsmall" className="text-xs">
                  Apply
                </Button>
              </div>
            </div> */}
          </Content>
        </Portal>
      </Root>
    </>
  );
};

export default FilterSettingsButton;
