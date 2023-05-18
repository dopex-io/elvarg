import { useCallback, useEffect, useMemo } from 'react';

import { useRouter } from 'next/router';

import { NextSeo } from 'next-seo';
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

import seo from 'constants/seo';

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
    updateUserZdteOpenPositions,
    updateVolumeFromSubgraph,
    staticZdteData,
    updateUserZdteSpreadPositions,
    isLoading,
  } = useBoundStore();

  useEffect(() => {
    if (zdte && setSelectedPoolName) setSelectedPoolName(zdte);
  }, [zdte, setSelectedPoolName]);

  const updateAll = useCallback(async () => {
    if (!provider || !selectedPoolName) return;
    updateZdteData().then(() => {
      updateStaticZdteData().then(() => {
        updateUserZdteSpreadPositions().then(() => {
          Promise.all([
            updateUserZdteLpData(),
            updateUserZdteOpenPositions(),
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
    updateUserZdteSpreadPositions,
    updateStaticZdteData,
    updateUserZdteOpenPositions,
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
    if (isLoading || !staticZdteData || !selectedPoolName) {
      return <Loading />;
    }
    return <ZdteDexScreenerChart poolName={selectedPoolName} />;
  }, [staticZdteData, selectedPoolName, isLoading]);

  return (
    <div className="bg-black min-h-screen">
      <NextSeo
        title={`${zdte} 0dte | Dopex Zero Day-to-Expiry options`}
        description="Options that expire on day of purchase"
        canonical={`https://dopex.io/zdte/${zdte}`}
        openGraph={{
          url: `https://dopex.io/zdte/${zdte}`,
          title: `${zdte} 0dte | Dopex Zero Day-to-Expiry options`,
          description: 'Options that expire on day of purchase',
          images: [
            {
              url: seo.zdte,
              width: 800,
              height: 500,
              alt: 'ZDTE',
              type: 'image/png',
            },
          ],
        }}
      />
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
