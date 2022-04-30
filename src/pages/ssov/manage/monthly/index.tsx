import React from 'react';

import Manage from 'components/Ssov/V2/Manage';

import { SsovProvider } from 'contexts/Ssov';
import { BnbConversionProvider } from 'contexts/BnbConversion';

const index = () => {
  return (
    <BnbConversionProvider>
      <SsovProvider>
        <Manage />
      </SsovProvider>
    </BnbConversionProvider>
  );
};

export default index;
