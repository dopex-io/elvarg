import { useEffect, useState } from 'react';
import axios from 'axios';
// import { useMemo } from 'react';
// import dynamic from 'next/dynamic';
import Head from 'next/head';
import Box from '@mui/material/Box';

import AppBar from 'components/common/AppBar';
import Typography from 'components/UI/Typography';
// import ManagePosition from 'components/atlantics/InsuredPerps/ManagePosition';
import Title from 'components/atlantics/InsuredPerps/Title';
import Tables from 'components/atlantics/InsuredPerps/Tables';
// import InsuredLongPerps from 'components/atlantics/InsuredPerps';
import ManageCard from 'components/atlantics/InsuredPerps/ManageCard';

import { useBoundStore } from 'store';

// import { useBoundStore } from 'store';

// const TVChartContainer = dynamic(
//   () =>
//     import('components/atlantics/InsuredPerps/TVChartContainer').then(
//       (mod) => mod.default
//     ),
//   { ssr: false }
// );

interface TickerProps {
  underlying: string | undefined;
  depositToken: string | undefined;
}

export const Main = (props: TickerProps) => {
  const { underlying, depositToken } = props;

  const [marketData, setMarketData] = useState({
    latest: 0,
    high_24h: 0,
    low_24h: 0,
    change_24h: 0,
  });

  const {
    provider,
    setSelectedPoolName,
    updateAtlanticPool,
    updateAtlanticPoolEpochData,
  } = useBoundStore();

  useEffect(() => {
    setSelectedPoolName(`${underlying}-PUTS-WEEKLY`);
  }, [setSelectedPoolName, underlying]);

  useEffect(() => {
    updateAtlanticPool('WETH', 'WEEKLY').then(() => {
      updateAtlanticPoolEpochData();
    });
  }, [updateAtlanticPool, updateAtlanticPoolEpochData, provider]);

  useEffect(() => {
    setInterval(async function () {
      try {
        const currentTime = Math.ceil(Number(new Date()) / 1000);
        const minusOneDay = Math.ceil(Number(new Date()) / 1000) - 86400;

        const results = await Promise.all([
          axios.get(
            `https://api.coingecko.com/api/v3/coins/ethereum/market_chart/range?vs_currency=usd&from=${minusOneDay}&to=${currentTime}`
          ),
        ]);

        const sortedPrices = results[0].data.prices
          .map((a: number[]) => a[1])
          .sort((a: number, b: number) => a - b);

        const len = sortedPrices.length;

        const latest =
          results[0].data.prices[results[0].data.prices.length - 1][1];

        setMarketData({
          latest,
          high_24h: sortedPrices[len - 1],
          low_24h: sortedPrices[0],
          change_24h:
            ((sortedPrices[len - 1] - sortedPrices[0]) /
              sortedPrices[len - 1]) *
            100,
        });
      } catch (e) {
        setMarketData({
          latest: 0,
          high_24h: 0,
          low_24h: 0,
          change_24h: 0,
        });
      }
    }, 10000);
  }, []);

  return (
    <Box className="bg-black bg-contain bg-no-repeat min-h-screen">
      <Head>
        <title>Atlantics | Dopex</title>
      </Head>
      <AppBar active="Atlantics" />
      <Box className="py-12 lg:max-w-7xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0 min-h-screen">
        <Box className="flex mt-20 space-x-0 lg:space-x-3 flex-col sm:flex-col md:flex-col lg:flex-row">
          <Box className="flex flex-col space-y-8 w-full sm:w-full lg:w-3/4 h-full">
            <Title
              underlying={underlying}
              deposit={depositToken}
              stats={marketData}
            />
            <Box className="h-[60vh] w-full space-y-4 flex flex-col bg-umbra rounded-xl text-center">
              {/* <TVChartContainer /> */}
              <Typography variant="h6" className="my-auto">
                Trading View Chart
              </Typography>
            </Box>
            <Box className="w-full space-y-4">
              <Tables />
            </Box>
          </Box>
          <Box className="flex flex-col w-full sm:w-full lg:w-1/4 h-full mt-4 lg:mt-0">
            <Typography variant="h6">
              <ManageCard
                underlying={underlying ?? ''}
                stable={depositToken ?? ''}
              />
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export async function getServerSideProps(context: {
  query: { ticker: string[] };
}) {
  return {
    props: {
      query: context.query.ticker,
    },
  };
}

const InsuredLongPerps = (props: { query: string }) => {
  const ticker = props.query.split('-');
  return <Main underlying={ticker[0]} depositToken={ticker[1]} />;
};

export default InsuredLongPerps;
