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
  const ssovContext = useContext(RateVaultContext);
  const [activeVaultContextSide, setActiveVaultContextSide] =
    useState<string>('CALL');
  const [activeView, setActiveView] = useState<string>('vault');
  const showWithdrawalInformation: boolean = false;
  const [strikeIndex, setStrikeIndex] = useState<number | null>(null);
  const enabledSides: string[] = ['CALL', 'PUT'];

  return (
    <Box className="overflow-x-hidden bg-black h-screen">
      <Head>
        <title>Rates Vault | Dopex</title>
      </Head>
      <AppBar active="vaults" />
      {ssovContext[activeVaultContextSide].rateVaultData?.currentEpoch &&
      accountAddress ? (
        <Box
          className="py-12 lg:max-w-full md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0"
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gap={0}
        >
          <Box gridColumn="span 3" className="ml-10 mt-20">
            <Sidebar
              asset={asset}
              activeVaultContextSide={activeVaultContextSide}
              activeView={activeView}
              setActiveView={setActiveView}
            />
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
