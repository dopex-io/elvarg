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
    <Box className="w-full md:w-[25rem]">
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
    setUniPrice,
  } = useBoundStore();

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

  useEffect(() => {
    const interval = setInterval(() => {
      updateAll();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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
    <>
      <Box className="bg-black flex items-center justify-center">
        <Head>
          <title>Option Scalps | Dopex</title>
        </Head>
        <AppBar active="Scalps" />
        <Box className="px-2 pt-5 ">
          <Box className="mt-8 sm:mt-14 lg:mr-full">
            <TopBar />
          </Box>
          <Box className="w-full h-full flex flex-col space-y-4 lg:flex-row lg:space-x-5">
            <Box className="flex flex-col space-y-4">
              <Box className="flex-1 w-full md:w-[60rem] h-[40rem] mt-4">
                {TVChart}
              </Box>
              <Positions />
            </Box>
            <ManageComponent />
          </Box>
        </Box>
      </Box>
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
