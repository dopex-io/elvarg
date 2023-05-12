import Head from 'next/head';
import { useRouter } from 'next/router';

import React, { useCallback, useEffect, useMemo } from 'react';

import { useBoundStore } from 'store';

import AppBar from 'components/common/AppBar';
import ErrorBoundary from 'components/error/ErrorBoundary';
import { OptionsTable } from 'components/zdte';
import Loading from 'components/zdte/Loading';
import ManageCard from 'components/zdte/Manage';
import Positions from 'components/zdte/Positions';
import TopBar from 'components/zdte/TopBar';
import ZdteContractBox from 'components/zdte/ZdteContractBox';
import ZdteDexScreenerChart from 'components/zdte/ZdteDexScreenerChart';

interface Props {
  zdte: string;
}

const Zdte = ({ zdte }: Props) => {
  const {
    provider,
    setSelectedPoolName,
    selectedPoolName,
    updateZdteData,
    updateStaticZdteData,
    updateUserZdteLpData,
    updateUserZdtePurchaseData,
    updateVolumeFromSubgraph,
    staticZdteData,
    getUserPurchaseData,
    loadingAsset,
  } = useBoundStore();

  useEffect(() => {
    if (zdte && setSelectedPoolName) setSelectedPoolName(zdte);
  }, [zdte, setSelectedPoolName]);

  const updateAll = useCallback(async () => {
    if (!provider || !selectedPoolName) return;
    updateZdteData().then(() => {
      updateStaticZdteData().then(() => {
        getUserPurchaseData().then(() => {
          Promise.all([
            updateUserZdteLpData(),
            updateUserZdtePurchaseData(),
            updateVolumeFromSubgraph(),
          ]);
        });
      });
    });
  }, [
    provider,
    selectedPoolName,
    updateZdteData,
    updateUserZdteLpData,
    getUserPurchaseData,
    updateStaticZdteData,
    updateUserZdtePurchaseData,
    updateVolumeFromSubgraph,
  ]);

  useEffect(() => {
    updateAll();
  }, [updateAll]);

  useEffect(() => {
    const interval = setInterval(() => {
      updateAll();
    }, 60000);
    return () => clearInterval(interval);
  }, [updateAll]);

  const chart = useMemo(() => {
    if (loadingAsset || !staticZdteData || !selectedPoolName) {
      return <Loading />;
    }
    return <ZdteDexScreenerChart poolName={selectedPoolName} />;
  }, [staticZdteData, selectedPoolName, loadingAsset]);

  return (
    <div className="bg-black min-h-screen">
      <Head>
        <title>ZDTE | Dopex</title>
      </Head>
      <AppBar active="ZDTE" />
      <div className="md:flex py-5 justify-center">
        <div className="ml-auto space-y-8">
          <div className="lg:pt-28 sm:pt-20 pt-20 lg:max-w-4xl md:max-w-3xl sm:max-w-2xl max-w-md mx-auto px-4 lg:px-0 space-y-6">
            <TopBar />
          </div>
          <div className="lg:max-w-4xl md:max-w-3xl sm:max-w-2xl max-w-md mx-auto px-4 lg:px-0 space-y-6">
            {chart}
          </div>
          <div className="mb-5 lg:max-w-4xl md:max-w-3xl md:m-0 sm:max-w-3xl max-w-md lg:mx-auto px-2 lg:px-0 flex-auto mx-auto">
            <OptionsTable />
          </div>
          <div className="mb-5 lg:max-w-4xl md:max-w-3xl md:m-0 sm:max-w-3xl max-w-md lg:mx-auto px-2 lg:px-0 flex-auto mx-auto">
            <Positions />
          </div>
        </div>
        <div className="flex justify-around mb-8 px-3 mt-8 md:ml-10 md:justify-start md:mt-24 md:sticky md:top-24 md:h-fit lg:mr-auto lg:px-0">
          <ManageCard />
        </div>
      </div>
      <div className="flex justify-center space-x-2 my-8">
        <ZdteContractBox />
      </div>
    </div>
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
