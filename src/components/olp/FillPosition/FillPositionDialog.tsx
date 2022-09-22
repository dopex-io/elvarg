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

  function lpInfo(strike: number) {
    return (
      <Box>
        <Typography variant="h6" className="text-sm">
          Selling my $
          {formatAmount(
            getUserReadableAmount(strike, DEFAULT_OPTION_TOKEN_DECIMALS),
            2
          )}{' '}
          strike option token
        </Typography>
      </Box>
    );
  }

  function getOptionTokenAmountBalance(
    userTokenBalance: number,
    liquidityBalance: BigNumber,
    rawFillAmount: string,
    setRawFillAmount: Function,
    usdToReceive: number
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
              <span className="text-stieglitz">My balance</span>
            </Typography>
          </Box>
          <Box className="ml-auto mr-0">
            <Typography
              variant="h6"
              className="text-stieglitz text-sm pl-1 pt-2 pr-3"
            >
              {formatAmount(
                getUserReadableAmount(userTokenBalance, DEFAULT_TOKEN_DECIMALS),
                2
              )}{' '}
              tokens
            </Typography>
          </Box>
        </Box>
        <Box className="flex flex-row justify-between">
          <Box className="flex">
            <Typography variant="h6" className="text-sm pl-1 pt-2">
              <span className="text-stieglitz">Liquidity available</span>
            </Typography>
          </Box>
          <Box className="ml-auto mr-0">
            <Typography
              variant="h6"
              className="text-stieglitz text-sm pl-1 pt-2 pr-3"
            >
              {formatAmount(
                getUserReadableAmount(liquidityBalance, DEFAULT_USD_DECIMALS),
                2
              )}{' '}
              USDC
            </Typography>
          </Box>
        </Box>
        <Box className="flex flex-row justify-between">
          <Box className="flex">
            <Typography variant="h6" className="text-sm pl-1 pt-2">
              <span className="text-stieglitz">I will receive</span>
            </Typography>
          </Box>
          <Box className="ml-auto mr-0">
            <Typography
              variant="h6"
              className="text-stieglitz text-sm pl-1 pt-2 pr-3"
            >
              {formatAmount(usdToReceive, 2)} USDC
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
    userTokenBalance: number,
    handleApprove: MouseEventHandler<HTMLButtonElement>,
    handleFillPosition: MouseEventHandler<HTMLButtonElement>,
    fillButtonMessage: string,
    usdToReceive: number,
    liquidityAvailable: number
  ) {
    return (
      <CustomButton
        size="medium"
        className="w-full !rounded-md"
        color={
          !approved ||
          (fillAmount > 0 &&
            fillAmount <=
              getUserReadableAmount(userTokenBalance, DEFAULT_TOKEN_DECIMALS) &&
            usdToReceive <=
              getUserReadableAmount(liquidityAvailable, DEFAULT_USD_DECIMALS))
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
      {lpInfo(props.strike)}
      {getOptionTokenAmountBalance(
        props.userTokenBalance,
        props.liquidity,
        props.rawFillAmount,
        props.setRawFillAmount,
        props.usdToReceive
      )}
      {gasCostBox(props.chainId)}
      {approveDepositButton(
        props.approved,
        props.fillAmount,
        props.userTokenBalance,
        props.handleApprove,
        props.handleFillPosition,
        props.fillButtonMessage,
        props.usdToReceive,
        props.liquidity
      )}
    </Box>
  );
}
