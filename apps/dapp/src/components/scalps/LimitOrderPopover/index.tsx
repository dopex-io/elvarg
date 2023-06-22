import React, { useCallback, useMemo, useState } from 'react';
import { BigNumber, utils } from 'ethers';

import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import Tooltip from '@mui/material/Tooltip';

import { Button, Input } from '@dopex-io/ui';
import useSendTx from 'hooks/useSendTx';
import { useBoundStore } from 'store';
import CrossIcon from 'svgs/icons/CrossIcon';

interface LimitOrderPopoverProps {
  id: BigNumber;
}

const LimitOrderPopover = (props: LimitOrderPopoverProps) => {
  const { id } = props;
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

  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const handleCloseLimitOrderPopover = useCallback(() => setAnchorEl(null), []);
  const handleOpenLimitOrderPopover = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (event.currentTarget != null) {
        setAnchorEl(event.currentTarget);
      }
    },
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
      Number(rawLimitPrice) *
      10 **
        (optionScalpData?.quoteDecimals!.toNumber() -
          optionScalpData?.baseDecimals!.toNumber());

    const spacing = 10;
    const tick0 = Math.round(Math.log(limitPrice) / Math.log(1.0001) / 10) * 10;
    const tick1 = tick0 + spacing;

    await sendTx(
      optionScalpData.limitOrdersContract.connect(signer),
      'createCloseOrder',
      [id, tick0, tick1]
    ).then(() => updateOptionScalp().then(() => updateOptionScalpUserData()));
  }, [
    signer,
    rawLimitPrice,
    optionScalpData,
    id,
    sendTx,
    updateOptionScalp,
    updateOptionScalpUserData,
  ]);

  return (
    <div>
      <Tooltip
        title="Click to create a limit close order"
        aria-label="add"
        placement="top"
      >
        <Button
          className="cursor-pointer text-white w-[2.7rem]"
          color={'primary'}
          variant={'contained'}
          onClick={handleOpenLimitOrderPopover}
        >
          <span className="text-xs md:sm">Limit</span>
        </Button>
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
            <p className="text-xs text-stieglitz mb-1">Limit price</p>
            <Input
              color="cod-gray"
              placeholder={String(
                Number(
                  utils.formatUnits(
                    markPrice,
                    optionScalpData?.quoteDecimals.toNumber()
                  )
                )
              )}
              handleChange={(e: {
                target: { value: React.SetStateAction<string | number> };
              }) => setRawLimitPrice(String(e.target.value))}
              type="number"
              className={`bg-umbra w-[8rem] text-white`}
              variant="small"
            />
          </div>
          <Button
            className="cursor-pointer text-white w-full mt-3"
            variant="contained"
            color={'primary'}
            onClick={handleCreate}
          >
            <span className="text-xs md:sm">Create limit order</span>
          </Button>
        </div>
      </Popover>
    </div>
  );
};

export default LimitOrderPopover;
