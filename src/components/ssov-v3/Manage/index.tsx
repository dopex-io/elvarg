import { useContext, useEffect } from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';

import AppBar from 'components/common/AppBar';
import Description from 'components/ssov-v3/Description';
import DepositPanel from 'components/ssov-v3/DepositPanel';
import ExerciseList from 'components/ssov-v3/ExerciseList';
import Stats from 'components/ssov-v3/Stats';
import PageLoader from 'components/common/PageLoader';
import Typography from 'components/UI/Typography';

import { SsovV3Context } from 'contexts/SsovV3';
import { useBoundStore } from 'store';
import WritePositions from 'components/ssov-v3/WritePositions';

import { CHAIN_ID_TO_EXPLORER } from 'constants/index';

const Manage = (props: { ssov: string }) => {
  const { ssov } = props;
  const { ssovData, ssovEpochData, ssovUserData, setSelectedSsovV3 } =
    useContext(SsovV3Context);
  const { chainId } = useBoundStore();

  useEffect(() => {
    setSelectedSsovV3(ssov);
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
      <AppBar active="SSOV" />
      <Box className="py-12 lg:max-w-5xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0">
        <Box className="flex flex-col mt-20">
          <Box className="flex md:flex-row flex-col mb-4 md:justify-between items-center md:items-start">
            <Description ssovData={ssovData} ssovEpochData={ssovEpochData} />
            <DepositPanel />
          </Box>
          <Stats className="mb-4" />
          {ssovUserData === undefined ? null : (
            <>
              <WritePositions className="mb-4" />
              <ExerciseList />
            </>
          )}
        </Box>
        <Box className="flex justify-center space-x-2 my-8">
          <Typography variant="h5" className="text-silver">
            Contract Address:
          </Typography>
          <Typography
            variant="h5"
            className="bg-gradient-to-r from-wave-blue to-primary text-transparent bg-clip-text"
          >
            <a
              href={`${CHAIN_ID_TO_EXPLORER[chainId]}/address/${
                ssovData?.ssovContract?.address ?? ''
              }`}
              rel="noopener noreferrer"
              target={'_blank'}
            >
              {ssovData?.ssovContract?.address}
            </a>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Manage;
