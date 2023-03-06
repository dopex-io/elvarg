import Head from 'next/head';

import { value useEffect } from 'react';

import Box from '@mui/material/Box';
import { value useBoundStore } from 'store';

import Typography from 'components/UI/Typography';
import AppBar from 'components/common/AppBar';
import TradingViewChart from 'components/common/TradingViewChart';
import PoolCard from 'components/scalps/Charts/PoolCard';
import TVLCard from 'components/scalps/Charts/TVLCard';
import Manage from 'components/scalps/Manage';
import Positions from 'components/scalps/Positions';
import Stats from 'components/scalps/Stats';
import TopBar from 'components/scalps/TopBar';
import TradeCard from 'components/scalps/TradeCard';

import { value CHAIN_ID_TO_EXPLORER } from 'constants/index';

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

  useEffect(() => {
    if (poolName && setSelectedPoolName) setSelectedPoolName(poolName);
  }, [poolName, setSelectedPoolName]);

  useEffect(() => {
    updateOptionScalp().then(() => updateOptionScalpUserData());
  }, [updateOptionScalp, updateOptionScalpUserData]);

  return (
    <Box className="bg-black min-h-screen">
      <Head>
        <title>Option Scalps | Dopex</title>
      </Head>
      <AppBar active="Scalps" />
      <Box className="md:flex pt-5">
        <Box className="ml-auto lg:w-[45%]">
          <Box className="lg:pt-28 sm:pt-20 pt-20 lg:max-w-4xl md:max-w-3xl sm:max-w-2xl max-w-md mx-auto px-4 lg:px-0">
            <TopBar />
          </Box>
          <Box className="pt-5 lg:max-w-4xl md:max-w-3xl sm:max-w-3xl max-w-md mx-auto px-2 lg:px-0 mb-6">
            <Stats />
          </Box>
          <Box className="pt-5 lg:max-w-4xl md:max-w-3xl sm:max-w-3xl max-w-md mx-auto px-2 lg:px-0 mb-6">
            <TradingViewChart />
          </Box>

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

          <Box className="pt-2 lg:max-w-4xl md:max-w-3xl md:m-0 mx-3 sm:max-w-3xl max-w-md lg:mx-auto px-2 lg:px-0">
            <Typography variant="h6" className="-ml-1">
              Positions
            </Typography>
          </Box>
          <Box className="mb-5 py-2 lg:max-w-4xl md:max-w-3xl md:m-0 mx-3 sm:max-w-3xl max-w-md lg:mx-auto px-2 lg:px-0 flex-auto">
            <Positions />
          </Box>
        </Box>
        <Box className="lg:pt-32 sm:pt-20 lg:mr-auto md:mx-0 mx-4 mb-8 px-2 lg:px-0 lg:ml-32">
          <Box className="bg-cod-gray rounded-xl p-3 max-w-sm">
            <TradeCard />
          </Box>
          <Box className="bg-cod-gray rounded-xl p-3 max-w-sm mt-4">
            <Manage />
          </Box>
        </Box>
      </Box>
      <Box className="flex justify-center space-x-2 my-8">
        <Typography variant="h5" className="text-silver">
          Contract Address:
        </Typography>
        <Typography
          variant="h5"
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
        </Typography>
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
