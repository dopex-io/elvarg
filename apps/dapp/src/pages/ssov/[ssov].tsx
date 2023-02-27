import Router from 'next/router';

import React, { useEffect } from 'react';

import { ethers } from 'ethers';

import { useBoundStore } from 'store';

import Manage from 'components/ssov/Manage';

import { CHAIN_ID_TO_RPC, PAGE_TO_SUPPORTED_CHAIN_IDS } from 'constants/index';

const SsovV3Page = (props: { ssov: string }) => {
  const {
    signer,
    ssovData,
    ssovEpochData,
    updateSsovV3,
    updateSsovV3Signer,
    updateSsovV3UserData,
    updateSsovV3EpochData,
    chainId,
    updateState,
  } = useBoundStore();

  // TODO: The below effect should not be required in order for the chainId to update
  useEffect(() => {
    (async function () {
      await updateState({
        isUser: false,
        provider: new ethers.providers.StaticJsonRpcProvider(
          CHAIN_ID_TO_RPC[
            PAGE_TO_SUPPORTED_CHAIN_IDS[Router.asPath]?.default || 42161
          ]
        ),
      });
    })();
  }, [updateState]);

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
