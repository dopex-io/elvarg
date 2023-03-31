import React from 'react';
import { useMemo } from 'react';

import Box from '@mui/material/Box';
import { useBoundStore } from 'store';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

const Stats = () => {
  const { optionScalpData, selectedPoolName, uniWethPrice, uniArbPrice } =
    useBoundStore();

  const markPrice = useMemo(() => {
    if (
      selectedPoolName.toUpperCase() === 'ETH' ||
      selectedPoolName.toUpperCase() === 'ARB'
    )
      return (
        <Box>
          {formatAmount(
            getUserReadableAmount(
              selectedPoolName === 'ETH' ? uniWethPrice : uniArbPrice,
              optionScalpData?.quoteDecimals!.toNumber()
            ),
            4
          )}
        </Box>
      );

    return '';
  }, [selectedPoolName, optionScalpData, uniWethPrice, uniArbPrice]);

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
    <Box className="flex mt-[2rem] md:mt-0 justify-center items-center">
      <Box className="flex flex-row space-x-3 md:space-x-5 md:ml-4">
        <Box>
          <span className="text-white  text-[0.5rem] sm:text-[0.8rem] flex">
            {markPrice}
          </span>
          <span className="text-stieglitz  text-[0.5rem] sm:text-[0.8rem] flex">
            Mark Price
          </span>
        </Box>
        <Box>
          <span className="text-white  text-[0.5rem] sm:text-[0.8rem] flex">
            {stats.openInterest} {selectedPoolName}
          </span>
          <span className="text-stieglitz  text-[0.5rem] sm:text-[0.8rem] flex">
            Open Interest
          </span>
        </Box>
        <Box>
          <span className="text-white  text-[0.5rem] sm:text-[0.8rem] flex">
            {stats.totalLongs} {selectedPoolName}
          </span>
          <span className="text-stieglitz  text-[0.5rem] sm:text-[0.8rem] flex">
            Total Long
          </span>
        </Box>
        <Box>
          <span className="text-white  text-[0.5rem] sm:text-[0.8rem] flex">
            {stats.totalShorts} {selectedPoolName}
          </span>
          <span className="text-stieglitz  text-[0.5rem] sm:text-[0.8rem] flex">
            Total Short
          </span>
        </Box>
        <Box>
          <span className="text-white  text-[0.5rem] sm:text-[0.8rem] flex">
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
          <span className="text-stieglitz  text-[0.5rem] sm:text-[0.8rem] flex">
            Total Deposits
          </span>
        </Box>
      </Box>
    </Box>
  );
};

export default Stats;
