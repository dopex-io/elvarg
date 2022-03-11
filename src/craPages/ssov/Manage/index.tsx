import { useContext, useEffect, useState } from 'react';
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
  const [activeType, setActiveType] = useState<string>('CALL');

  useEffect(() => {
    ssovContext.CALL.setSelectedSsov({ token: asset });
    ssovContext.PUT.setSelectedSsov({ token: asset });
  }, [asset]);

  if (
    ssovContext.CALL.ssovData === undefined ||
    ssovContext.CALL.ssovEpochData === undefined ||
    ssovContext.PUT.ssovData === undefined ||
    ssovContext.PUT.ssovEpochData === undefined
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
        <Box className="w-[22%] ml-10 mt-20">
          <Sidebar asset={asset} />
        </Box>
        <Box className="mt-20 w-[54%] pl-5 pr-5">
          <Box className="flex md:flex-row flex-col mb-4 md:justify-between items-center md:items-start">
            <Description
              activeType={activeType}
              setActiveType={setActiveType}
            />
          </Box>

          <Box className="mb-10">
            <Stats activeType={activeType} setActiveType={setActiveType} />
          </Box>

          <Deposits activeType={activeType} setActiveType={setActiveType} />

          <Box className={'mt-12'}>
            <Withdrawals
              activeType={activeType}
              setActiveType={setActiveType}
            />
          </Box>
        </Box>
        <Box className="flex w-[24%] mr-auto">
          <Box className="flex md:flex-row flex-col mb-4 md:justify-between items-center md:items-start ml-auto top-[6rem] right-[2.5rem] absolute">
            <ManageCard activeType={activeType} setActiveType={setActiveType} />
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
