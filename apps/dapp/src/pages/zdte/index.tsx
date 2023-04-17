import Head from 'next/head';

import { useEffect } from 'react';

import Box from '@mui/material/Box';
import { useBoundStore } from 'store';

import AppBar from 'components/common/AppBar';
import ExpiryStats from 'components/zdte/ExpiryStats';

const ZdteHomePage = () => {
  const { updateZdteData, updateExpireStats } = useBoundStore();

  useEffect(() => {
    updateZdteData().then(() => {
      updateExpireStats();
    });
  }, []);

  return (
    <Box className="bg-black min-h-screen">
      <Head>
        <title>ZDTE | Dopex</title>
      </Head>
      <AppBar active="ZDTE" />
      <Box className="md:flex py-5 flex-row justify-around mt-24">
        <Box className="lg:max-w-4xl md:max-w-3xl sm:max-w-2xl">
          <ExpiryStats />
        </Box>
      </Box>
    </Box>
  );
};

export default ZdteHomePage;
