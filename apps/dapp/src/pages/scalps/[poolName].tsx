import Head from 'next/head';
import cx from 'classnames';

import { useEffect, useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import { useBoundStore } from 'store';

import Typography from 'components/UI/Typography';
import AppBar from 'components/common/AppBar';
import TradingViewChart from 'components/common/TradingViewChart';
import PoolCard from 'components/scalps/Charts/PoolCard';
import TVLCard from 'components/scalps/Charts/TVLCard';
import Positions from 'components/scalps/Positions';
import Stats from 'components/scalps/Stats';
import TopBar from 'components/scalps/TopBar';
import TradeCard from 'components/scalps/TradeCard';
import Manage from 'components/scalps/Manage';

import { CHAIN_ID_TO_EXPLORER } from 'constants/index';

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
  } = useBoundStore();

  const [manageSection, setManageSection] = useState<string>('TRADE');

  const TVChart = useMemo(() => {
    return <TradingViewChart />;
  }, []);

  useEffect(() => {
    if (poolName && setSelectedPoolName) setSelectedPoolName(poolName);
  }, [poolName, setSelectedPoolName]);

  useEffect(() => {
    updateOptionScalp().then(() => updateOptionScalpUserData());
  }, [updateOptionScalp, updateOptionScalpUserData]);

  return (
    <Box className="bg-black min-h-screen w-full">
      <Head>
        <title>Option Scalps | Dopex</title>
      </Head>
      <AppBar active="Scalps" />
      <Box className="flex lg:flex-row md:flex-col sm:flex-col items-center justify-center w-full h-full">
        {/* TV, STATS, POSITIONS */}
        <Box className="lg:w-[80rem] md:w-[40rem] sm:w-[30rem] xs:border flex flex-col mt-[10rem]">
          <Box className='xs:pb-[3rem]'>
            <TopBar />
          </Box>
          <Box>
            <Stats />
          </Box>
          <Box>{TVChart}</Box>
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
          <Box className="">
            <Typography variant="h6" className="-ml-1">
              Positions
            </Typography>
          </Box>
          {/* OPEN POSITIONS */}
          <Box className="sm:mt-[2rem] md:mt-[2rem]">
            <Positions />
          </Box>
        </Box>
        {/* Manage section */}
        <Box className="lg:pl-[2rem] md:pl-[2rem] sm:mt-[2rem]">
          <Box className="h-12 bg-cod-gray rounded-full flex flex-row justify-center items-center w-full">
            <Box className="flex flex-1 text-center full rounded-lg px-[1rem]">
              <Typography
                variant="h6"
                className={cx(
                  'font-medium cursor-pointer hover:opacity-50 text-center w-full rounded-l py-1',
                  manageSection === 'LP' && 'bg-mineshaft'
                )}
                onClick={() => setManageSection('LP')}
              >
                LP
              </Typography>
            </Box>
            <Box className="flex flex-1 text-center w-full">
              <Typography
                variant="h6"
                className={cx(
                  'font-medium  cursor-pointer hover:opacity-50 text-center w-full rounded-r py-1',
                  manageSection === 'TRADE' && 'bg-mineshaft'
                )}
                onClick={() => setManageSection('TRADE')}
              >
                Trade
              </Typography>
            </Box>
          </Box>
          <Box className="bg-cod-gray rounded-xl p-3 max-w-sm">
            {manageSection === 'TRADE' ? <TradeCard /> : <Manage />}
          </Box>
        </Box>
      </Box>
      <Box className="flex justify-center space-x-2 my-8">
        <Typography variant="h5" className="text-silver">
          Contract Address:
        </Typography>
        <p
          className="bg-gradient-to-r from-wave-blue to-primary text-transparent bg-clip-text"
        >
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
