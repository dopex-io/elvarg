import Head from 'next/head';

import { useEffect, useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';

import { useBoundStore } from 'store';

import Typography from 'components/UI/Typography';
import AppBar from 'components/common/AppBar';
import TradingViewChart from 'components/common/TradingViewChart';
import PoolCard from 'components/scalps/Charts/PoolCard';
import TVLCard from 'components/scalps/Charts/TVLCard';
import Positions from 'components/scalps/Positions';
import TopBar from 'components/scalps/TopBar';
import TradeCard from 'components/scalps/TradeCard';
import Manage from 'components/scalps/Manage';

import { CHAIN_ID_TO_EXPLORER } from 'constants/index';
import { ethers } from 'ethers';

const SHOWCHARTS = false;

interface Props {
  poolName: string;
}

const OptionScalps = ({ poolName }: Props) => {
  const {
    chainId,
    setSelectedPoolName,
    optionScalpData,
    updateOptionScalp,
    updateOptionScalpUserData,
    selectedPoolName,
    setUniPrice,
  } = useBoundStore();

  const [manageSection, setManageSection] = useState<string>('Trade');

  const TVChart = useMemo(() => {
    return (
      <TradingViewChart
        symbol={
          selectedPoolName === 'ETH'
            ? 'UNISWAP3ARBITRUM:WETHUSDC'
            : 'BINANCE:ETHBTC'
        }
      />
    );
  }, [selectedPoolName]);

  const updateAll = useCallback(() => {
    updateOptionScalp().then(() => updateOptionScalpUserData());
  }, [updateOptionScalp, updateOptionScalpUserData]);

  useEffect(() => {
    if (poolName && setSelectedPoolName) setSelectedPoolName(poolName);
  }, [poolName, setSelectedPoolName]);

  useEffect(() => {
    updateAll();
  }, [updateAll]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     updateAll();
  //   }, 3000);

  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    const ws = new WebSocket(
      'wss://io.dexscreener.com/dex/screener/pair/arbitrum/0xc31e54c7a869b9fcbecc14363cf510d1c41fa443'
    );

    ws.onmessage = function (event) {
      const data = JSON.parse(event.data);
      try {
        if (data.pair) {
          setUniPrice(ethers.utils.parseUnits(String(data.pair.price), 6));
        }
      } catch (err) {
        console.log(err);
      }
    };
  }, [setUniPrice]);

  return (
    <Box className="bg-black min-h-screen w-full">
      <Head>
        <title>Option Scalps | Dopex</title>
      </Head>
      <AppBar active="Scalps" />
      {optionScalpData?.markPrice ? (
        <Box className="flex lg:flex-row md:flex-col sm:flex-col items-center  mx-auto h-full lg:px-20">
          {/* TV, STATS, POSITIONS */}
          <Box className="w-[80rem] flex flex-col mt-[7rem]">
            <Box>
              <Box className="xs:pb-[3rem]">
                <TopBar />
              </Box>
              <Box className="w-max-[80rem]">{TVChart}</Box>
              {SHOWCHARTS ? (
                <Box>
                  <Box className="pt-8 lg:max-w-4xl md:max-w-3xl md:m-0 mx-3 sm:max-w-3xl max-w-md lg:mx-auto px-2 lg:px-0">
                    <Typography variant="h6" className="-ml-1">
                      Liquidity
                    </Typography>
                  </Box>
                  <Box className="pt-4 lg:max-w-4xl md:max-w-3xl md:m-0 mx-3 sm:max-w-3xl max-w-md lg:mx-auto px-2 lg:px-0 relative md:flex">
                    <Typography
                      variant="h4"
                      className="md:left-[40%] left-[25%] top-[40%] absolute"
                    >
                      <span className="text-white">Not available yet</span>
                    </Typography>
                    <Box className="md:w-1/2 w-full md:pr-2">
                      <PoolCard />
                    </Box>
                    <Box className="md:w-1/2 w-full md:pl-2">
                      <TVLCard />
                    </Box>
                  </Box>
                </Box>
              ) : null}
              {/* OPEN POSITIONS */}
              <Box className="sm:mt-[2rem] md:mt-[2rem]">
                <Positions />
              </Box>
            </Box>
            {/* Manage section */}
          </Box>
          <Box className="mt-[9%] mb-auto">
            <Box className="lg:pl-[2rem] md:pl-[2rem] w-100 mt-10">
              <ButtonGroup className="flex w-full justify-between bg-cod-gray border border-umbra rounded-top-lg">
                {['LP', 'Trade'].map((label, index) => (
                  <Button
                    key={index}
                    className={`border-0 hover:border-0 w-full m-1 p-1 transition ease-in-out duration-500 ${
                      manageSection === label
                        ? 'text-white bg-carbon hover:bg-carbon'
                        : 'text-stieglitz bg-transparent hover:bg-transparent'
                    } hover:text-white`}
                    disableRipple
                    onClick={() => setManageSection(label)}
                  >
                    <Typography variant="h6">{label}</Typography>
                  </Button>
                ))}
              </ButtonGroup>
              {manageSection === 'Trade' ? (
                <Box className="bg-cod-gray rounded-b-xl p-2">
                  <TradeCard />
                </Box>
              ) : (
                <Manage />
              )}
            </Box>
          </Box>
        </Box>
      ) : null}
      <Box className="flex justify-center space-x-2 my-8">
        <Typography variant="h5" className="text-silver">
          Contract Address:
        </Typography>
        <p className="bg-gradient-to-r from-wave-blue to-primary text-transparent bg-clip-text">
          <a
            href={`${CHAIN_ID_TO_EXPLORER[chainId]}/address/${
              optionScalpData?.optionScalpContract?.address ?? ''
            }`}
            rel="noopener noreferrer"
            target={'_blank'}
          >
            {optionScalpData?.optionScalpContract?.address}
          </a>
        </p>
      </Box>
    </Box>
  );
};

export async function getServerSideProps(context: {
  query: { poolName: string };
}) {
  return {
    props: {
      poolName: context.query.poolName,
    },
  };
}

const ManagePage = ({ poolName }: Props) => {
  return <OptionScalps poolName={poolName} />;
};

export default ManagePage;
