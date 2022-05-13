import { useContext, useEffect } from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';

import AppBar from 'components/common/AppBar';
import Description from 'components/ssov/Description';
import ManageCard from 'components/ssov/ManageCard';
import ExerciseList from 'components/ssov/ExerciseList';
import Stats from 'components/ssov/Stats';
import PageLoader from 'components/common/PageLoader';

import { BnbConversionProvider } from 'contexts/BnbConversion';
import { SsovContext, SsovProvider } from 'contexts/Ssov';

interface Props {
  type: string;
  name: string;
}

const Manage = ({ type, name }: Props) => {
  const {
    ssovData,
    ssovEpochData,
    ssovUserData,
    // @ts-ignore TODO: FIX
    setSelectedSsov,
    selectedSsov,
  } = useContext(SsovContext);

  useEffect(() => {
    // @ts-ignore TODO: FIX
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
              // @ts-ignore TODO: FIX
              ssovUserData={ssovUserData}
              // @ts-ignore TODO: FIX
              type={selectedSsov.type}
            />
            <ManageCard />
          </Box>
          {ssovUserData === undefined ? null : <ExerciseList />}
          {
            // @ts-ignore TODO: FIX
            selectedSsov.type === 'PUT' ? null : <Stats className="mt-4" />
          }
        </Box>
      </Box>
    </Box>
  );
};

// @ts-ignore TODO: FIX
const ManagePage = ({ type, name }) => {
  return (
    <BnbConversionProvider>
      <SsovProvider>
        <Manage type={type} name={name} />
      </SsovProvider>
    </BnbConversionProvider>
  );
};

// @ts-ignore TODO: FIX
export async function getServerSideProps(context) {
  return {
    props: {
      type: context.query.ssov[0],
      name: context.query.ssov[1],
    },
  };
}

export default ManagePage;
