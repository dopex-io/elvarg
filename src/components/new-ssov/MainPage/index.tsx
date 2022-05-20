import { useContext, useEffect, useState, useMemo } from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';
import { useRouter } from 'next/router';

import AppBar from 'components/common/AppBar';
import Description from 'components/new-ssov/Description';
import ManageCard from 'components/new-ssov/ManageCard';
import Sidebar from 'components/new-ssov/Sidebar';
import MobileMenu from 'components/new-ssov/MobileMenu';
import SelectStrikeWidget from 'components/new-ssov/SelectStrikeWidget';
import Deposits from 'components/new-ssov/Deposits';
import Positions from 'components/new-ssov/Positions';
import PurchaseCard from 'components/new-ssov/PurchaseCard';
import PurchaseOptions from 'components/new-ssov/PurchaseOptions';
import Stats from 'components/new-ssov/Stats';
import WithdrawalInfo from 'components/new-ssov/WithdrawalInfo';
import AutoExerciseInfo from 'components/new-ssov/AutoExerciseInfo';
import PageLoader from 'components/common/PageLoader';
import EmergencyNoticeBanner from 'components/common/Banners/EmergencyNoticeBanner';

import { WalletContext } from 'contexts/Wallet';
import { SsovContext, SsovProvider } from 'contexts/NewSsov';

const Manage = () => {
  const { accountAddress } = useContext(WalletContext);
  const router = useRouter();
  // @ts-ignore TODO: FIX
  const asset = router.query.name as string;
  const ssovContext = useContext(SsovContext);
  const [activeSsovContextSide, setActiveSsovContextSide] =
    useState<string>('LOADING');
  const [activeView, setActiveView] = useState<string>('vault');
  const showWithdrawalInformation: boolean = false;
  const [strikeIndex, setStrikeIndex] = useState<number | null>(null);

  const enabledSides: string[] = useMemo(() => {
    const types: string[] = [];
    if (ssovContext.CALL?.ssovData) types.push('CALL');
    if (ssovContext.PUT?.ssovData) types.push('PUT');
    return types;
  }, [ssovContext]);

  useEffect(() => {
    // @ts-ignore TODO: FIX
    ssovContext.CALL?.setSelectedSsov({ token: asset });
    // @ts-ignore TODO: FIX
    ssovContext.PUT?.setSelectedSsov({ token: asset });
  }, [asset, ssovContext]);

  useEffect(() => {
    if (enabledSides.includes('CALL')) setActiveSsovContextSide('CALL');
    else if (enabledSides.includes('PUT')) setActiveSsovContextSide('PUT');
  }, [enabledSides]);

  useEffect(() => {
    if (
      !accountAddress &&
      (ssovContext.PUT?.ssovEpochData || ssovContext.CALL?.ssovEpochData)
    )
      window.location.replace('/');
  }, [accountAddress, ssovContext]);

  if (
    (ssovContext.PUT?.ssovEpochData === undefined &&
      ssovContext.CALL?.ssovEpochData === undefined) ||
    ssovContext.CALL?.ssovUserData === undefined
  )
    return (
      <Box className="overflow-x-hidden bg-black h-screen">
        <PageLoader />
      </Box>
    );

  return (
    <Box className="overflow-x-hidden bg-black h-screen">
      <Head>
        <title>SSOV | Dopex</title>
      </Head>
      <AppBar active="SSOV" />
      {activeSsovContextSide !== 'LOADING' && accountAddress ? (
        <Box
          className="py-12 lg:max-w-full md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0 lg:grid lg:grid-cols-12"
          gap={0}
        >
          <Box className="ml-10 mt-20 hidden lg:block lg:col-span-3">
            <Sidebar
              asset={asset}
              activeSsovContextSide={activeSsovContextSide}
              activeView={activeView}
              setActiveView={setActiveView}
            />
          </Box>

          <Box gridColumn="span 6" className="mt-10 lg:mb-20 lg:pl-5 lg:pr-5">
            <Box className="flex md:flex-row flex-col mb-4 md:justify-between items-center md:items-start">
              <Description
                activeSsovContextSide={activeSsovContextSide}
                setActiveSsovContextSide={setActiveSsovContextSide}
              />
            </Box>

            <Box className="lg:hidden">
              <MobileMenu
                asset={asset}
                activeSsovContextSide={activeSsovContextSide}
                activeView={activeView}
                setActiveView={setActiveView}
              />
            </Box>

            <Box className="mb-10">
              <Stats activeSsovContextSide={activeSsovContextSide} />
            </Box>

            {activeView === 'vault' ? (
              <Box>
                <Deposits
                  activeSsovContextSide={activeSsovContextSide}
                  setActiveSsovContextSide={setActiveSsovContextSide}
                  enabledSides={enabledSides}
                />

                {showWithdrawalInformation ? (
                  <Box className={'mt-12'}>
                    <WithdrawalInfo />
                  </Box>
                ) : null}
              </Box>
            ) : (
              <Box>
                <PurchaseOptions
                  activeSsovContextSide={activeSsovContextSide}
                  setActiveSsovContextSide={setActiveSsovContextSide}
                  // @ts-ignore TODO: FIX
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
                  activeSsovContextSide={activeSsovContextSide}
                  setActiveSsovContextSide={setActiveSsovContextSide}
                  enabledSides={enabledSides}
                />
              ) : activeView === 'positions' ? (
                strikeIndex !== null ? (
                  <PurchaseCard
                    activeSsovContextSide={activeSsovContextSide}
                    strikeIndex={strikeIndex}
                    setStrikeIndex={setStrikeIndex}
                  />
                ) : (
                  <Box className={'hidden lg:block'}>
                    <SelectStrikeWidget />
                  </Box>
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
  const router = useRouter();
  // @ts-ignore TODO: FIX
  const asset = router.query.name as string;
  return (
    <SsovProvider>
      {asset === 'METIS' && (
        <EmergencyNoticeBanner
          paragraph={
            'All METIS deposits have been safely withdrawn and will be dispersed to the depositors soon.'
          }
          title={'Emergency Withdrawal Notice'}
        />
      )}

      <Manage />
    </SsovProvider>
  );
};

export default ManagePage;
