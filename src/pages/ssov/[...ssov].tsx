import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Box from '@mui/material/Box';

import AppBar from 'components/AppBar';
import Description from 'components/ssov/Description';
import ManageCard from 'components/ssov/ManageCard';
import ExerciseList from 'components/ssov/ExerciseList';
import Stats from 'components/ssov/Stats';
import PageLoader from 'components/PageLoader';
import EmergencyNoticeBanner from 'components/Banners/EmergencyNoticeBanner';

import { SsovContext, SsovProvider } from 'contexts/Ssov';

const Manage = ({ type, name }) => {
  const {
    ssovData,
    ssovEpochData,
    ssovUserData,
    setSelectedSsov,
    selectedSsov,
  } = useContext(SsovContext);

  useEffect(() => {
    setSelectedSsov({ token: name, type: type.toUpperCase() });
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

const ManagePage = ({ type, name }) => {
  return (
    <SsovProvider>
      <Manage type={type} name={name} />
    </SsovProvider>
  );
};

export async function getServerSideProps(context) {
  return {
    props: {
      type: context.query.ssov[0],
      name: context.query.ssov[1],
    },
  };
}

export default ManagePage;
