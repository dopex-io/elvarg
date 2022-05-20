import React from 'react';
import Box from '@mui/material/Box';
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
  underlyingSymbol: string;
  rewardTokens: TokenData[];
  openTransfer: () => void;
  openWithdraw: () => void;
}

const WritePositionTableData = (props: Props) => {
  const {
    strike,
    collateralAmount,
    epoch,
    accruedPremiums,
    accruedRewards,
    collateralSymbol,
    underlyingSymbol,
    openTransfer,
    openWithdraw,
    rewardTokens,
  } = props;

  return (
    <TableRow className="text-white bg-umbra mb-2 rounded-lg">
      <TableCell align="left">
        <Box className="h-12 flex flex-row items-center">
          <Box className="flex flex-row h-8 w-8 mr-2">
            <img
              src={`/images/tokens/${underlyingSymbol.toLowerCase()}.svg`}
              alt={underlyingSymbol}
            />
          </Box>
          <Typography variant="h5" className="text-white">
            {underlyingSymbol}
          </Typography>
        </Box>
      </TableCell>
      <TableCell align="left" className="mx-0 pt-2">
        <Typography variant="h6">
          ${formatAmount(getUserReadableAmount(strike, 8), 5)}
        </Typography>
      </TableCell>
      <TableCell align="left" className="pt-2">
        <Typography variant="h6">
          {formatAmount(getUserReadableAmount(collateralAmount, 18), 5)}{' '}
          {collateralSymbol}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="h6">
          <NumberDisplay n={accruedPremiums} decimals={18} /> {collateralSymbol}
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
      <TableCell align="left" className="pt-2">
        <Typography variant="h6">{epoch}</Typography>
      </TableCell>
      <TableCell align="left" className="pt-2 flex space-x-2">
        <SplitButton
          options={['Transfer', 'Withdraw']}
          handleClick={(index: number) => {
            if (index === 0) openTransfer();
            else openWithdraw();
          }}
        />
      </TableCell>
    </TableRow>
  );
};

export default WritePositionTableData;
