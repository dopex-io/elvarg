import { useContext, useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Head from 'next/head';
import cx from 'classnames';
import Box from '@mui/material/Box';

import AppBar from 'components/AppBar';
import Description from './components/Description';
import ManageCard from './components/ManageCard';
import Sidebar from './components/Sidebar';
import SelectStrikeWidget from './components/SelectStrikeWidget';
import Deposits from './components/Deposits';
import Positions from './components/Positions';
import PurchaseCard from './components/PurchaseCard';
import PurchaseOptions from './components/PurchaseOptions';
import Stats from './components/Stats';
import WithdrawalInfo from './components/WithdrawalInfo';
import AutoExerciseInfo from './components/AutoExerciseInfo';
import PageLoader from 'components/PageLoader';

import { WalletContext } from 'contexts/Wallet';
import { RateVaultProvider, RateVaultContext } from 'contexts/RateVault';

const Manage = () => {
  const { accountAddress } = useContext(WalletContext);
  const { asset } = useParams();
  const rateVaultContext = useContext(RateVaultContext);
  const [activeVaultContextSide, setActiveVaultContextSide] =
    useState<string>('CALL');
  const [activeView, setActiveView] = useState<string>('vault');
  const [strikeIndex, setStrikeIndex] = useState<number | null>(null);
  const showWithdrawalInformation: boolean = true;

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
      <AppBar active="vaults" />
      {rateVaultContext.rateVaultEpochData?.epochStartTimes &&
      accountAddress ? (
        <Box
          className="py-12 lg:max-w-full md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0"
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gap={0}
        >
          <Box gridColumn="span 3" className="ml-10 mt-20">
            <Sidebar activeView={activeView} setActiveView={setActiveView} />
          </Box>

          {activeView === 'vault' ? (
            <Box gridColumn="span 6" className="mt-20 mb-20 pl-5 pr-5">
              <Box className="flex md:flex-row flex-col mb-4 md:justify-between items-center md:items-start">
                <Description
                  activeVaultContextSide={activeVaultContextSide}
                  setActiveVaultContextSide={setActiveVaultContextSide}
                />
              </Box>

              <Box className="mb-10">
                <Stats activeVaultContextSide={activeVaultContextSide} />
              </Box>

              <Deposits
                activeVaultContextSide={activeVaultContextSide}
                setActiveVaultContextSide={setActiveVaultContextSide}
              />

              {showWithdrawalInformation ? (
                <Box className={'mt-12'}>
                  <WithdrawalInfo />
                </Box>
              ) : null}
            </Box>
          ) : (
            <Box gridColumn="span 6" className="mt-20 mb-20 pl-5 pr-5">
              <Box className="flex md:flex-row flex-col mb-4 md:justify-between items-center md:items-start">
                <Description
                  activeVaultContextSide={activeVaultContextSide}
                  setActiveVaultContextSide={setActiveVaultContextSide}
                />
              </Box>

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

          <Box gridColumn="span 3" className="mt-20 flex">
            <Box className={'absolute right-[2.5rem]'}>
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
      ) : null}
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
