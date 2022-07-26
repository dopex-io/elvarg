import Head from 'next/head';
import Box from '@mui/material/Box';

import { StraddlesProvider, StraddlesContext } from 'contexts/Straddles';

import Typography from 'components/UI/Typography';
import AppBar from 'components/common/AppBar';
import TopBar from 'components/straddles/TopBar';
import Stats from 'components/straddles/Stats';
import PoolCard from 'components/straddles/Charts/PoolCard';
import TVLCard from 'components/straddles/Charts/TVLCard';
import Deposits from 'components/straddles/Deposits';
import DepositPanel from 'components/straddles/DepositPanel';
import { useContext, useEffect } from 'react';

interface Props {
  poolName: string;
}

const Straddles = ({ poolName }: Props) => {
  const { setSelectedPoolName } = useContext(StraddlesContext);

  useEffect(() => {
    if (poolName && setSelectedPoolName) setSelectedPoolName(poolName);
  }, [poolName, setSelectedPoolName]);

  return (
    <Box className="bg-black min-h-screen">
      <Head>
        <title>Straddles | Dopex</title>
      </Head>
      <AppBar />
      <Box className="flex pt-5">
        <Box className="w-2/3 ml-5">
          <Box className="lg:pt-28 sm:pt-20 pt-20 lg:max-w-4xl md:max-w-3xl sm:max-w-2xl max-w-md mx-auto px-4 lg:px-0">
            <TopBar />
          </Box>
          <Box className="pt-5 lg:max-w-4xl md:max-w-3xl sm:max-w-3xl max-w-md mx-auto px-2 lg:px-0">
            <Stats />
          </Box>
          <Box className="pt-8 lg:max-w-4xl md:max-w-3xl sm:max-w-3xl max-w-md mx-auto px-2 lg:px-0">
            <Typography variant="h6" className="-ml-1">
              Liquidity
            </Typography>
          </Box>
          <Box className="pt-3 lg:max-w-4xl md:max-w-3xl sm:max-w-3xl max-w-md mx-auto px-2 lg:px-0 lg:flex md:flex relative">
            <Typography variant="h4" className="left-[40%] top-[40%] absolute">
              <span className="text-white">Not available yet</span>
            </Typography>
            <PoolCard />
            <Box className="mx-2"></Box>
            <TVLCard />
          </Box>
          <Box className="pt-2 lg:max-w-4xl md:max-w-3xl sm:max-w-3xl max-w-md mx-auto px-2 lg:px-0">
            <Typography variant="h6" className="-ml-1">
              Deposits
            </Typography>
          </Box>
          <Box className="mb-5 py-2 lg:max-w-4xl md:max-w-3xl sm:max-w-3xl max-w-md mx-auto px-2 lg:px-0 flex-auto">
            <Deposits />
          </Box>
        </Box>
        <Box className="w-1/3 flex">
          <Box className="lg:pt-32 sm:pt-20 pt-20 lg:mr-auto px-2 lg:px-0">
            <DepositPanel />
          </Box>
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
  return (
    <StraddlesProvider>
      <Straddles poolName={poolName} />
    </StraddlesProvider>
  );
};

export default ManagePage;
