import React, { useEffect } from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';

import AppBar from 'components/common/AppBar';
import { Chart } from './Chart';
import { useBoundStore } from 'store';
import { Assets } from './Assets';
import DebtPositions from './DebtPositions';

const Lending = () => {
  const { lendingData, getSsovLending, lendingStats } = useBoundStore();

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
      <Box className="lg:pt-28 lg:max-w-5xl md:max-w-3xl sm:max-w-2xl ml-auto mr-auto mt-10">
        <div className="flex flex-row justify-between mb-10">
          <Chart
            key={'Collateral'}
            loanType={'Collateral'}
            stats={lendingStats.map((s) => {
              return {
                loanAmount: s.totalSupply,
                timestamp: s.timestamp,
              };
            })}
            totalLoan={180}
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
            totalLoan={180}
          />
        </div>
        <Assets data={lendingData} />
        <DebtPositions />
      </Box>
    </Box>
  );
};

export default Lending;
