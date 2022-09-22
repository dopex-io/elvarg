import React, { useEffect } from 'react';

import Manage from 'components/ssov-v3/Manage';

import { useBoundStore } from 'store';

const SsovV3Page = (props: { ssov: string }) => {
  const {
    signer,
    updateSsovV3,
    updateSsovV3Signer,
    updateSsovV3UserData,
    updateSsovV3EpochData,
  } = useBoundStore();

  const { ssov } = props;

  useEffect(() => {
    updateSsovV3Signer().then(() => {
      updateSsovV3().then(() => {
        updateSsovV3EpochData();
        updateSsovV3UserData();
      });
    });
  }, [
    signer,
    updateSsovV3,
    updateSsovV3EpochData,
    updateSsovV3Signer,
    updateSsovV3UserData,
  ]);

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
