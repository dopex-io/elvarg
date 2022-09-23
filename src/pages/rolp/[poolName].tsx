import Head from 'next/head';
import { useContext, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from 'components/UI/Typography';
import AppBar from 'components/common/AppBar';
import {
  AllLpPositionsRolp,
  ProvideLpRolp,
  StatsRolp,
  TopBarRolp,
  UserLpPositionsRolp,
} from 'components/olp/';
import { OlpProvider, OlpContext } from 'contexts/Rolp';

interface Props {
  poolName: string;
}

const Rolp = ({ poolName }: Props) => {
  const { setSelectedPoolName } = useContext(OlpContext);

  useEffect(() => {
    if (poolName && setSelectedPoolName) setSelectedPoolName(poolName);
  }, [poolName, setSelectedPoolName]);

  return (
    <Box className="bg-black min-h-screen">
      <Head>
        <title>Rolp | Dopex</title>
      </Head>
      <AppBar active="ROLPs" />
      <Box className="md:flex pt-5">
        <Box className="ml-auto lg:w-[45%]">
          <Box className="lg:pt-28 sm:pt-20 pt-20 lg:max-w-4xl md:max-w-3xl sm:max-w-2xl max-w-md mx-auto px-4 lg:px-0">
            <TopBarRolp />
          </Box>
          <Box className="pt-5 lg:max-w-4xl md:max-w-3xl sm:max-w-3xl max-w-md mx-auto px-2 lg:px-0">
            <StatsRolp />
          </Box>
          <Box className="pt-2 lg:max-w-4xl md:max-w-3xl md:m-0 mx-3 sm:max-w-3xl max-w-md lg:mx-auto px-2 lg:px-0 mt-5">
            <Typography variant="h6" className="-ml-1">
              My LP Positions
            </Typography>
          </Box>
          <Box className="mb-5 py-2 lg:max-w-4xl md:max-w-3xl md:m-0 mx-3 sm:max-w-3xl max-w-md lg:mx-auto px-2 lg:px-0 flex-auto">
            <UserLpPositionsRolp />
          </Box>
          <Box className="pt-2 lg:max-w-4xl md:max-w-3xl md:m-0 mx-3 sm:max-w-3xl max-w-md lg:mx-auto px-2 lg:px-0 mt-5">
            <Typography variant="h6" className="-ml-1">
              All LP Positions
            </Typography>
          </Box>
          <Box className="mb-5 py-2 lg:max-w-4xl md:max-w-3xl md:m-0 mx-3 sm:max-w-3xl max-w-md lg:mx-auto px-2 lg:px-0 flex-auto">
            <AllLpPositionsRolp />
          </Box>
        </Box>
        <Box className="lg:pt-32 sm:pt-20 lg:mr-auto md:mx-0 mx-4 mb-8 px-2 lg:px-0 lg:ml-32">
          <ProvideLpRolp />
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
    <OlpProvider>
      <Rolp poolName={poolName} />
    </OlpProvider>
  );
};

export default ManagePage;
