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
  const [active, setActive] = useState('veDPX');

  return (
    <Box className="bg-black min-h-screen m-auto">
      <Head>
        <title> Governance | Dopex</title>
      </Head>
      <AppBar />
      <Box className="md:flex py-20 md:py-32 p-3">
        <Box className="flex-2 lg:ml-[15%] md:mr-[20px] mb-5">
          <SideBarMenu active={active} setActive={setActive} />
        </Box>
        <Box className="flex-1">
          {active === 'veDPX' && <VeDPX />}
          {active === 'Bond' && <BondsPage />}
          {active === 'Oracles' && <Oracles />}
          {active === 'Tzwap' && <Tzwap />}
        </Box>
      </Box>
    </Box>
  );
};

export default Governance;
