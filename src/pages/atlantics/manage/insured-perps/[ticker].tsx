import { useEffect, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Box from '@mui/material/Box';

import AppBar from 'components/common/AppBar';
import Typography from 'components/UI/Typography';
import Title from 'components/atlantics/InsuredPerps/Title';
import Tables from 'components/atlantics/InsuredPerps/Tables';
import ManageCard from 'components/atlantics/InsuredPerps/ManageCard';
import ChartComponent from 'components/atlantics/InsuredPerps/ChartComponent';

import { useBoundStore } from 'store';

// const initialData = [
//   { time: '2018-12-31', value: 22.67 },
//   { time: '2018-12-22', value: 32.51 },
//   { time: '2018-12-23', value: 31.11 },
//   { time: '2018-12-24', value: 27.02 },
//   { time: '2018-12-25', value: 27.32 },
//   { time: '2018-12-26', value: 25.17 },
//   { time: '2018-12-27', value: 28.89 },
//   { time: '2018-12-28', value: 25.46 },
//   { time: '2018-12-29', value: 23.92 },
//   { time: '2018-12-30', value: 22.68 },
// ];
const initialData = [
  {
    time: '2022-11-12',
    open: 1175.16,
    high: 1182.84,
    low: 1136.16,
    close: 1145.72,
  },
  {
    time: '2022-11-13',
    open: 1145.12,
    high: 1153.9,
    low: 1145.12,
    close: 1148.09,
  },
  {
    time: '2022-11-14',
    open: 1160.71,
    high: 1160.71,
    low: 1153.39,
    close: 1159.29,
  },
  {
    time: '2022-11-15',
    open: 1168.26,
    high: 1168.26,
    low: 1159.04,
    close: 1160.5,
  },
  {
    time: '2022-11-16',
    open: 1167.71,
    high: 1205.85,
    low: 1166.67,
    close: 1191.04,
  },
  {
    time: '2022-11-17',
    open: 1191.04,
    high: 1221.4,
    low: 1182.7,
    close: 1111.4,
  },
  {
    time: '2022-11-18',
    open: 1111.51,
    high: 1242.83,
    low: 1103.34,
    close: 1231.25,
  },
  {
    time: '2022-11-19',
    open: 1231.33,
    high: 1251.17,
    low: 1177.68,
    close: 1196.43,
  },
  {
    time: '2022-11-20',
    open: 1206.33,
    high: 1210.2,
    low: 1190.39,
    close: 1198.1,
  },
  // { time: '2022-11-31', open: 109.87, high: 114.69, low: 85.66, close: 111.26 },
  {
    time: '2022-11-21',
    open: 1212.16,
    high: 1182.84,
    low: 1136.16,
    close: 1145.72,
  },
  {
    time: '2022-11-22',
    open: 1221.12,
    high: 1231.9,
    low: 1145.12,
    close: 1230.09,
  },
  {
    time: '2022-11-23',
    open: 1223.71,
    high: 1225.71,
    low: 1200.39,
    close: 1220.29,
  },
  {
    time: '2022-11-24',
    open: 1220.26,
    high: 1280.26,
    low: 1200.04,
    close: 1250.5,
  },
  {
    time: '2022-11-25',
    open: 1322.71,
    high: 1300.85,
    low: 1166.67,
    close: 1200.04,
  },
  {
    time: '2022-11-26',
    open: 1200.04,
    high: 1270.4,
    low: 1200.7,
    close: 1235.4,
  },
  {
    time: '2022-11-27',
    open: 1211.51,
    high: 1242.83,
    low: 1203.34,
    close: 1231.25,
  },
  {
    time: '2022-11-28',
    open: 1231.33,
    high: 1251.17,
    low: 1177.68,
    close: 1196.43,
  },
  {
    time: '2022-11-29',
    open: 1206.33,
    high: 1210.2,
    low: 1190.39,
    close: 1198.1,
  },
  {
    time: '2022-11-30',
    open: 1209.87,
    high: 1214.69,
    low: 1185.66,
    close: 1211.26,
  },
];

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
    (async function () {
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
    })();
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
              <ChartComponent
                data={initialData}
                colors={{
                  backgroundColor: '#1E1E1E',
                  lineColor: '#2962FF',
                  textColor: 'white',
                  areaTopColor: '#2962FF',
                  areaBottomColor: 'rgba(41, 98, 255, 0.28)',
                }}
                containerSize={{ height: 600, width: 200 }}
              />
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
