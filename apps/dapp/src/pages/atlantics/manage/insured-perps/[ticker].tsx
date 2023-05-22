import { useCallback, useEffect, useState } from 'react';

import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Box from '@mui/material/Box';
import axios from 'axios';
import { useBoundStore } from 'store';
import { GmxCandleStick } from 'types';

import ManageCard from 'components/atlantics/InsuredPerps/ManageCard';
import Tables from 'components/atlantics/InsuredPerps/Tables';
import Title from 'components/atlantics/InsuredPerps/Title';
import AppBar from 'components/common/AppBar';
import SignerButton from 'components/common/SignerButton';

export const periods = ['1D', '4H', '1H', '15M', '5M'] as const;
export type Period = (typeof periods)[number];

const TVChart = dynamic(
  () => import('components/atlantics/InsuredPerps/TVChart'),
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
            `https://stats.gmx.io/api/candles/${'ETH'}?preferableChainId=${chainId}&period=${period}&from=${
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

    if (period === '1D') {
      const latestTicker = prices[prices.length - 1];

      if (!latestTicker) return;

      const { usd } = await axios
        .get(
          `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`
        )
        .then((res) => res.data.ethereum);

      setMarketData((prevData) => ({ ...prevData, latest: usd }));

      setMarketData((prevData) => ({
        ...prevData,
        high_24h: latestTicker.high,
        low_24h: latestTicker.low,
        change_24h:
          (Math.abs(latestTicker.open - latestTicker.close) /
            latestTicker.open) *
          100,
      }));
    }
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
    updatePriceData();
  }, [updatePriceData]);

  return (
    <Box className="bg-black bg-contain bg-no-repeat min-h-screen">
      <Head>
        {marketData.latest === 0 || !underlying || !depositToken ? (
          <title>... | ... | Insured Perps | Dopex</title>
        ) : (
          <title>
            ${marketData.latest} | {underlying.concat('/', depositToken)} |
            Insured Perps | Dopex
          </title>
        )}
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
                <TVChart
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
              <SignerButton>Connect</SignerButton>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

const InsuredLongPerps = () => {
  const router = useRouter();
  const ticker = router.query['ticker'] as string;

  if (!ticker) return null;

  const [underlying, depositToken] = ticker.split('-');
  return <Main underlying={underlying} depositToken={depositToken} />;
};

export default InsuredLongPerps;
