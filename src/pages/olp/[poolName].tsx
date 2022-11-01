import Head from 'next/head';
import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from 'components/UI/Typography';
import AppBar from 'components/common/AppBar';
import AllLpPositions from 'components/olp/AllLpPositions';
import ProvideLp from 'components/olp/ProvideLp';
import Stats from 'components/olp/Stats';
import TopBar from 'components/olp/TopBar';
import UserLpPositions from 'components/olp/UserLpPositions';

import { useBoundStore } from 'store';

interface Props {
  poolName: string;
}

const Olp = ({ poolName }: Props) => {
  const {
    setSelectedPoolName,
    updateOlp,
    updateOlpUserData,
    updateOlpEpochData,
    chainId,
  } = useBoundStore();

  useEffect(() => {
    if (poolName && setSelectedPoolName) setSelectedPoolName(poolName);
  }, [poolName, setSelectedPoolName]);

  useEffect(() => {
    updateOlp().then(() =>
      updateOlpEpochData().then(() => {
        updateOlpUserData();
      })
    );
  }, [updateOlp, updateOlpEpochData, updateOlpUserData, chainId]);

  return (
    <Box className="bg-black min-h-screen">
      <Head>
        <title>Olp | Dopex</title>
      </Head>
      <AppBar active="OLPs" />
      <Box className="md:flex pt-5">
        <Box className="ml-auto lg:w-[45%]">
          <Box className="lg:pt-28 sm:pt-20 pt-20 lg:max-w-4xl md:max-w-3xl sm:max-w-2xl max-w-md mx-auto px-4 lg:px-0">
            <TopBar />
          </Box>
          <Box className="pt-5 lg:max-w-4xl md:max-w-3xl sm:max-w-3xl max-w-md mx-auto px-2 lg:px-0">
            <Stats />
          </Box>
          <Box className="pt-2 lg:max-w-4xl md:max-w-3xl md:m-0 mx-3 sm:max-w-3xl max-w-md lg:mx-auto px-2 lg:px-0 mt-5">
            <Typography variant="h6" className="-ml-1">
              My LP Positions
            </Typography>
          </Box>
          <Box className="mb-5 py-2 lg:max-w-4xl md:max-w-3xl md:m-0 mx-3 sm:max-w-3xl max-w-md lg:mx-auto px-2 lg:px-0 flex-auto">
            <UserLpPositions />
          </Box>
          <Box className="pt-2 lg:max-w-4xl md:max-w-3xl md:m-0 mx-3 sm:max-w-3xl max-w-md lg:mx-auto px-2 lg:px-0 mt-5">
            <Typography variant="h6" className="-ml-1">
              All LP Positions
            </Typography>
          </Box>
          <Box className="mb-5 py-2 lg:max-w-4xl md:max-w-3xl md:m-0 mx-3 sm:max-w-3xl max-w-md lg:mx-auto px-2 lg:px-0 flex-auto">
            <AllLpPositions />
          </Box>
        </Box>
        <Box className="lg:pt-32 sm:pt-20 lg:mr-auto md:mx-0 mx-4 mb-8 px-2 lg:px-0 lg:ml-32">
          <ProvideLp />
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
  return <Olp poolName={poolName} />;
};

export default ManagePage;
