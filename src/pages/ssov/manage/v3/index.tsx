import React from 'react';

import Manage from 'components/ssov-page/V3/Manage';
import { SsovV3Provider } from 'contexts/SsovV3';

const index = () => {
  return (
    <SsovV3Provider>
      <Manage />
    </SsovV3Provider>
  );
};

export default index;
