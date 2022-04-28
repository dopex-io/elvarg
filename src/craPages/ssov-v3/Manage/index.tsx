import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Head from 'next/head';
import Box from '@mui/material/Box';

import AppBar from 'components/AppBar';
import Description from '../components/Description';
import ManageCard from '../components/ManageCard';
import ExerciseList from '../components/ExerciseList';
import Stats from '../components/Stats';
import PageLoader from 'components/PageLoader';

import { SsovV3Context, SsovV3Provider } from 'contexts/SsovV3';
import WritePositions from '../components/WritePositions';

const Manage = ({ ssov }: { ssov: string }) => {
  const { ssovData, ssovEpochData, ssovUserData, setSelectedSsovV3 } =
    useContext(SsovV3Context);

  useEffect(() => {
    setSelectedSsovV3({ ssov, type: 'CALL', symbol: 'ETH' });
  }, [ssov, setSelectedSsovV3]);

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
      <AppBar active="vaults" />
      <Box className="py-12 lg:max-w-5xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0">
        <Box className="flex flex-col mt-20">
          <Box className="flex md:flex-row flex-col mb-4 md:justify-between items-center md:items-start">
            <Description
              ssovData={ssovData}
              ssovEpochData={ssovEpochData}
              type={'CALL'}
            />
            <ManageCard />
          </Box>
          <Stats />
          <br />
          {ssovUserData === undefined ? null : (
            <>
              <WritePositions />
              <br />
              <ExerciseList />
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

const ManagePage = () => {
  const { ssov } = useParams();
  return (
    <SsovV3Provider>
      <Manage ssov={ssov} />
    </SsovV3Provider>
  );
};

export default ManagePage;
