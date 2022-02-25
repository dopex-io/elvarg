import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Head from 'next/head';
import Box from '@material-ui/core/Box';

import AppBar from 'components/AppBar';
import Description from '../components/Description';
import ManageCard from '../components/ManageCard';
import Sidebar from '../components/Sidebar';
import Deposits from '../components/Deposits';
import Withdrawals from '../components/Withdrawals';
import PageLoader from 'components/PageLoader';

import { SsovContext, SsovProvider } from 'contexts/Ssov';

const Manage = () => {
  const { asset, type } = useParams();
  const {
    ssovData,
    ssovEpochData,
    ssovUserData,
    setSelectedSsov,
    selectedSsov,
  } = useContext(SsovContext);

  useEffect(() => {
    setSelectedSsov({ token: asset, type: type.toUpperCase() });
  }, [setSelectedSsov, asset, type]);

  if (ssovData === undefined || ssovEpochData === undefined)
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
              ssovData={ssovData}
              ssovEpochData={ssovEpochData}
              ssovUserData={ssovUserData}
              type={selectedSsov.type}
            />
          </Box>
          <Deposits />
          <Box className={'mt-12'}>
            <Withdrawals
              ssovData={ssovData}
              ssovEpochData={ssovEpochData}
              ssovUserData={ssovUserData}
              type={selectedSsov.type}
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
