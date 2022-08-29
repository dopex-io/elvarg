import React, { useEffect } from 'react';

import Manage from 'components/ssov-v3/Manage';

import { useBoundStore } from 'store';

const SsovV3Page = (props: { ssov: string }) => {
  const { updateSsovV3, setSsovV3Signer, updateSsovV3EpochData } =
    useBoundStore();

  const { ssov } = props;

  useEffect(() => {
    setSsovV3Signer();
    updateSsovV3();
  }, [setSsovV3Signer, updateSsovV3]);

  useEffect(() => {
    updateSsovV3EpochData();
  }, [updateSsovV3EpochData]);

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
