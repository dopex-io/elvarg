import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Box from '@mui/material/Box';

import AppBar from 'components/common/AppBar';
import { Chart } from './Chart';
import { useBoundStore } from 'store';
import { LendingStats, SsovLendingData } from 'store/Vault/lending';
import { Assets } from './Assets';
import DebtPositions from './DebtPositions';

const LENDING_URL = 'http://localhost:5001/api/v2/lending';

const ranNum = () => {
  return Math.floor(Math.random() * 10);
};

const getBorrowingData = () => {
  return [...Array(30)].map((_, i) => ({
    loanAmount: (ranNum() + 1) * 100,
    timestamp: 123 + i,
  }));
};

const Lending = () => {
  const { chainId, lendingData, updateSsovLendingData } = useBoundStore();
  const [lendingStats, setLendingStats] = useState<LendingStats[]>([]);
  const [assetData, setAssetData] = useState<SsovLendingData[]>([]);

  useEffect(() => {
    (async () => {
      // const ssovLendingData = await axios.get(LENDING_URL);
      // const ssovs: SsovLendingData[] = ssovLendingData.data[chainId] || [];
      // setAssetData(ssovs);

      await updateSsovLendingData();
      setAssetData(lendingData);

      const lendingStats = `
      {
        "data": [
          {
            "totalSupply": 674529,
            "totalBorrow": 0,
            "timestamp": 1675038259
          },
          {
            "totalSupply": 709672,
            "totalBorrow": 0,
            "timestamp": 1675175442
          },
          {
            "totalSupply": 714649,
            "totalBorrow": 0,
            "timestamp": 1675256169
          },
          {
            "totalSupply": 813687,
            "totalBorrow": 0,
            "timestamp": 1675305088
          }
        ]
      }
    `;
      const stats: LendingStats[] = JSON.parse(lendingStats).data;
      setLendingStats(stats);
    })();
  }, [chainId, lendingData, updateSsovLendingData]);

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
            // stats={lendingStats.map(s => {
            //   return {
            //     loanAmount: s.totalBorrow,
            //     timestamp: s.timestamp
            //   }
            // })}
            stats={getBorrowingData()}
            totalLoan={180}
          />
        </div>
        <Assets data={assetData} />
        <DebtPositions />
      </Box>
    </Box>
  );
};

export default Lending;
