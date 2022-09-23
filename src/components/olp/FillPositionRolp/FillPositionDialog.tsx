import { MouseEventHandler } from 'react';
import { Box, Input } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { BigNumber } from 'ethers';
import { Typography, CustomButton } from 'components/UI';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';
import formatAmount from 'utils/general/formatAmount';
import {
  DEFAULT_TOKEN_DECIMALS,
  DEFAULT_OPTION_TOKEN_DECIMALS,
  DEFAULT_USD_DECIMALS,
} from 'constants/index';

export default function FillPositionDialog(props: any) {
  function fillLpWord(handleClose: Function) {
    return (
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h6" className="text-sm">
          Fill LP
        </Typography>
        <CloseIcon
          role="button"
          className="h-6 w-6"
          onClick={() => handleClose()}
        />
      </Box>
    );
  }

  function lpInfo(strike: number, strikeTokenName: string) {
    return (
      <Box>
        <Typography variant="h6" className="text-sm">
          Buying {strikeTokenName}
        </Typography>
      </Box>
    );
  }

  function getOptionTokenAmountBalance(
    userUsdBalance: number,
    liquidityBalance: BigNumber,
    rawFillAmount: string,
    setRawFillAmount: Function,
    usdToPay: number
  ) {
    return (
      <Box className="items-center m-2">
        <Input
          disableUnderline
          id="notionalSize"
          name="notionalSize"
          placeholder="0"
          type="number"
          className="h-12 text-2xl text-white ml-2 mr-3 font-mono"
          value={rawFillAmount}
          onChange={(e) => setRawFillAmount(e.target.value)}
          classes={{ input: 'text-right' }}
        />
        <Box className="flex flex-row justify-between">
          <Box className="flex">
            <Typography variant="h6" className="text-sm pl-1 pt-2">
              <span className="text-stieglitz">My USDC balance</span>
            </Typography>
          </Box>
          <Box className="ml-auto mr-0">
            <Typography
              variant="h6"
              className="text-stieglitz text-sm pl-1 pt-2 pr-3"
            >
              {formatAmount(
                getUserReadableAmount(userUsdBalance, DEFAULT_USD_DECIMALS),
                2
              )}{' '}
              USDC
            </Typography>
          </Box>
        </Box>
        <Box className="flex flex-row justify-between">
          <Box className="flex">
            <Typography variant="h6" className="text-sm pl-1 pt-2">
              <span className="text-stieglitz">Tokens available</span>
            </Typography>
          </Box>
          <Box className="ml-auto mr-0">
            <Typography
              variant="h6"
              className="text-stieglitz text-sm pl-1 pt-2 pr-3"
            >
              {formatAmount(
                getUserReadableAmount(liquidityBalance, DEFAULT_TOKEN_DECIMALS),
                2
              )}{' '}
              tokens
            </Typography>
          </Box>
        </Box>
        <Box className="flex flex-row justify-between">
          <Box className="flex">
            <Typography variant="h6" className="text-sm pl-1 pt-2">
              <span className="text-stieglitz">I will pay</span>
            </Typography>
          </Box>
          <Box className="ml-auto mr-0">
            <Typography
              variant="h6"
              className="text-stieglitz text-sm pl-1 pt-2 pr-3"
            >
              {formatAmount(usdToPay, 2)} USDC
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  // Displays gas cost estimate
  function gasCostBox(chainId: number) {
    return (
      <Box className="rounded-xl p-3 border border-neutral-800 w-full bg-umbra mt-4 mb-3">
        <EstimatedGasCostButton gas={500000} chainId={chainId} />
      </Box>
    );
  }

  // Approve and deposit button
  function approveDepositButton(
    approved: boolean,
    fillAmount: number,
    userUsdBalance: number,
    handleApprove: MouseEventHandler<HTMLButtonElement>,
    handleFillPosition: MouseEventHandler<HTMLButtonElement>,
    fillButtonMessage: string,
    usdToPay: number,
    numTokensProvided: number
  ) {
    return (
      <CustomButton
        size="medium"
        className="w-full !rounded-md"
        color={
          !approved ||
          (fillAmount > 0 &&
            fillAmount <=
              getUserReadableAmount(
                numTokensProvided,
                DEFAULT_TOKEN_DECIMALS
              ) &&
            usdToPay <=
              getUserReadableAmount(userUsdBalance, DEFAULT_USD_DECIMALS))
            ? 'primary'
            : 'mineshaft'
        }
        disabled={fillAmount <= 0}
        onClick={approved ? handleFillPosition : handleApprove}
      >
        {fillButtonMessage}
      </CustomButton>
    );
  }

  return (
    <Box className="bg-cod-gray rounded-2xl p-4 pr-3">
      {fillLpWord(props.handleClose)}
      {lpInfo(props.strike, props.strikeTokenName)}
      {getOptionTokenAmountBalance(
        props.userUsdBalance,
        props.numTokensProvided,
        props.rawFillAmount,
        props.setRawFillAmount,
        props.usdToPay
      )}
      {gasCostBox(props.chainId)}
      {approveDepositButton(
        props.approved,
        props.fillAmount,
        props.userUsdBalance,
        props.handleApprove,
        props.handleFillPosition,
        props.fillButtonMessage,
        props.usdToPay,
        props.numTokensProvided
      )}
    </Box>
  );
}
