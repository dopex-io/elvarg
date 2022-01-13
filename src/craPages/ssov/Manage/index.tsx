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

import {
  SsovContext,
  SsovProperties,
  SsovData,
  UserSsovData,
} from 'contexts/Ssov';

const Manage = () => {
  const { asset } = useParams();
  const {
    ssovPropertiesArray,
    ssovDataArray,
    userSsovDataArray,
    setSelectedSsov,
    selectedSsov,
  } = useContext(SsovContext);

  const {
    ssovProperties,
    ssovData,
    userSsovData,
    index,
  }: {
    ssovProperties: SsovProperties;
    ssovData: SsovData;
    userSsovData: UserSsovData;
    index: number;
  } = useMemo(() => {
    if (ssovPropertiesArray.length === 0)
      return {
        ssovProperties: undefined,
        ssovData: undefined,
        userSsovData: undefined,
        index: 0,
      };
    let i = ssovPropertiesArray.findIndex((item) => item.tokenName === asset);
    return {
      ssovProperties: ssovPropertiesArray[i],
      ssovData: ssovDataArray[i],
      userSsovData: userSsovDataArray[i],
      index: i,
    };
  }, [ssovPropertiesArray, asset, ssovDataArray, userSsovDataArray]);

  useEffect(() => {
    setSelectedSsov(index);
  }, [index, setSelectedSsov]);

  if (
    ssovProperties === undefined ||
    ssovData === undefined ||
    selectedSsov === null
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
      <Box className="py-12 lg:max-w-5xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0">
        <Box className="flex flex-col mt-20">
          <Box className="flex md:flex-row flex-col mb-4 md:justify-between items-center md:items-start">
            <Description
              ssovProperties={ssovProperties}
              ssovData={ssovData}
              userSsovData={userSsovData}
            />
            <ManageCard ssovProperties={ssovProperties} />
          </Box>
          {userSsovData === undefined ? null : ssovProperties.tokenName ===
            'BNB' ? null : (
            <ExerciseList ssovProperties={ssovProperties} />
          )}
          {ssovProperties.tokenName !== 'BNB' ? (
            <Stats ssovProperties={ssovProperties} className="mt-4" />
          ) : null}
        </Box>
      </Box>
    </Box>
  );
};

export default Manage;
