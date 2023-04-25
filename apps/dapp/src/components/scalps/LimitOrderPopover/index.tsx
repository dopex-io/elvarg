import React, { useCallback, useMemo, useState } from 'react';

import { BigNumber } from 'ethers';

import Popover from '@mui/material/Popover';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Input from '@mui/material/Input';

import CustomButton from 'components/UI/Button';

import CrossIcon from 'svgs/icons/CrossIcon';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import { useBoundStore } from 'store';

const LimitOrderPopover = () => {
  const { selectedPoolName, optionScalpData, uniWethPrice, uniArbPrice } =
    useBoundStore();

  const markPrice = useMemo(() => {
    if (selectedPoolName === 'ETH') return uniWethPrice;
    else if (selectedPoolName === 'ARB') return uniArbPrice;
    return BigNumber.from('0');
  }, [uniWethPrice, uniArbPrice, selectedPoolName]);

  const [anchorEl, setAnchorEl] = useState(null);
  const handleCloseLimitOrderPopover = useCallback(() => setAnchorEl(null), []);
  const handleOpenLimitOrderPopover = useCallback(
    // @ts-ignore TODO: FIX
    (event) => setAnchorEl(event.currentTarget),
    []
  );

  return (
    <div>
      <Tooltip
        title="Click to create a limit close order"
        aria-label="add"
        placement="top"
      >
        <CustomButton
          className="cursor-pointer text-white w-2"
          color={'primary'}
          onClick={handleOpenLimitOrderPopover}
        >
          <span className="text-xs md:sm">Limit Close</span>
        </CustomButton>
      </Tooltip>
      <Popover
        anchorEl={anchorEl}
        open={!!anchorEl}
        classes={{ paper: 'bg-umbra rounded-md' }}
        onClose={handleCloseLimitOrderPopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <div className="w-52 p-3">
          <div className="absolute right-[20px] left-auto">
            <IconButton
              className="p-0 pb-1 mr-0 ml-auto"
              onClick={handleCloseLimitOrderPopover}
              size="large"
            >
              <CrossIcon
                className="group"
                subClassName="group-hover:fill-white opacity-90"
              />
            </IconButton>
          </div>

          <div className="mt-3">
            <p className="text-xs text-stieglitz">Limit price</p>
            <Input
              disableUnderline
              placeholder={String(
                getUserReadableAmount(
                  markPrice,
                  optionScalpData?.quoteDecimals!.toNumber()
                )
              )}
              onChange={() => {}}
              type="number"
              className={`mt-2 border border-mineshaft rounded-md px-2 bg-umbra w-full !w-auto`}
              classes={{ input: 'text-white text-xs text-left py-2' }}
            />
          </div>
          <CustomButton
            className="cursor-pointer text-white w-full mt-3"
            color={'primary'}
          >
            <span className="text-xs md:sm">Create limit order</span>
          </CustomButton>
        </div>
      </Popover>
    </div>
  );
};

export default LimitOrderPopover;
