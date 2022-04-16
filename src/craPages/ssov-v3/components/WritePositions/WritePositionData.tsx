import React from 'react';
import { utils } from 'ethers';
import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import Typography from 'components/UI/Typography';

import { WritePositionInterface } from 'contexts/SsovV3';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';
import CustomButton from 'components/UI/CustomButton';

interface Props extends WritePositionInterface {
  setDialog: () => void;
}

const WritePositionTableData = (props: Props) => {
  const {
    strike,
    collateralAmount,
    epoch,
    accruedPremiums,
    accruedRewards,
    setDialog,
  } = props;

  return (
    <TableRow className="text-white bg-umbra mb-2 rounded-lg">
      <TableCell align="left">
        <Box className="h-12 flex flex-row items-center">
          <Box className="flex flex-row h-8 w-8 mr-2">
            <img src={'/assets/eth.svg'} alt="WETH" />
          </Box>
          <Typography variant="h5" className="text-white">
            WETH
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
          {formatAmount(getUserReadableAmount(collateralAmount, 18), 5)} WETH
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="h6">
          {utils.formatEther(accruedPremiums)} WETH
        </Typography>
      </TableCell>
      <TableCell>
        {accruedRewards.map((rewards, index) => {
          return (
            <Typography variant="h6" key={index}>
              {utils.formatEther(rewards)} DPX
            </Typography>
          );
        })}
      </TableCell>
      <TableCell align="left" className="pt-2">
        <Typography variant="h6">{epoch}</Typography>
      </TableCell>
      <TableCell align="left" className="pt-2">
        <CustomButton size="medium" onClick={setDialog}>
          Transfer
        </CustomButton>
      </TableCell>
    </TableRow>
  );
};

export default WritePositionTableData;
