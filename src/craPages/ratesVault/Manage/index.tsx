import { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Head from 'next/head';
import Box from '@mui/material/Box';

import AppBar from 'components/AppBar';
import Description from './../components/Description';
import ManageCard from './../components/ManageCard';
import MobileMenu from './../components/MobileMenu';
import Sidebar from './../components/Sidebar';
import SelectStrikeWidget from './../components/SelectStrikeWidget';
import Deposits from './../components/Deposits';
import Positions from './../components/Positions';
import PurchaseCard from './../components/PurchaseCard';
import PurchaseOptions from './../components/PurchaseOptions';
import Stats from './../components/Stats';
import WithdrawalInfo from './../components/WithdrawalInfo';
import AutoExerciseInfo from './../components/AutoExerciseInfo';
import PageLoader from 'components/PageLoader';

import { WalletContext } from 'contexts/Wallet';
import { RateVaultProvider, RateVaultContext } from 'contexts/RateVault';

const Manage = () => {
  const { accountAddress } = useContext(WalletContext);
  const { poolName } = useParams();
  const rateVaultContext = useContext(RateVaultContext);
  const { setSelectedPoolName } = rateVaultContext;
  const [activeVaultContextSide, setActiveVaultContextSide] =
    useState<string>('CALL');
  const [activeView, setActiveView] = useState<string>('vault');
  const [strikeIndex, setStrikeIndex] = useState<number | null>(null);
  const showWithdrawalInformation: boolean = true;

  useEffect(() => {
    setSelectedPoolName(poolName);
  }, [rateVaultContext, poolName]);

  if (!rateVaultContext.rateVaultEpochData?.epochStartTimes)
    return (
      <Box className="overflow-x-hidden bg-black h-screen">
        <PageLoader />
      </Box>
    );

  return (
    <Box className="overflow-x-hidden bg-black h-screen">
      <Head>
        <title>Rate Vault | Dopex</title>
      </Head>
      <AppBar active="rate vaults" />

      <Box className="py-12 lg:max-w-full md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0 lg:grid lg:grid-cols-12">
        <Box className="ml-10 mt-20 hidden lg:block lg:col-span-3">
          <Sidebar activeView={activeView} setActiveView={setActiveView} />
        </Box>

        <Box
          gridColumn="span 6"
          className="mt-10 lg:mt-20 lg:mb-20 lg:pl-5 lg:pr-5"
        >
          <Box className="flex md:flex-row flex-col mb-4 md:justify-between items-center md:items-start">
            <Description
              activeVaultContextSide={activeVaultContextSide}
              setActiveVaultContextSide={setActiveVaultContextSide}
            />
          </Box>

          <Box className="lg:hidden">
            <MobileMenu
              asset={poolName}
              activeView={activeView}
              setActiveView={setActiveView}
            />
          </Box>

          <Box className="mb-10">
            <Stats activeVaultContextSide={activeVaultContextSide} />
          </Box>

          {activeView === 'vault' ? (
            <Box>
              <Deposits />

              {showWithdrawalInformation ? (
                <Box className={'mt-12'}>
                  <WithdrawalInfo />
                </Box>
              ) : null}
            </Box>
          ) : (
            <Box>
              <PurchaseOptions
                activeVaultContextSide={activeVaultContextSide}
                setActiveVaultContextSide={setActiveVaultContextSide}
                setStrikeIndex={setStrikeIndex}
              />

              <Box className={'mt-12'}>
                <Positions />
              </Box>

              <Box className={'mt-12'}>
                <AutoExerciseInfo />
              </Box>
            </Box>
          )}
        </Box>

        <Box className="mt-6 lg:mt-20 flex lg:col-span-3">
          <Box className={'lg:absolute lg:right-[2.5rem] w-full lg:w-auto'}>
            {activeView === 'vault' ? (
              <ManageCard
                activeVaultContextSide={activeVaultContextSide}
                setActiveVaultContextSide={setActiveVaultContextSide}
              />
            ) : activeView === 'positions' ? (
              strikeIndex !== null ? (
                <PurchaseCard
                  activeVaultContextSide={activeVaultContextSide}
                  strikeIndex={strikeIndex}
                  setStrikeIndex={setStrikeIndex}
                />
              ) : (
                <SelectStrikeWidget />
              )
            ) : null}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const ManagePage = () => {
  return (
    <RateVaultProvider>
      <Manage />
    </RateVaultProvider>
  );
};

export default ManagePage;
