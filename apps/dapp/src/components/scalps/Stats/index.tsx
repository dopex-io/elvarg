import React from 'react';
import { useMemo } from 'react';

import { ethers } from 'ethers';

import Box from '@mui/material/Box';
import { useBoundStore } from 'store';

import Typography from 'components/UI/Typography';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

const Stats = () => {
  const { optionScalpData, selectedPoolName } = useBoundStore();

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

  const stats = useMemo(() => {
    let _stats = {
      openInterest: '0',
      totalLongs: '0',
      totalShorts: '0',
      totalDeposits: '0',
    };
    if (!optionScalpData) return _stats;

    const { longOpenInterest, shortOpenInterest, quoteDecimals, markPrice } =
      optionScalpData;

    console.log(longOpenInterest.toString(), shortOpenInterest.toString());

    const _totalLongs = longOpenInterest.mul(1e6).div(markPrice);
    const _totalShorts = shortOpenInterest.mul(1e6).div(markPrice);

    _stats.openInterest = formatAmount(
      getUserReadableAmount(
        _totalLongs.add(_totalShorts),
        quoteDecimals.toNumber()
      ),
      10
    );

    _stats.totalLongs = formatAmount(
      getUserReadableAmount(_totalLongs, quoteDecimals.toNumber()),
      5
    );
    _stats.totalShorts = formatAmount(
      getUserReadableAmount(_totalShorts, quoteDecimals.toNumber()),
      5
    );

    return _stats;
  }, [optionScalpData]);

  return (
    <Box className="md:flex my-[2rem] items-center">
      <Box className="ml-10">
        <Typography variant="h5">
          <span className="text-white h-6 text-[1rem] flex items-center justify-center">
            <img
              className="w-9 h-6 mt-1"
              src={`/images/tokens/${optionScalpData?.quoteSymbol!.toLowerCase()}.svg`}
              alt={optionScalpData?.quoteSymbol!}
            />
            {markPrice}
          </span>
        </Typography>
      </Box>
      <Box className="ml-14">
        <Typography variant="h1">
          <span className="text-white h-6 text-[0.75rem] flex">
            {stats.openInterest} {selectedPoolName}
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
            {stats.totalLongs}{' '}
            {selectedPoolName}
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
            {stats.totalShorts}  {' '}
            {selectedPoolName}
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
