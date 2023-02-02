import {
  Box,
  IconButton,
  Popover,
  Slider,
  Tooltip,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';

import { useBoundStore } from 'store';
import { formatAmount, getTokenDecimals } from 'utils/general';

import CrossIcon from 'svgs/icons/CrossIcon';

import get1inchQuote from 'utils/general/get1inchQuote';
import {
  getContractReadableAmount,
  getUserReadableAmount,
} from 'utils/contracts';

import SettingsIcon from 'svgs/icons/SettingsIcon';

interface IProps {
  fromTokenSymbol: string;
  toTokenSymbol: string;
  amount: string;
  setAmount: Function;
}

const OneinchSwapDetails = (props: IProps) => {
  const { fromTokenSymbol, toTokenSymbol, amount, setAmount } = props;

  const { accountAddress, chainId, contractAddresses } = useBoundStore();

  const [slippageTolerance, setSlippageTolerance] = useState(0.3);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [amountOut, setAmountOut] = useState('0');

  const handleSlippageSlider = useCallback(
    (__: Event | any, value: any, _: number) => {
      setSlippageTolerance(value);
    },
    []
  );

  const handleCloseSettings = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleOpenSettings = useCallback(
    (event: any) => setAnchorEl(event.currentTarget),
    []
  );

  const updateQuote = useCallback(async () => {
    if (!contractAddresses) return;

    const fromTokenAddress = contractAddresses[fromTokenSymbol];
    const toTokenAddress = contractAddresses[toTokenSymbol];

    if (
      !chainId ||
      !accountAddress ||
      !amount ||
      fromTokenAddress === toTokenAddress
    )
      return;

    const { toTokenAmount } = await get1inchQuote(
      fromTokenAddress,
      toTokenAddress,
      getContractReadableAmount(
        Number(amount),
        getTokenDecimals(fromTokenSymbol, chainId)
      ).toString(),
      chainId,
      accountAddress,
      (slippageTolerance * 10).toFixed(0)
    );

    setAmountOut(
      formatAmount(
        getUserReadableAmount(
          toTokenAmount,
          getTokenDecimals(toTokenSymbol, chainId)
        ),
        3
      )
    );

    // External setters
    setAmount({
      userReadable: formatAmount(
        getUserReadableAmount(
          toTokenAmount,
          getTokenDecimals(toTokenSymbol, chainId)
        ),
        3
      ),
      contractReadable: BigNumber.from(toTokenAmount),
    });
  }, [
    accountAddress,
    amount,
    chainId,
    contractAddresses,
    fromTokenSymbol,
    toTokenSymbol,
    setAmount,
    slippageTolerance,
  ]);

  useEffect(() => {
    updateQuote();
  }, [updateQuote]);

  return (
    <Box className="flex w-full h-full mb-3">
      <Box className="mt-3.5 w-full">
        <Box className="rounded-xl flex flex-col mb-0 p-3 border border-neutral-800 w-full">
          <Popover
            anchorEl={anchorEl}
            open={!!anchorEl}
            classes={{ paper: 'bg-umbra rounded-md' }}
            onClose={handleCloseSettings}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <Box className="w-52 p-3">
              <Box className="flex">
                <Typography
                  variant="h6"
                  className="text-white text-xs pt-1 pb-1"
                >
                  Max. slippage: {slippageTolerance}%
                </Typography>
                <IconButton
                  className="p-0 pb-1 mr-0 ml-auto"
                  onClick={handleCloseSettings}
                  role="button"
                  size="small"
                >
                  <CrossIcon
                    className="group"
                    subClassName="fill-gray-200 group-hover:fill-gray-100"
                  />
                </IconButton>
              </Box>
              <Slider
                value={slippageTolerance}
                min={0.1}
                max={1}
                step={0.1}
                aria-label="Small"
                valueLabelDisplay="auto"
                onChange={handleSlippageSlider}
              />
            </Box>
          </Popover>
          <Tooltip title="Go to advanced mode" aria-label="add" placement="top">
            <IconButton
              className="p-0 pb-1 mr-0 ml-auto"
              onClick={handleOpenSettings}
              size="large"
            >
              <SettingsIcon
                className="group"
                subClassName="fill-gray-200 group-hover:fill-gray-400"
              />
            </IconButton>
          </Tooltip>
          <Box className={'flex mb-1 mt-1'}>
            <Typography variant="body2" className="text-stieglitz ml-0 mr-auto">
              Receive & Deposit:
            </Typography>
            <Box className={'text-right'}>
              <Typography variant="body2" className="text-white mr-auto ml-0">
                {amountOut} {toTokenSymbol}
              </Typography>
            </Box>
          </Box>
          <Box className={'flex mb-1'}>
            <Typography variant="body2" className="text-stieglitz ml-0 mr-auto">
              Slippage
            </Typography>
            <Box className={'text-right'}>
              <Typography variant="body2" className="text-white mr-auto ml-0">
                {slippageTolerance}%
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default OneinchSwapDetails;
