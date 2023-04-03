import React, { useEffect } from 'react';

import { useBoundStore } from 'store';

import Manage from 'components/ssov/Manage';

import { useIsMounted } from 'hooks/useIsMounted';

const SsovV3Page = (props: { ssov: string }) => {
  const isMounted = useIsMounted();

  const {
    signer,
    ssovData,
    ssovEpochData,
    updateSsovV3,
    updateSsovV3Signer,
    updateSsovV3UserData,
    updateSsovV3EpochData,
    chainId,
  } = useBoundStore();

  const { ssov } = props;

  useEffect(() => {
    updateSsovV3Signer();
  }, [signer, updateSsovV3Signer, chainId]);

  useEffect(() => {
    updateSsovV3();
  }, [updateSsovV3, chainId]);

  useEffect(() => {
    if (!ssovData) return;
    updateSsovV3EpochData();
  }, [ssovData, updateSsovV3EpochData, chainId]);

  useEffect(() => {
    if (!ssovEpochData) return;
    updateSsovV3UserData();
  }, [ssovEpochData, updateSsovV3UserData, chainId]);

  if (!isMounted) return null;

  return <Manage ssov={ssov} />;
};

export async function getServerSideProps(context: { query: { ssov: string } }) {
  return {
    props: {
      ssov: context.query.ssov,
    },
  };
}

export default SsovV3Page;
