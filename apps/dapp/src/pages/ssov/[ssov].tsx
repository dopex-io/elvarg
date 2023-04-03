import React, { useEffect } from 'react';

import { useBoundStore } from 'store';

import Manage from 'components/ssov/Manage';

import { useRouter } from 'next/router';

const SsovV3Page = () => {
  const {
    signer,
    ssovData,
    ssovEpochData,
    updateSsovV3,
    updateSsovV3Signer,
    updateSsovV3UserData,
    updateSsovV3EpochData,
  } = useBoundStore();

  const router = useRouter();
  const ssovQuery = router.query['ssov'];
  const ssov = ssovQuery as unknown as string;

  useEffect(() => {
    updateSsovV3Signer();
  }, [signer, updateSsovV3Signer, ssov]);

  useEffect(() => {
    updateSsovV3();
  }, [updateSsovV3, ssov]);

  useEffect(() => {
    if (!ssovData) return;
    updateSsovV3EpochData();
  }, [ssovData, updateSsovV3EpochData, ssov]);

  useEffect(() => {
    if (!ssovEpochData) return;
    updateSsovV3UserData();
  }, [ssovEpochData, updateSsovV3UserData, ssov]);

  return <Manage ssov={ssov} />;
};

export default SsovV3Page;
