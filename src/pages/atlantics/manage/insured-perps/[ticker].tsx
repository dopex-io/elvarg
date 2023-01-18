import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import Head from 'next/head';
import Box from '@mui/material/Box';

import AppBar from 'components/common/AppBar';
import WalletButton from 'components/common/WalletButton';
import Title from 'components/atlantics/InsuredPerps/Title';
import Tables from 'components/atlantics/InsuredPerps/Tables';
import ManageCard from 'components/atlantics/InsuredPerps/ManageCard';

import { useBoundStore } from 'store';

import { GMX_STATS_API } from 'constants/env';

import { GmxCandleStick } from 'types';

export const periods = ['1D', '4H', '1H', '15M', '5M'] as const;
export type Period = typeof periods[number];

const ChartComponent = dynamic(
  () => import('components/atlantics/InsuredPerps/ChartComponent'),
  {
    ssr: false,
  }
);

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
  const [gmxChartData, setGmxChartData] = useState<GmxCandleStick[]>([]);
  const [period, setPeriod] = useState<Period>('1D');
  const [triggerMarker, setTriggerMarker] = useState<string>();

  const {
    signer,
    provider,
    accountAddress,
    chainId,
    selectedPoolName,
    atlanticPool,
    setSelectedPoolName,
    updateAtlanticPool,
    updateAtlanticPoolEpochData,
  } = useBoundStore();

  const updatePriceData = useCallback(async () => {
    if (!chainId || !underlying) return;
    const res: Response = await new Promise(async (resolve, reject) => {
      let done = false;
      setTimeout(() => {
        done = true;
        reject(new Error(`Request timeout`));
      }, 10000);

      let lastEx;
      for (let i = 0; i < 3; i++) {
        if (done) return;
        try {
          const res = await fetch(
            `${GMX_STATS_API}/api/candles/${'ETH'}?preferableChainId=${chainId}&period=${period}&from=${
              Math.ceil(Number(new Date()) / 1000) - 86400 * 100
            }&preferableSource=fast`
          );
          resolve(res);
          return;
        } catch (ex) {
          lastEx = ex;
        }
      }
      reject(lastEx);
    });
    if (!res.ok) throw new Error('request failed');
    const json = await res.json();
    let prices: GmxCandleStick[] = json?.prices.map(
      (candleStickData: {
        h: number;
        l: number;
        o: number;
        c: number;
        t: number;
      }) => ({
        high: candleStickData.h,
        low: candleStickData.l,
        open: candleStickData.o,
        close: candleStickData.c,
        time: candleStickData.t,
      })
    );

    setGmxChartData(prices);
  }, [chainId, period, underlying]);

  useEffect(() => {
    if (!underlying || !signer) return;
    updateAtlanticPool(underlying, 'WEEKLY');
  }, [underlying, updateAtlanticPool, signer]);

  useEffect(() => {
    setSelectedPoolName(`${underlying}-${'PUTS'}-${'WEEKLY'}`);
  }, [setSelectedPoolName, underlying]);

  useEffect(() => {
    if (!selectedPoolName || !atlanticPool || !provider) return;
    updateAtlanticPoolEpochData();
  }, [updateAtlanticPoolEpochData, selectedPoolName, atlanticPool, provider]);

  useEffect(() => {
    // setInterval(async () => await updatePriceData(), 10000);
    updatePriceData();
  }, [updatePriceData]);

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
        {accountAddress ? (
          <Box className="flex mt-20 space-x-0 lg:space-x-3 flex-col sm:flex-col md:flex-col lg:flex-row">
            <Box className="flex flex-col space-y-2 w-full sm:w-full lg:w-3/4 h-full">
              <Title
                underlying={underlying}
                deposit={depositToken}
                stats={marketData}
              />
              <Box className="h-[546px] w-full space-y-4 flex flex-col bg-cod-gray rounded-xl text-center">
                <ChartComponent
                  data={gmxChartData}
                  triggerMarker={triggerMarker ?? '0'}
                  period={period}
                  setPeriod={setPeriod}
                  colors={{
                    backgroundColor: 'rgb(21, 21, 21)',
                    lineColor: '#2962FF',
                    textColor: 'white',
                    areaTopColor: 'rgba(109, 255, 185, 0.2)',
                    areaBottomColor: 'rgba(41, 98, 255, 0.1)',
                  }}
                />
              </Box>
              <Tables setTriggerMarker={setTriggerMarker} />
            </Box>
            <Box className="flex flex-col w-full sm:w-full lg:w-1/4 h-full mt-4 lg:mt-0">
              <ManageCard
                underlying={underlying ?? ''}
                stable={depositToken ?? ''}
              />
            </Box>
          </Box>
        ) : (
          <Box className="flex flex-col justify-center h-screen">
            <Box className="flex justify-center">
              <WalletButton>Connect</WalletButton>
            </Box>
          </Box>
        )}
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
