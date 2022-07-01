import { useState } from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';

import AppBar from 'components/common/AppBar';
import BondsPage from 'components/more/bonds/Bonds';
import { SideBarMenu } from 'components/more/SideBarMenu';
import VeDPX from 'components/more/Vedpx';
import Oracles from 'components/more/Oracles';
import Tzwap from 'components/more/tzwap';

const More = () => {
  const [active, setActive] = useState('veDPX');

  return (
    <Box className="bg-black min-h-screen m-auto p-3">
      <Head>
        <title> More | Dopex</title>
      </Head>
      <AppBar />
      <Box className="py-20 md:py-32 md:flex m-auto lg:w-[980px]">
        <Box className="flex-2 md:mr-[2%] mb-5">
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

export default More;
