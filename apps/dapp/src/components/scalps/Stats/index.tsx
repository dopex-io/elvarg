import React from 'react';
import { useMemo, useCallback } from 'react';

import { ethers } from 'ethers';

import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useBoundStore } from 'store';

import Typography from 'components/UI/Typography';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

const Stats = () => {
  const {
    optionScalpData,
    setSelectedPoolName,
    updateOptionScalpUserData,
    updateOptionScalp,
    selectedPoolName,
  } = useBoundStore();

  const handleSelectChange = useCallback(
    async (e: any) => {
      await setSelectedPoolName(e.target.value.toString());
      await updateOptionScalpUserData().then(() => updateOptionScalp());
    },
    [setSelectedPoolName, updateOptionScalp, updateOptionScalpUserData]
  );

  const markPrice = useMemo(() => {
    if (selectedPoolName.toUpperCase() === 'ETH')
      return (
        <Box>
          {formatAmount(
            getUserReadableAmount(
              optionScalpData?.markPrice!,
              optionScalpData?.quoteDecimals!.toNumber()
            ),
            2
          )}
        </Box>
      );
    else if (selectedPoolName.toUpperCase() === 'BTC')
      return (
        <Box>
          {getUserReadableAmount(
            ethers.utils
              .parseUnits('1000000', 'ether')
              .div(optionScalpData?.markPrice!),
            6
          )}
        </Box>
      );

    return '';
  }, [selectedPoolName, optionScalpData]);

  return (
    <Box className="md:flex my-[2rem] items-center">
      <Box>
        <Select
          className="text-white h-8 text-[1rem] pr-[1rem] bg-gradient-to-r from-[#06b6d4] to-[#1d4ed8]"
          MenuProps={{
            sx: {
              '.MuiMenu-paper': {
                background: '#151515',
                color: 'white',
                fill: 'white',
              },
              '.Mui-selected': {
                background:
                  'linear-gradient(to right bottom, #06b6d4, #1d4ed8)',
              },
              height: 150,
            },
            PaperProps: {
              style: {
                width: 120,
              },
            },
          }}
          classes={{
            icon: 'text-white',
          }}
          displayEmpty
          autoWidth
          value={selectedPoolName}
          onChange={handleSelectChange}
        >
          <MenuItem value={'ETH'} key={'ETH'} className="text-white">
            ETH/USDC
          </MenuItem>
          <MenuItem value={'BTC'} key={'BTC'} className="text-white">
            ETH/BTC
          </MenuItem>
        </Select>
      </Box>
      <Box className="ml-14">
        <Typography variant="h5">
          <span className="text-white h-6 text-[1rem] flex items-center">
            {markPrice}{' '}
            <img
              className="w-9 h-6 z-0"
              src={`/images/tokens/${optionScalpData?.quoteSymbol!.toLowerCase()}.svg`}
              alt={optionScalpData?.quoteSymbol!}
            />
          </span>
        </Typography>
      </Box>
      <Box className="ml-14">
        <Typography variant="h1">
          <span className="text-white h-6 text-[0.75rem] flex">
            {formatAmount(
              getUserReadableAmount(
                optionScalpData?.longOpenInterest!,
                optionScalpData?.quoteDecimals!.toNumber()
              ) +
                getUserReadableAmount(
                  optionScalpData?.shortOpenInterest!,
                  optionScalpData?.quoteDecimals!.toNumber()
                ),
              0
            )}{' '}
            {optionScalpData?.quoteSymbol!}
          </span>
        </Typography>
        <Typography variant="h1">
          <span className="text-stieglitz h-6 text-[0.75rem] flex">
            Open Interest
          </span>
        </Typography>
      </Box>
      <Box className="ml-14">
        <Typography variant="h1">
          <span className="text-white h-6 text-[0.75rem] flex">
            {formatAmount(
              getUserReadableAmount(
                optionScalpData?.longOpenInterest!,
                optionScalpData?.baseDecimals!.toNumber()
              ),
              0
            )}{' '}
            {optionScalpData?.baseSymbol}
          </span>
        </Typography>
        <Typography variant="h1">
          <span className="text-stieglitz h-6 text-[0.75rem] flex">
            Total Long
          </span>
        </Typography>
      </Box>
      <Box className="ml-14">
        <Typography variant="h1">
          <span className="text-white h-6 text-[0.75rem] flex">
            {formatAmount(
              getUserReadableAmount(
                optionScalpData?.shortOpenInterest!,
                optionScalpData?.quoteDecimals!.toNumber()
              ),
              0
            )}{' '}
            {optionScalpData?.quoteSymbol}
          </span>
        </Typography>
        <Typography variant="h1">
          <span className="text-stieglitz h-6 text-[0.75rem] flex">
            Total Short
          </span>
        </Typography>
      </Box>
      <Box className="ml-14">
        <Typography variant="h1">
          <span className="text-white h-6 text-[0.75rem] flex">
            {formatAmount(
              getUserReadableAmount(
                optionScalpData?.totalBaseDeposits!,
                optionScalpData?.baseDecimals!.toNumber()
              ),
              0
            )}{' '}
            {optionScalpData?.baseSymbol} /{' '}
            {formatAmount(
              getUserReadableAmount(
                optionScalpData?.totalQuoteDeposits!,
                optionScalpData?.quoteDecimals!.toNumber()
              ),
              0
            )}{' '}
            {optionScalpData?.quoteSymbol}
          </span>
        </Typography>
        <Typography variant="h1">
          <span className="text-stieglitz h-6 text-[0.75rem] flex">
            Total Deposits
          </span>
        </Typography>
      </Box>
    </Box>
  );
};

export default Stats;
