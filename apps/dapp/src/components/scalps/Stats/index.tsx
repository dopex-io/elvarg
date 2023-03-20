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
    // @ts-ignore TODO: FIX
    async (e) => {
      await setSelectedPoolName(e.target.value.toString());
      await updateOptionScalpUserData().then(() => updateOptionScalp());
    },
    [setSelectedPoolName, updateOptionScalp, updateOptionScalpUserData]
  );

  const markPrice = useMemo(() => {
    if (selectedPoolName === 'ETH')
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
    else if (selectedPoolName === 'BTC')
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
    <Box className="md:flex mt-12 mb-12">
      <Box className="">
        <Select
          className="text-white h-8 text-xl"
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
          <span className="text-white h-8 text-xl">{markPrice}</span>
        </Typography>
      </Box>
      <Box className="ml-14">
        <Typography variant="h5">
          <span className="text-white h-8 text-xl flex">
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
        <Typography variant="h6">
          <span className="text-stieglitz h-8 text-[1.2rem] flex">
            Open Interest
          </span>
        </Typography>
      </Box>

      <Box className="ml-14">
        <Typography variant="h5">
          <span className="text-white h-8 text-xl flex">
            {formatAmount(
              getUserReadableAmount(
                optionScalpData?.longOpenInterest!,
                optionScalpData?.quoteDecimals!.toNumber()
              ),
              0
            )}{' '}
            {optionScalpData?.quoteSymbol}
          </span>
        </Typography>
        <Typography variant="h6">
          <span className="text-stieglitz h-8 text-[1.2rem] flex">
            Total Long
          </span>
        </Typography>
      </Box>

      <Box className="ml-14">
        <Typography variant="h5">
          <span className="text-white h-8 text-xl flex">
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
        <Typography variant="h6">
          <span className="text-stieglitz h-8 text-[1.2rem] flex">
            Total Short
          </span>
        </Typography>
      </Box>

      <Box className="ml-14">
        <Typography variant="h5">
          <span className="text-white h-8 text-xl flex">
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
        <Typography variant="h6">
          <span className="text-stieglitz h-8 text-[1.2rem] flex">
            Total Deposits
          </span>
        </Typography>
      </Box>
    </Box>
  );
};

export default Stats;
