import React, { useEffect } from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { useBoundStore } from 'store';

import AppBar from 'components/common/AppBar';

import { Chart } from './Chart';
import { Assets } from './Assets';
import { DebtPositions } from './DebtPositions';
import { Typography } from 'components/UI';
import { LendingPositions } from './LendingPositions';

const LENDING_INTRO: string =
  'https://blog.dopex.io/articles/product-launches-updates/Option-Liquidity-Pools-Walkthrough';

const Lending = () => {
  const {
    lendingData,
    getSsovLending,
    lendingStats,
    ssovLendingTotalCollat,
    ssovLendingTotalBorrowing,
  } = useBoundStore();

  useEffect(() => {
    (async () => {
      await getSsovLending();
    })();
  }, [getSsovLending]);

  return (
    <Box className="bg-black min-h-screen">
      <Head>
        <title>Lending | Dopex</title>
      </Head>
      <AppBar active="Lending" />
      <Box className="pt-1 pb-32 lg:max-w-7xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0 min-h-screen">
        <Box className="text-center mx-auto max-w-xl mb-8 mt-32 flex flex-col items-center">
          <span className="z-1 mb-4 uppercase font-bold text-3xl tracking-[.5em]">
            LENDING
          </span>
          <Typography variant="h5" className="text-stieglitz">
            Lend and borrow crypto. Powered by options.
          </Typography>
          <Box className="flex w-48 justify-around mt-2">
            <a href={LENDING_INTRO} target="_blank" rel="noopener noreferrer">
              <div className="flex">
                <Typography variant="h6" color="wave-blue">
                  Intro to Lending
                </Typography>
                <ArrowForwardIcon className="fill-current text-wave-blue" />
              </div>
            </a>
          </Box>
        </Box>
        <div className="flex mt-2 flex-col space-x-0 space-y-6 lg:flex-row lg:space-x-6 lg:space-y-0">
          <Chart
            key={'Collateral'}
            loanType={'Collateral'}
            stats={lendingStats.map((s) => {
              return {
                loanAmount: s.totalSupply,
                timestamp: s.timestamp,
              };
            })}
            totalLoan={ssovLendingTotalCollat}
          />
          <Chart
            key={'Borrowing'}
            loanType={'Borrowing'}
            stats={lendingStats.map((s) => {
              return {
                loanAmount: s.totalBorrow,
                timestamp: s.timestamp,
              };
            })}
            totalLoan={ssovLendingTotalBorrowing}
          />
        </div>
        <div className="mt-8">
          <Assets data={lendingData} />
        </div>
        <div className="mt-8 flex justify-between gap-4 md:flex-row sm:flex-col">
          <DebtPositions />
          <LendingPositions />
        </div>
      </Box>
    </Box>
  );
};

export default Lending;
