import React from 'react';

import Manage from 'components/ssov-v3/Manage';

import { SsovV3Provider } from 'contexts/SsovV3';
import { BnbConversionProvider } from 'contexts/BnbConversion';

const SsovV3Page = (props) => {
  const { ssov } = props;
  return (
    <BnbConversionProvider>
      <SsovV3Provider>
        <Manage ssov={ssov} />
      </SsovV3Provider>
    </BnbConversionProvider>
  );
};

export async function getServerSideProps(context) {
  return {
    props: {
      ssov: context.query.ssov,
    },
  };
}

export default SsovV3Page;
