import Head from 'next/head';

import { Suspense, useEffect } from 'react';
import React, { useMemo } from 'react';

import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import { useBoundStore } from 'store';

import AppBar from 'components/common/AppBar';
import ErrorBoundary from 'components/error/ErrorBoundary';
import { OpenPositions, OptionsTable } from 'components/zdte';
import ManageCard from 'components/zdte/Manage';
import Stats from 'components/zdte/Stats';
import ZdteTvChart from 'components/zdte/ZdteTvChart';

import { CHAINS } from 'constants/chains';

interface Props {
  zdte: string;
}
const Loading = () => {
  return (
    <Box className="absolute left-[49%] top-[49%]">
      <CircularProgress />
    </Box>
  );
};

const Zdte = ({ zdte }: Props) => {
  const {
    setSelectedPoolName,
    selectedPoolName,
    updateZdteData,
    updateStaticZdteData,
    updateUserZdteLpData,
    updateUserZdtePurchaseData,
    chainId,
    getZdteContract,
    zdteData,
    accountAddress,
    staticZdteData,
  } = useBoundStore();

  useEffect(() => {
    if (zdte && setSelectedPoolName) setSelectedPoolName(zdte);
  }, [zdte, setSelectedPoolName]);

  useEffect(() => {
    updateZdteData().then(() => {
      updateStaticZdteData().then(() => {
        updateUserZdteLpData().then(() => {
          updateUserZdtePurchaseData();
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

  const tvChart = useMemo(() => {
    if (!staticZdteData) return <Loading />;
    return <ZdteTvChart />;
  }, [staticZdteData]);

  return (
    <Box className="bg-black min-h-screen">
      <Head>
        <title>ZDTE | Dopex</title>
      </Head>
      <AppBar active="OLPs" />
      {zdteData ? (
        <>
          <Box className="md:flex py-5 flex-row justify-around">
            <Box className="m-auto lg:w-[60%] space-y-8">
              <Box className="lg:pt-28 sm:pt-20 pt-20 lg:max-w-4xl md:max-w-3xl sm:max-w-2xl max-w-md mx-auto px-4 lg:px-0 space-y-6">
                <Stats />
              </Box>
              <Box className="lg:max-w-4xl md:max-w-3xl sm:max-w-2xl max-w-md mx-auto px-4 lg:px-0 space-y-6">
                {tvChart}
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
            <span className="text-sm text-silver hidden md:block">
              Contract Address:
            </span>
            <span className="text-sm bg-gradient-to-r from-wave-blue to-primary text-transparent bg-clip-text">
              <a
                href={`${CHAINS[chainId]?.explorer}/address/${
                  staticZdteData?.zdteAddress ?? ''
                }`}
                rel="noopener noreferrer"
                target={'_blank'}
              >
                {staticZdteData?.zdteAddress}
              </a>
            </span>
          </Box>
        </>
      ) : (
        <Loading />
      )}
    </Box>
  );
};

export async function getServerSideProps(context: { query: { zdte: string } }) {
  return {
    props: {
      zdte: context.query.zdte,
    },
  };
}

const ManagePage = ({ zdte }: Props) => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <Zdte zdte={zdte} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default ManagePage;
