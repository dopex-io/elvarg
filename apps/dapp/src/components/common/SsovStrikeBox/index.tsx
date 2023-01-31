import React from 'react';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import Typography from 'components/UI/Typography';

import formatAmount from 'utils/general/formatAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import { BigNumber } from 'ethers';

interface Props {
  userTokenBalance: BigNumber;
  collateralSymbol: string;
  strike: number;
  handleSelectStrike: any;
  strikes: string[];
}

const SelectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 324,
      width: 250,
    },
  },
  classes: {
    paper: 'bg-mineshaft',
  },
};

export default function SsovStrikeBox(props: Props) {
  const {
    userTokenBalance,
    collateralSymbol,
    strike,
    handleSelectStrike,
    strikes,
  } = props;

  return (
    <>
      <Box className="flex">
        <Typography
          variant="h6"
          className="text-stieglitz ml-0 mr-auto text-[0.72rem]"
        >
          Balance
        </Typography>
        <Typography
          variant="h6"
          className="text-white ml-auto mr-0 text-[0.72rem]"
        >
          {formatAmount(getUserReadableAmount(userTokenBalance, 18), 8)}{' '}
          {collateralSymbol}
        </Typography>
      </Box>
      <Box className="mt-2 flex">
        <Box className={'w-full'}>
          <Select
            className="bg-mineshaft hover:bg-mineshaft hover:opacity-80 rounded-md px-2 text-white"
            fullWidth
            value={strike}
            onChange={handleSelectStrike}
            input={<Input />}
            variant="outlined"
            placeholder="Select Strike Prices"
            MenuProps={SelectMenuProps}
            classes={{
              icon: 'absolute right-7 text-white',
              select: 'overflow-hidden',
            }}
            disableUnderline
            label="strikes"
          >
            {strikes.map((strike: string, index: number) => (
              <MenuItem key={index} value={index} className="pb-2 pt-2">
                <Typography
                  variant="h5"
                  className="text-white text-left w-full relative ml-3"
                >
                  ${formatAmount(strike, 4)}
                </Typography>
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>
    </>
  );
}
