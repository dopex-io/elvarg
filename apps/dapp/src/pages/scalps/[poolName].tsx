import Head from 'next/head';

import { useEffect, useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';

import { useBoundStore } from 'store';

import Typography from 'components/UI/Typography';
import AppBar from 'components/common/AppBar';
import TradingViewChart from 'components/common/TradingViewChart';
// import PoolCard from 'components/scalps/Charts/PoolCard';
// import TVLCard from 'components/scalps/Charts/TVLCard';
import Positions from 'components/scalps/Positions';
import TopBar from 'components/scalps/TopBar';
import TradeCard from 'components/scalps/TradeCard';
import Manage from 'components/scalps/Manage';

import { CHAIN_ID_TO_EXPLORER } from 'constants/index';
import { ethers } from 'ethers';

// const SHOWCHARTS = false;

const ManageComponent = () => {
  const [manageSection, setManageSection] = useState<string>('Trade');

  return (
    <Box className="w-full lg:w-[35rem] pt-2">
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
            <Typography variant="h6" className="text-xs pb-1">
              {label}
            </Typography>
          </Button>
        ))}
      </ButtonGroup>
      {manageSection === 'Trade' ? (
        <Box className="bg-cod-gray rounded-b-xl">
          <TradeCard />
        </Box>
      ) : (
        <Manage />
      )}
    </Box>
  );
};

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
    setUniWethPrice,
    setUniArbPrice,
  } = useBoundStore();

  const TVChart = useMemo(() => {
    return (
      <TradingViewChart
        symbol={
          selectedPoolName === 'ETH'
            ? 'UNISWAP3ARBITRUM:WETHUSDC'
            : 'COINBASE:ARBUSD'
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

  useEffect(() => {
    const interval = setInterval(() => {
      updateAll();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const wethWs = new WebSocket(
      'wss://io.dexscreener.com/dex/screener/pair/arbitrum/0xc31e54c7a869b9fcbecc14363cf510d1c41fa443'
    );

    wethWs.onmessage = function (event) {
      const data = JSON.parse(event.data);
      try {
        if (data.pair) {
          setUniWethPrice(ethers.utils.parseUnits(String(data.pair.price), 6));
        }
      } catch (err) {
        console.log(err);
      }
    };

    const arbWs = new WebSocket(
      'wss://io.dexscreener.com/dex/screener/pair/arbitrum/0xa8328bf492ba1b77ad6381b3f7567d942b000baf'
    );

    arbWs.onmessage = function (event) {
      const data = JSON.parse(event.data);
      try {
        if (data.pair) {
          setUniArbPrice(ethers.utils.parseUnits(String(data.pair.price), 6));
        }
      } catch (err) {
        console.log(err);
      }
    };
  }, [setUniWethPrice]);

  return (
    <>
      <Box className="bg-black flex w-screen items-center justify-center">
        <Head>
          <title>Option Scalps | Dopex</title>
        </Head>
        <AppBar active="Scalps" />
        <Box className="my-12 w-2/3">
          <Box className="mt-8 sm:mt-14 md:mt-20 lg:mr-full">
            <TopBar />
          </Box>
          <Box className="w-full h-full flex flex-col space-y-2 lg:flex-row lg:space-x-5">
            <Box className="flex flex-col w-full space-y-4 h-full">
              <Box className="flex-1 mt-4">{TVChart}</Box>
              <Positions />
            </Box>
            <ManageComponent />
          </Box>
          <Box className="flex justify-center w-full mt-10">
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
      </Box>
    </>
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
