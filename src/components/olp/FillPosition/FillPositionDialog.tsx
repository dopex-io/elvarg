import { MouseEventHandler } from 'react';
import { Box, Input } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { BigNumber } from 'ethers';
import { Typography, CustomButton } from 'components/UI';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';
import formatAmount from 'utils/general/formatAmount';
import { DECIMALS_TOKEN, DECIMALS_STRIKE, DECIMALS_USD } from 'constants/index';
import { getDialogRow } from '../common/Table';

interface Props {
  handleClose: Function;
  strike: BigNumber;
  liquidity: BigNumber;
  usdToReceive: number;
  rawFillAmount: string;
  setRawFillAmount: Function;
  userTokenBalance: BigNumber;
  approved: boolean;
  chainId: number;
  fillAmount: number;
  handleApprove: MouseEventHandler<HTMLButtonElement>;
  handleFillPosition: MouseEventHandler<HTMLButtonElement>;
  fillButtonMessage: string;
}

export default function FillPositionDialog(props: Props) {
  const {
    handleClose,
    strike,
    liquidity,
    usdToReceive,
    rawFillAmount,
    setRawFillAmount,
    userTokenBalance,
    approved,
    chainId,
    fillAmount,
    handleApprove,
    handleFillPosition,
    fillButtonMessage,
  } = props;

  function fillLpWord(handleClose: Function) {
    return (
      <Box className="flex justify-between items-center mb-6 p-1">
        <Typography variant="h6" className="text-lg">
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

  function lpInfo(strike: BigNumber) {
    return (
      <Box>
        <Typography variant="h6" className="text-sm">
          Selling my $
          {formatAmount(getUserReadableAmount(strike, DECIMALS_STRIKE), 2)}{' '}
          strike option token
        </Typography>
      </Box>
    );
  }

  function getOptionTokenAmountBalance(
    userTokenBalance: BigNumber,
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
        {getDialogRow(
          'Option premium',
          `${formatAmount(
            getUserReadableAmount(userTokenBalance, DECIMALS_TOKEN),
            2
          )} tokens`
        )}
        {getDialogRow(
          'My balance',
          `${formatAmount(
            getUserReadableAmount(userTokenBalance, DECIMALS_TOKEN),
            2
          )} tokens`
        )}
        {getDialogRow(
          'Liquidity available',
          `${formatAmount(
            getUserReadableAmount(liquidityBalance, DECIMALS_USD),
            2
          )} USDC`
        )}
        {getDialogRow(
          'I will receive',
          `${formatAmount(usdToReceive, 2)} tokens`
        )}
      </Box>
    );
  }

  function gasCostBox(chainId: number) {
    return (
      <Box className="rounded-xl p-3 border border-neutral-800 w-full bg-umbra mt-4 mb-3">
        <EstimatedGasCostButton gas={500000} chainId={chainId} />
      </Box>
    );
  }

  function approveDepositButton(
    approved: boolean,
    fillAmount: number,
    fillButtonMessage: string,
    handleApprove: MouseEventHandler<HTMLButtonElement>,
    handleFillPosition: MouseEventHandler<HTMLButtonElement>
  ) {
    return (
      <CustomButton
        size="medium"
        className="w-full !rounded-md"
        color={
          !approved || fillButtonMessage === 'Fill' ? 'primary' : 'mineshaft'
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
      {fillLpWord(handleClose)}
      {lpInfo(strike)}
      {getOptionTokenAmountBalance(
        userTokenBalance,
        liquidity,
        rawFillAmount,
        setRawFillAmount,
        usdToReceive
      )}
      {gasCostBox(chainId)}
      {approveDepositButton(
        approved,
        fillAmount,
        fillButtonMessage,
        handleApprove,
        handleFillPosition
      )}
    </Box>
  );
}
