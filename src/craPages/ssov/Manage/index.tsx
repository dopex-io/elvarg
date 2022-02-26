import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Head from 'next/head';
import Box from '@material-ui/core/Box';

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
  const putContext = useContext(SsovContext);
  const callContext = useContext(SsovContext);
  const [activeType, setActiveType] = useState<string>('CALL');

  useEffect(() => {
    putContext.setSelectedSsov({ token: asset, type: 'PUT' });
    callContext.setSelectedSsov({ token: asset, type: 'CALL' });
  }, [asset]);

  if (
    putContext.ssovData === undefined ||
    putContext.ssovEpochData === undefined ||
    callContext.ssovData === undefined ||
    callContext.ssovEpochData === undefined
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
      <Box className="py-12 lg:max-w-full md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0 flex">
        <Box className="w-[20%] ml-10 mt-20">
          <Sidebar />
        </Box>
        <Box className="mt-20 w-[56%] pl-5 pr-5">
          <Box className="flex md:flex-row flex-col mb-4 md:justify-between items-center md:items-start">
            <Description
              ssovData={
                activeType === 'CALL'
                  ? callContext.ssovData
                  : putContext.ssovData
              }
              ssovEpochData={
                activeType === 'CALL'
                  ? callContext.ssovEpochData
                  : putContext.ssovEpochData
              }
              ssovUserData={
                activeType === 'CALL'
                  ? callContext.ssovUserData
                  : putContext.ssovUserData
              }
              type={activeType}
            />
          </Box>

          <Box className="mb-10">
            <Stats
              ssovData={
                activeType === 'CALL'
                  ? callContext.ssovData
                  : putContext.ssovData
              }
              selectedEpoch={
                activeType === 'CALL'
                  ? callContext.selectedEpoch
                  : putContext.selectedEpoch
              }
              ssovEpochData={
                activeType === 'CALL'
                  ? callContext.ssovEpochData
                  : putContext.ssovEpochData
              }
              type={activeType}
            />
          </Box>

          <Deposits
            ssovData={
              activeType === 'CALL' ? callContext.ssovData : putContext.ssovData
            }
            selectedEpoch={
              activeType === 'CALL'
                ? callContext.selectedEpoch
                : putContext.selectedEpoch
            }
            ssovEpochData={
              activeType === 'CALL'
                ? callContext.ssovEpochData
                : putContext.ssovEpochData
            }
            type={activeType}
          />

          <Box className={'mt-12'}>
            <Withdrawals
              ssovData={
                activeType === 'CALL'
                  ? callContext.ssovData
                  : putContext.ssovData
              }
              ssovEpochData={
                activeType === 'CALL'
                  ? callContext.ssovEpochData
                  : putContext.ssovEpochData
              }
              ssovUserData={
                activeType === 'CALL'
                  ? callContext.ssovUserData
                  : putContext.ssovUserData
              }
              type={activeType}
            />
          </Box>
        </Box>
        <Box className="flex w-[24%] mr-auto">
          <Box className="flex md:flex-row flex-col mb-4 md:justify-between items-center md:items-start ml-auto top-[6rem] right-[2.5rem] absolute">
            <ManageCard />
          </Box>
        </Box>
      </Box>
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
