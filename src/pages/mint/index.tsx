import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Head from 'next/head';

import AppBar from 'components/common/AppBar';
import RdpxV2Main from 'components/rdpx-v2';

import { useBoundStore } from 'store';

const Mint = () => {
  const {
    provider,
    bondsContracts,
    updateBondsContracts,
    updateUserDscBondsData,
  } = useBoundStore();

  useEffect(() => {
    updateBondsContracts();
  }, [updateBondsContracts, provider]);

  useEffect(() => {
    if (!bondsContracts) return;
    updateUserDscBondsData();
  }, [bondsContracts, updateUserDscBondsData]);

  return (
    <Box className="bg-contain min-h-screen">
      <Head>
        <title>Mint | Dopex</title>
      </Head>
      <AppBar active="Mint" />
      <Box className="pt-1 pb-32 lg:max-w-7xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0 min-h-screen">
        <RdpxV2Main />
      </Box>
    </Box>
  );
};

export default Mint;
