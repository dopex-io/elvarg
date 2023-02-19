import React, { useEffect } from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';

import AppBar from 'components/common/AppBar';
import { Chart } from './Chart';
import { useBoundStore } from 'store';
import { Assets } from './Assets';
import DebtPositions from './DebtPositions';

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
      <Box className="pt-1 pb-32 lg:max-w-6xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0 min-h-screen">
        <div className="flex flex-row justify-between mt-32">
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
        <div className="mt-8">
          <DebtPositions />
        </div>
      </Box>
    </Box>
  );
};

export default Lending;
