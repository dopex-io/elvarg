import React from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import Typography from 'components/UI/Typography';

import { WritePositionInterface } from 'contexts/SsovV3';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import NumberDisplay from 'components/UI/NumberDisplay';
import SplitButton from 'components/UI/SplitButton';

import { TokenData } from 'types';

interface Props extends WritePositionInterface {
  collateralSymbol: string;
  rewardTokens: TokenData[];
  openTransfer: () => void;
  openWithdraw: () => void;
  epochExpired: boolean;
}

const WritePositionTableData = (props: Props) => {
  const {
    strike,
    collateralAmount,
    epoch,
    accruedPremiums,
    accruedRewards,
    collateralSymbol,
    openTransfer,
    openWithdraw,
    rewardTokens,
    estimatedPnl,
    epochExpired,
  } = props;

  return (
    <TableRow className="text-white bg-umbra mb-2 rounded-lg">
      <TableCell align="left" className="mx-0 pt-2">
        <Typography variant="h6">
          ${formatAmount(getUserReadableAmount(strike, 8), 5)}
        </Typography>
      </TableCell>
      <TableCell align="left" className="pt-2">
        <Typography variant="h6">{epoch}</Typography>
      </TableCell>
      <TableCell align="left" className="pt-2">
        <Typography variant="h6">
          {formatAmount(getUserReadableAmount(collateralAmount, 18), 5)}{' '}
          {collateralSymbol}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="h6">
          <NumberDisplay n={accruedPremiums} decimals={18} minNumber={0.01} />{' '}
          {collateralSymbol}
        </Typography>
      </TableCell>
      <TableCell>
        {accruedRewards.map((rewards, index) => {
          return (
            <Typography variant="h6" key={index}>
              <NumberDisplay n={rewards} decimals={18} />{' '}
              {rewardTokens[index]?.symbol}
            </Typography>
          );
        })}
      </TableCell>
      <TableCell>
        <Typography variant="h6">
          <NumberDisplay n={estimatedPnl} decimals={18} minNumber={0.01} />{' '}
          {collateralSymbol}
        </Typography>
      </TableCell>
      <TableCell align="left" className="pt-2 flex space-x-2">
        <SplitButton
          options={['Transfer', 'Withdraw']}
          handleClick={(index: number) => {
            if (index === 0) openTransfer();
            else openWithdraw();
          }}
          disableButtons={[false, !epochExpired]}
        />
      </TableCell>
    </TableRow>
  );
};

export default WritePositionTableData;
