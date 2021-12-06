import { useContext, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Head from 'next/head';
import Box from '@material-ui/core/Box';

import AppBar from 'components/AppBar';
import Description from '../components/Description';
import ManageCard from '../components/ManageCard';
import ExerciseList from '../components/ExerciseList';
import Stats from '../components/Stats';
import PageLoader from 'components/PageLoader';

import { SsovContext, Ssov, SsovData, UserSsovData } from 'contexts/Ssov';

const Manage = () => {
  const { asset } = useParams();
  const {
    ssovArray,
    ssovDataArray,
    userSsovDataArray,
    setSelectedSsov,
    selectedSsov,
  } = useContext(SsovContext);

  const {
    ssov,
    ssovData,
    userSsovData,
    index,
  }: {
    ssov: Ssov;
    ssovData: SsovData;
    userSsovData: UserSsovData;
    index: number;
  } = useMemo(() => {
    if (ssovArray.length === 0)
      return {
        ssov: undefined,
        ssovData: undefined,
        userSsovData: undefined,
        index: 0,
      };
    let i = ssovArray.findIndex((item) => item.tokenName === asset);
    return {
      ssov: ssovArray[i],
      ssovData: ssovDataArray[i],
      userSsovData: userSsovDataArray[i],
      index: i,
    };
  }, [ssovArray, asset, ssovDataArray, userSsovDataArray]);

  useEffect(() => {
    setSelectedSsov(index);
  }, [index, setSelectedSsov]);

  if (ssov === undefined || ssovData === undefined || selectedSsov === null)
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
              ssov={ssov}
              ssovData={ssovData}
              userSsovData={userSsovData}
            />
            <ManageCard ssov={ssov} />
          </Box>
          {userSsovData === undefined ? null : <ExerciseList ssov={ssov} />}
          <Stats ssov={ssov} className="mt-4" />
        </Box>
      </Box>
    </Box>
  );
};

export default Manage;
