import { useState } from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';

import AppBar from 'components/common/AppBar';
import BondsPage from 'components/more/bonds/Bonds';
import { SideBarMenu } from 'components/more/SideBarMenu';
import VeDPX from 'components/more/Vedpx';
import Oracles from 'components/more/Oracles';
import Tzwap from 'components/more/tzwap';

const Governance = () => {
  const [active, setActive] = useState('bond');

  return (
    <Box className="bg-black min-h-screen m-auto">
      <Head>
        <title> Governance | Dopex</title>
      </Head>
      <AppBar />
      <Box className="md:flex py-20 md:py-32 p-3  m-auto">
        <SideBarMenu active={active} setActive={setActive} />
        <Box className="flex-1">
          {active === 'veDPX' && <VeDPX />}
          {active === 'bond' && <BondsPage />}
          {active === 'oracles' && <Oracles />}
          {active === 'tzwap' && <Tzwap />}
        </Box>
      </Box>
    </Box>
  );
};

export default Governance;
