import { useEffect } from 'react';
import Box from '@mui/material/Box';

import Description from 'components/ssov/Description';
import DepositPanel from 'components/ssov/DepositPanel';
import ExerciseList from 'components/ssov/ExerciseList';
import Stats from 'components/ssov/Stats';
import PageLoader from 'components/common/PageLoader';
import Typography from 'components/UI/Typography';

import { useBoundStore } from 'store';
import WritePositions from 'components/ssov/WritePositions';

import { CHAINS } from 'constants/chains';

const Manage = (props: { ssov: string }) => {
  const { ssov } = props;
  const {
    chainId,
    ssovData,
    ssovEpochData,
    ssovV3UserData: ssovUserData,
    setSelectedPoolName,
    selectedPoolName,
    updateSsovV3,
    updateSsovV3Signer,
    updateSsovV3UserData,
    updateSsovV3EpochData,
    signer,
  } = useBoundStore();

  useEffect(() => {
    updateSsovV3Signer();
  }, [signer, updateSsovV3Signer, selectedPoolName, chainId]);

  useEffect(() => {
    updateSsovV3();
  }, [updateSsovV3, selectedPoolName, chainId]);

  useEffect(() => {
    if (!ssovData) return;
    updateSsovV3EpochData();
  }, [ssovData, updateSsovV3EpochData, chainId]);

  useEffect(() => {
    if (!ssovEpochData) return;
    updateSsovV3UserData();
  }, [ssovEpochData, updateSsovV3UserData, chainId]);

  useEffect(() => {
    setSelectedPoolName(ssov);
  }, [ssov, setSelectedPoolName]);

  if (ssovData === undefined || ssovEpochData === undefined)
    return (
      <Box className="overflow-x-hidden bg-black h-screen">
        <PageLoader />
      </Box>
    );

  return (
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
            href={`${CHAINS[chainId]?.explorer}/address/${
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
  );
};

export default Manage;
