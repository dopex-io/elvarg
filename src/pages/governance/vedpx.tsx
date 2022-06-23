import Head from 'next/head';
import Box from '@mui/material/Box';

import AppBar from 'components/common/AppBar';
import Overview from 'components/vedpx/Overview';
import UserVeDPX from 'components/vedpx/UserVeDPX';
import VeDPXYield from 'components/vedpx/VeDPXYield';

import { VeDPXProvider } from 'contexts/VeDPX';

const VeDPX = () => {
  return (
    <VeDPXProvider>
      <Box className="bg-black min-h-screen">
        <Head>
          <title>veDPX | Dopex</title>
        </Head>
        <AppBar />
        <Box className="pt-32 pb-32 lg:max-w-5xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0">
          <Overview />
          <Box className="flex flex-col space-x-4 2xl:flex-row">
            <UserVeDPX />
            <VeDPXYield />
          </Box>
        </Box>
      </Box>
    </VeDPXProvider>
  );
};

export default VeDPX;
