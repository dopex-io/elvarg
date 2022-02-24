import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Head from 'next/head';
import Box from '@material-ui/core/Box';

import AppBar from 'components/AppBar';
import Description from '../components/Description';
import ManageCard from '../components/ManageCard';
import ExerciseList from '../components/ExerciseList';
import Sidebar from '../components/Sidebar';
import Stats from '../components/Stats';
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
        <Box className="w-[22%] ml-10 mt-20">
          <Sidebar />
        </Box>
        <Box className="flex flex-col mt-20 w-[51%]">
          <Box className="flex md:flex-row flex-col mb-4 md:justify-between items-center md:items-start">
            <Description
              ssovData={ssovData}
              ssovEpochData={ssovEpochData}
              ssovUserData={ssovUserData}
              type={selectedSsov.type}
            />
          </Box>
          {ssovUserData === undefined ? null : <ExerciseList />}
          {selectedSsov.type === 'PUT' ? null : <Stats className="mt-4" />}
        </Box>
        <Box className="flex w-[21%] mr-auto">
          <Box className="flex md:flex-row flex-col mb-4 md:justify-between items-center md:items-start ml-auto top-[6rem] right-[3.5rem] absolute">
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
