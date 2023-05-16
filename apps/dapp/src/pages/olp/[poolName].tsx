import React, { useEffect } from 'react';

import { useRouter } from 'next/router';

import Box from '@mui/material/Box';
import { NextSeo } from 'next-seo';
import { useBoundStore } from 'store';

import AppBar from 'components/common/AppBar';
import AllLpPositions from 'components/olp/AllLpPositions';
import ProvideLp from 'components/olp/ProvideLp';
import Stats from 'components/olp/Stats';
import TopBar from 'components/olp/TopBar';
import UserLpPositions from 'components/olp/UserLpPositions';

const Olp = ({ poolName }: { poolName: string }) => {
  const {
    setSelectedPoolName,
    updateOlp,
    updateOlpUserData,
    updateOlpEpochData,
    chainId,
  } = useBoundStore();

  useEffect(() => {
    if (poolName && setSelectedPoolName) {
      setSelectedPoolName(poolName);
      updateOlp().then(() =>
        updateOlpEpochData().then(() => {
          updateOlpUserData();
        })
      );
    }
  }, [
    updateOlp,
    updateOlpEpochData,
    updateOlpUserData,
    chainId,
    poolName,
    setSelectedPoolName,
  ]);

  return (
    <Box className="bg-black min-h-screen">
      <NextSeo
        title={`${poolName} OLP | Dopex Option Liquidity Pools`}
        description="Liquidity Pool for SSOV options"
        canonical={`https://dopex.io/olp/${poolName}`}
        openGraph={{
          url: `https://dopex.io/olp/${poolName}`,
          title: `${poolName} OLP | Dopex Option Liquidity Pools`,
          description: 'Liquidity Pool for SSOV options',
          images: [
            {
              url: `https://dopex.io/images/banners/olp.png`,
              width: 800,
              height: 600,
              alt: 'OLP',
              type: 'image/png',
            },
          ],
        }}
      />
      <AppBar active="OLPs" />
      <Box className="md:flex py-5 flex-row justify-around">
        <Box className="ml-auto lg:w-[50%] space-y-8">
          <Box className="lg:pt-28 sm:pt-20 pt-20 lg:max-w-4xl md:max-w-3xl sm:max-w-2xl max-w-md mx-auto px-4 lg:px-0 space-y-6">
            <TopBar />
          </Box>
          <Box className="lg:max-w-4xl md:max-w-3xl sm:max-w-2xl max-w-md mx-auto px-4 lg:px-0 space-y-6">
            <Stats />
          </Box>
          <Box className="mb-5 lg:max-w-4xl md:max-w-3xl md:m-0 mx-3 sm:max-w-3xl max-w-md lg:mx-auto px-2 lg:px-0 flex-auto">
            <UserLpPositions />
          </Box>
          <Box className="mb-5 lg:max-w-4xl md:max-w-3xl md:m-0 mx-3 sm:max-w-3xl max-w-md lg:mx-auto px-2 lg:px-0 flex-auto">
            <AllLpPositions />
          </Box>
        </Box>
        <Box className="mb-8 lg:pt-28 lg:mr-auto lg:px-0 lg:ml-5 md:mx-0 sm:pt-20 pt-4 sm:px-0 px-4 sm:mt-8 lg:mt-0">
          <ProvideLp />
        </Box>
      </Box>
    </Box>
  );
};

const ManagePage = () => {
  const router = useRouter();
  const poolName = router.query['poolName'] as string;

  return <Olp poolName={poolName} />;
};

export default ManagePage;
