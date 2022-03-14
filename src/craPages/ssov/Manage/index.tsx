import { useContext, useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Head from 'next/head';
import Box from '@mui/material/Box';

import AppBar from 'components/AppBar';
import Description from '../components/Description';
import ManageCard from '../components/ManageCard';
import Sidebar from '../components/Sidebar';
import Deposits from '../components/Deposits';
import Stats from '../components/Stats';
import Withdrawals from '../components/Withdrawals';
import PageLoader from 'components/PageLoader';

import { SsovContext, SsovProvider } from 'contexts/Ssov';

const Manage = () => {
  const { asset } = useParams();
  const ssovContext = useContext(SsovContext);
  const [activeSsovContextSide, setActiveSsovContextSide] =
    useState<string>('LOADING');
  const [activeView, setActiveView] = useState<string>('Vault');
  const showWithdrawalInformation: boolean = false;

  const enabledTypes: string[] = useMemo(() => {
    const types: string[] = [];
    if (ssovContext.CALL?.ssovData) types.push('CALL');
    if (ssovContext.PUT?.ssovData) types.push('PUT');
    return types;
  }, [ssovContext]);

  useEffect(() => {
    ssovContext.CALL?.setSelectedSsov({ token: asset });
    ssovContext.PUT?.setSelectedSsov({ token: asset });
  }, [asset]);

  useEffect(() => {
    if (enabledTypes.includes('CALL')) setActiveSsovContextSide('CALL');
    else if (enabledTypes.includes('PUT')) setActiveSsovContextSide('PUT');
  }, [enabledTypes]);

  if (
    ssovContext.PUT?.ssovEpochData === undefined &&
    ssovContext.CALL?.ssovEpochData === undefined
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
      {activeSsovContextSide !== 'LOADING' ? (
        <Box className="py-12 lg:max-w-full md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0 flex">
          <Box className="w-[22%] ml-10 mt-20">
            <Sidebar
              asset={asset}
              activeSsovContextSide={activeSsovContextSide}
              activeView={activeView}
              setActiveView={setActiveView}
            />
          </Box>
          {activeView === 'Vaults' ? (
            <Box className="mt-20 mb-20 w-[54%] pl-5 pr-5">
              <Box className="flex md:flex-row flex-col mb-4 md:justify-between items-center md:items-start">
                <Description
                  activeSsovContextSide={activeSsovContextSide}
                  setActiveSsovContextSide={setActiveSsovContextSide}
                />
              </Box>

              <Box className="mb-10">
                <Stats activeSsovContextSide={activeSsovContextSide} />
              </Box>

              <Deposits
                activeSsovContextSide={activeSsovContextSide}
                setActiveSsovContextSide={setActiveSsovContextSide}
              />

              {showWithdrawalInformation ? (
                <Box className={'mt-12'}>
                  <Withdrawals
                    activeSsovContextSide={activeSsovContextSide}
                    setActiveSsovContextSide={setActiveSsovContextSide}
                  />
                </Box>
              ) : null}
            </Box>
          ) : (
            <Box className="mt-20 mb-20 w-[54%] pl-5 pr-5">
              <Box className="flex md:flex-row flex-col mb-4 md:justify-between items-center md:items-start">
                <Description
                  activeSsovContextSide={activeSsovContextSide}
                  setActiveSsovContextSide={setActiveSsovContextSide}
                />
              </Box>

              <Box className="mb-10">
                <Stats activeSsovContextSide={activeSsovContextSide} />
              </Box>

              <Deposits
                activeSsovContextSide={activeSsovContextSide}
                setActiveSsovContextSide={setActiveSsovContextSide}
              />

              {showWithdrawalInformation ? (
                <Box className={'mt-12'}>
                  <Withdrawals
                    activeSsovContextSide={activeSsovContextSide}
                    setActiveSsovContextSide={setActiveSsovContextSide}
                  />
                </Box>
              ) : null}
            </Box>
          )}

          <Box className="flex w-[24%] mr-auto">
            <Box className="flex md:flex-row flex-col mb-4 md:justify-between items-center md:items-start ml-auto top-[9rem] right-[3rem] absolute">
              <ManageCard
                activeSsovContextSide={activeSsovContextSide}
                setActiveSsovContextSide={setActiveSsovContextSide}
                enabledTypes={enabledTypes}
              />
            </Box>
          </Box>
        </Box>
      ) : null}
    </Box>
  );
};

const ManagePage = () => {
  return (
    <SsovProvider>
      <Manage />
    </SsovProvider>
  );
};

export default ManagePage;
