import { MouseEventHandler } from 'react';
import { Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { BigNumber } from 'ethers';
import { Typography, CustomButton } from 'components/UI';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';
import { DECIMALS_STRIKE, DECIMALS_TOKEN, DECIMALS_USD } from 'constants/index';
import { getDialogRow } from 'components/common/LpCommon/Table';

interface Props {
  handleClose: Function;
  selectedPoolName: string;
  strike: BigNumber;
  amount: BigNumber;
  pnl: BigNumber;
  chainId: number;
  handleSettlePosition: MouseEventHandler<HTMLButtonElement>;
}

export default function SettlePositionDialog(props: Props) {
  const {
    handleClose,
    selectedPoolName,
    strike,
    amount,
    pnl,
    chainId,
    handleSettlePosition,
  } = props;

  function settleWord(handleClose: Function) {
    return (
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h6" className="text-lg pl-3">
          Settle
        </Typography>
        <CloseIcon
          role="button"
          className="h-6 w-6"
          onClick={() => handleClose()}
        />
      </Box>
    );
  }

  function getAmountPnl(
    selectedPoolName: string,
    strike: BigNumber,
    amount: BigNumber,
    pnl: BigNumber
  ) {
    let strikeTokenName: string = selectedPoolName;
    strikeTokenName += `-${getUserReadableAmount(strike, DECIMALS_STRIKE)}`;
    strikeTokenName += '-P';

    return (
      <Box className="items-center m-2">
        <Box className="flex flex-row justify-between">
          <Box className="flex">
            <Typography variant="h6" className="text-sm pl-1 pt-2">
              {strikeTokenName}
            </Typography>
          </Box>
        </Box>
        {getDialogRow(
          'Amount',
          formatAmount(getUserReadableAmount(amount, DECIMALS_TOKEN), 2)
        )}
        {getDialogRow(
          'PnL',
          `$${formatAmount(getUserReadableAmount(pnl, DECIMALS_USD), 2)}`
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

  function settleButton(handleSettle: MouseEventHandler<HTMLButtonElement>) {
    return (
      <CustomButton
        size="medium"
        className="w-full !rounded-md"
        onClick={handleSettle}
      >
        Settle
      </CustomButton>
    );
  }

  return (
    <Box className="bg-cod-gray rounded-2xl p-4 pr-3">
      {settleWord(handleClose)}
      {getAmountPnl(selectedPoolName, strike, amount, pnl)}
      {gasCostBox(chainId)}
      {settleButton(handleSettlePosition)}
    </Box>
  );
}
