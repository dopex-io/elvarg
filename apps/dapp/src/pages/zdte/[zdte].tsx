import Head from 'next/head';
import { useRouter } from 'next/router';

import { useCallback, useEffect } from 'react';
import React, { useMemo } from 'react';

import Box from '@mui/material/Box';
import { useBoundStore } from 'store';

import AppBar from 'components/common/AppBar';
import ErrorBoundary from 'components/error/ErrorBoundary';
import { OpenPositions, OptionsTable } from 'components/zdte';
import Loading from 'components/zdte/Loading';
import ManageCard from 'components/zdte/Manage';
import TopBar from 'components/zdte/TopBar';
import ZdteContractBox from 'components/zdte/ZdteContractBox';
import ZdteDexScreenerChart from 'components/zdte/ZdteDexScreenerChart';

interface Props {
  zdte: string;
}

const Zdte = ({ zdte }: Props) => {
  const {
    setSelectedPoolName,
    selectedPoolName,
    updateZdteData,
    updateStaticZdteData,
    updateUserZdteLpData,
    updateUserZdtePurchaseData,
    updateVolumeFromSubgraph,
    chainId,
    getZdteContract,
    accountAddress,
    staticZdteData,
  } = useBoundStore();

  useEffect(() => {
    if (zdte && setSelectedPoolName) setSelectedPoolName(zdte);
  }, [zdte, setSelectedPoolName]);

  const updateAll = useCallback(() => {
    updateZdteData().then(() => {
      updateStaticZdteData().then(() => {
        updateUserZdteLpData().then(() => {
          updateVolumeFromSubgraph().then(() => {
            updateUserZdtePurchaseData();
          });
        });
      });
    });
  }, [
    updateZdteData,
    updateUserZdteLpData,
    updateStaticZdteData,
    updateUserZdtePurchaseData,
    chainId,
    selectedPoolName,
    accountAddress,
    getZdteContract,
  ]);

  useEffect(() => {
    updateAll();
  }, [updateAll]);

  useEffect(() => {
    const interval = setInterval(() => {
      updateAll();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const chart = useMemo(() => {
    if (!staticZdteData) {
      return <Loading />;
    }
    return <ZdteDexScreenerChart />;
  }, [staticZdteData]);

  return (
    <Box className="bg-black min-h-screen">
      <Head>
        <title>ZDTE | Dopex</title>
      </Head>
      <AppBar active="ZDTE" />
      <Box className="md:flex py-5 flex-row justify-around">
        <Box className="m-auto lg:w-[60%] space-y-8">
          <Box className="lg:pt-28 sm:pt-20 pt-20 lg:max-w-4xl md:max-w-3xl sm:max-w-2xl max-w-md mx-auto px-4 lg:px-0 space-y-6">
            <TopBar />
          </Box>
          <Box className="lg:max-w-4xl md:max-w-3xl sm:max-w-2xl max-w-md mx-auto px-4 lg:px-0 space-y-6">
            {chart}
          </Box>
          <Box className="mb-5 lg:max-w-4xl md:max-w-3xl md:m-0 sm:max-w-3xl max-w-md lg:mx-auto px-2 lg:px-0 flex-auto mx-auto">
            <OptionsTable />
          </Box>
          <Box className="mb-5 lg:max-w-4xl md:max-w-3xl md:m-0 sm:max-w-3xl max-w-md lg:mx-auto px-2 lg:px-0 flex-auto mx-auto">
            <OpenPositions />
          </Box>
        </Box>
        <Box className="flex justify-around mb-8 px-3 mt-8 md:justify-start md:flex-col md:mt-24 md:mx-0 lg:mr-auto lg:px-0 lg:ml-5">
          <ManageCard />
        </Box>
      </Box>
      <Box className="flex justify-center space-x-2 my-8">
        <ZdteContractBox />
      </Box>
    </Box>
  );
};

const ManagePage = () => {
  const router = useRouter();
  const zdte = router.query['zdte'] as string;

  return (
    <ErrorBoundary>
      <Zdte zdte={zdte} />
    </ErrorBoundary>
  );
};

export default ManagePage;
