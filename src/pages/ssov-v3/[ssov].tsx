import React from 'react';

import Manage from 'components/ssov-v3/Manage';

import { SsovV3Provider } from 'contexts/SsovV3';

const SsovV3Page = () => {
  return (
    <SsovV3Provider>
      <Manage />
    </SsovV3Provider>
  );
};

export default SsovV3Page;
