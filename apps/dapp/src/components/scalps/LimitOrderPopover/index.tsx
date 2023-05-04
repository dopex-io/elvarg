import React, { useCallback, useMemo, useState } from 'react';

import { BigNumber } from 'ethers';

import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import Popover from '@mui/material/Popover';
import Tooltip from '@mui/material/Tooltip';
import useSendTx from 'hooks/useSendTx';
import { useBoundStore } from 'store';
import CrossIcon from 'svgs/icons/CrossIcon';

import CustomButton from 'components/UI/Button';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

const LimitOrderPopover = ({ id }, { id: BigNumber }) => {
  const {
    signer,
    selectedPoolName,
    optionScalpData,
    uniWethPrice,
    uniArbPrice,
    updateOptionScalp,
    updateOptionScalpUserData,
  } = useBoundStore();
  const sendTx = useSendTx();

  const [rawLimitPrice, setRawLimitPrice] = useState<string>('10');

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

  const handleCreate = useCallback(async () => {
    if (
      !optionScalpData?.optionScalpContract ||
      !optionScalpData?.limitOrdersContract ||
      !signer ||
      !updateOptionScalp ||
      !updateOptionScalpUserData
    )
      return;

    const limitPrice =
      Number(rawLimitPrice) * 10 ** optionScalpData?.quoteDecimals!.toNumber();

    const spacing = 10;
    const tick0 =
      Math.round(Math.round(Math.log(1 / limitPrice) / Math.log(1.0001)) / 10) *
      10;
    const tick1 = tick0 + spacing;

    await sendTx(
      optionScalpData.limitOrdersContract.connect(signer),
      'createCloseOrder',
      [optionScalpData.optionScalpContract.address, id, tick0, tick1]
    ).then(() => updateOptionScalp().then(() => updateOptionScalpUserData()));
  }, [signer, rawLimitPrice, optionScalpData, id]);

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
              onChange={(e) => setRawLimitPrice(e.target.value)}
              type="number"
              className={`mt-2 border border-mineshaft rounded-md px-2 bg-umbra w-full !w-auto`}
              classes={{ input: 'text-white text-xs text-left py-2' }}
            />
          </div>
          <CustomButton
            className="cursor-pointer text-white w-full mt-3"
            color={'primary'}
            onClick={handleCreate}
          >
            <span className="text-xs md:sm">Create limit order</span>
          </CustomButton>
        </div>
      </Popover>
    </div>
  );
};

export default LimitOrderPopover;
