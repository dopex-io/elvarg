import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Box from '@mui/material/Box';

import AppBar from 'components/AppBar';
import Description from 'components/Ssov/V2/Description';
import ManageCard from 'components/Ssov/V2/ManageCard';
import ExerciseList from 'components/Ssov/V2/ExerciseList';
import Stats from 'components/Ssov/V2/Stats';
import PageLoader from 'components/PageLoader';
import EmergencyNoticeBanner from 'components/Banners/EmergencyNoticeBanner';

import { SsovContext, SsovProvider } from 'contexts/Ssov';

const Manage = () => {
  const {
    ssovData,
    ssovEpochData,
    ssovUserData,
    setSelectedSsov,
    selectedSsov,
  } = useContext(SsovContext);

  const router = useRouter();
  const { name, type } = router.query;

  useEffect(() => {
    if (typeof name !== 'undefined' || typeof type !== 'undefined') {
      setSelectedSsov({ token: name, type: type?.toString().toUpperCase() });
    }
  }, [setSelectedSsov, name, type]);

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
      <Box className="py-12 lg:max-w-5xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0">
        <Box className="flex flex-col mt-20">
          <Box className="flex md:flex-row flex-col mb-4 md:justify-between items-center md:items-start">
            <Description
              ssovData={ssovData}
              ssovEpochData={ssovEpochData}
              ssovUserData={ssovUserData}
              type={selectedSsov.type}
            />
            <ManageCard />
          </Box>
          {ssovUserData === undefined ? null : <ExerciseList />}
          {selectedSsov.type === 'PUT' ? null : <Stats className="mt-4" />}
        </Box>
      </Box>
    </Box>
  );
};

export default Manage;
