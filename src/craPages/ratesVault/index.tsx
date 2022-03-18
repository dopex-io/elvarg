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
import { SsovContext, SsovProvider } from 'contexts/Ssov';

const Manage = () => {
  const { accountAddress } = useContext(WalletContext);
  const { asset } = useParams();
  const [activeContextSide, setActiveContextSide] = useState<string>('LOADING');
  const [activeView, setActiveView] = useState<string>('vault');
  const showWithdrawalInformation: boolean = false;
  const [strikeIndex, setStrikeIndex] = useState<number | null>(null);

  const enabledSides: string[] = ['CALL'];

  useEffect(() => {
    if (enabledSides.includes('CALL')) setActiveContextSide('CALL');
    else if (enabledSides.includes('PUT')) setActiveContextSide('PUT');
  }, [enabledSides]);

  return (
    <Box className="overflow-x-hidden bg-black h-screen">
      <Head>
        <title>Rates Vault | Dopex</title>
      </Head>
      <AppBar active="vaults" />
      {activeContextSide !== 'LOADING' && accountAddress ? (
        <Box
          className="py-12 lg:max-w-full md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0"
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gap={0}
        >
          <Box gridColumn="span 3" className="ml-10 mt-20">
            <Sidebar
              asset={asset}
              activeContextSide={activeContextSide}
              activeView={activeView}
              setActiveView={setActiveView}
            />
          </Box>

          {activeView === 'vault' ? (
            <Box gridColumn="span 6" className="mt-20 mb-20 pl-5 pr-5">
              <Box className="flex md:flex-row flex-col mb-4 md:justify-between items-center md:items-start">
                <Description
                  activeContextSide={activeContextSide}
                  setActiveContextSide={setActiveContextSide}
                />
              </Box>

              <Box className="mb-10">
                <Stats activeContextSide={activeContextSide} />
              </Box>

              <Deposits
                activeContextSide={activeContextSide}
                setActiveContextSide={setActiveContextSide}
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
                  activeContextSide={activeContextSide}
                  setActiveContextSide={setActiveContextSide}
                />
              </Box>

              <PurchaseOptions
                activeContextSide={activeContextSide}
                setActiveContextSide={setActiveContextSide}
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

          <Box gridColumn="span 3" className="flex ml-auto">
            <Box
              className={cx(
                'flex md:flex-row flex-col mb-4 md:justify-between items-center md:items-start ml-auto mt-24',
                strikeIndex ? 'mr-7' : 'mr-10'
              )}
            >
              {activeView === 'vault' ? (
                <ManageCard
                  activeContextSide={activeContextSide}
                  setActiveContextSide={setActiveContextSide}
                  enabledSides={enabledSides}
                />
              ) : activeView === 'positions' ? (
                strikeIndex !== null ? (
                  <PurchaseCard
                    activeContextSide={activeContextSide}
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
  return <Manage />;
};

export default ManagePage;
