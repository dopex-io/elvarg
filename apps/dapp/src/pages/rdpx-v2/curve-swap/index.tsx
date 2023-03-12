import { useEffect } from 'react';
import Head from 'next/head';
import CircularProgress from '@mui/material/CircularProgress';

import AppBar from 'components/common/AppBar';
import CurveSwap from 'components/rdpx-v2/CurveSwap';

import { useBoundStore } from 'store';

const Swap = () => {
  const {
    provider,
    isLoading,
    setIsLoading,
    updateTreasuryContractState,
    updateUserDscBondsData,
    updateTreasuryData,
  } = useBoundStore();

  useEffect(() => {
    if (!provider) return;

    setIsLoading(true);
    updateTreasuryContractState().then(() => {
      updateTreasuryData().then(() => {
        updateUserDscBondsData();
        setIsLoading(false);
      });
    });
  }, [
    provider,
    updateTreasuryContractState,
    updateTreasuryData,
    updateUserDscBondsData,
    setIsLoading,
  ]);

  return (
    <div className="bg-contain min-h-screen bg-gradient-to-b from-[#062125] to-[#000000]">
      <Head>
        <title>Swap | Dopex</title>
      </Head>
      <AppBar active="Swap" />
      <div className="pt-1 pb-32 lg:max-w-7xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0 min-h-screen">
        {isLoading ? (
          <div className="flex w-full justify-center py-12 mt-48">
            <CircularProgress size={48} />
          </div>
        ) : (
          <CurveSwap />
        )}
      </div>
    </div>
  );
};

export default Swap;
