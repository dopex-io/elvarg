import Head from 'next/head';
import { useEffect } from 'react';
import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';
import AppBar from 'components/common/AppBar';
import TopBar from 'components/perps/TopBar';
import Stats from 'components/perps/Stats';
import PoolCard from 'components/perps/Charts/PoolCard';
import TVLCard from 'components/perps/Charts/TVLCard';
import Deposits from 'components/perps/Deposits';
import Positions from 'components/perps/Positions';
import Manage from 'components/perps/Manage';

import { useBoundStore } from 'store';

const SHOWCHARTS = false;

interface Props {
  poolName: string;
}

const Perps = ({ poolName }: Props) => {
  const { setSelectedPoolName, updateOptionPerp, updateOptionPerpUserData } =
    useBoundStore();

  useEffect(() => {
    if (poolName && setSelectedPoolName) setSelectedPoolName(poolName);
  }, [poolName, setSelectedPoolName]);

  useEffect(() => {
    updateOptionPerp().then(() => updateOptionPerpUserData());
  }, [updateOptionPerp, updateOptionPerpUserData]);

  return (
    <Box className="bg-black min-h-screen">
      <Head>
        <title>Perps | Dopex</title>
      </Head>
      <AppBar active="Perps" />
      <Box className="md:flex pt-5">
        <Box className="ml-auto lg:w-[45%]">
          <Box className="lg:pt-28 sm:pt-20 pt-20 lg:max-w-4xl md:max-w-3xl sm:max-w-2xl max-w-md mx-auto px-4 lg:px-0">
            <TopBar />
          </Box>
          <Box className="pt-5 lg:max-w-4xl md:max-w-3xl sm:max-w-3xl max-w-md mx-auto px-2 lg:px-0">
            <Stats />
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

          <Box className="pt-2 lg:max-w-4xl md:max-w-3xl md:m-0 mx-3 sm:max-w-3xl max-w-md lg:mx-auto px-2 lg:px-0 mt-5">
            <Typography variant="h6" className="-ml-1">
              Deposits
            </Typography>
          </Box>
          <Box className="mb-5 py-2 lg:max-w-4xl md:max-w-3xl md:m-0 mx-3 sm:max-w-3xl max-w-md lg:mx-auto px-2 lg:px-0 flex-auto">
            <Deposits />
          </Box>
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
          <Manage />
        </Box>
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
  return <Perps poolName={poolName} />;
};

export default ManagePage;
