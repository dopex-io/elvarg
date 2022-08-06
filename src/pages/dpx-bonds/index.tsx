import Head from 'next/head';
import Box from '@mui/material/Box';

import AppBar from 'components/common/AppBar';
import BondsPage from 'components/bonds/Bonds';

const DpxBonds = () => {
  return (
    <Box className="bg-black min-h-screen m-auto p-3">
      <Head>
        <title>DPX Bonds | Dopex</title>
      </Head>
      <AppBar />
      <Box className="py-20 md:py-32 md:flex mx-auto lg:w-[980px]">
        <Box className="flex-1">
          <BondsPage />
        </Box>
      </Box>
    </Box>
  );
};

export default DpxBonds;
