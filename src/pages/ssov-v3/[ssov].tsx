import React from 'react';

import Manage from 'components/ssov-v3/Manage';

import { SsovV3Provider } from 'contexts/SsovV3';

const SsovV3Page = (props: { ssov: string }) => {
  const { ssov } = props;
  return (
    <SsovV3Provider>
      <Manage ssov={ssov} />
    </SsovV3Provider>
  );
};

export async function getServerSideProps(context: { query: { ssov: string } }) {
  return {
    props: {
      ssov: context.query.ssov,
    },
  };
}

export default SsovV3Page;
