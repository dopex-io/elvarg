import Head from 'next/head';
import Box from '@mui/material/Box';

import AppBar from 'components/common/AppBar';
import Swap from 'components/amm/Swap';

const AMM = () => {
  return (
    <Box className="bg-gradient-to-b from-[#062125] to-transparent bg-no-repeat min-h-screen">
      <Head>
        <title>AMM</title>
      </Head>
      <AppBar active="AMM" />
      <Box className="pt-1 pb-32 lg:max-w-7xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0 min-h-screen">
        <Box className="text-center mx-auto max-w-md mb-8 mt-32">
          <Swap />
        </Box>
      </Box>
    </Box>
  );
};

export default AMM;
