import { useContext, useState, useEffect, useMemo } from 'react';
import AppBar from 'components/common/AppBar';
import Box from '@mui/material/Box';
import Typography from 'components/UI/Typography';

import { UserBonds } from 'components/bonds/UserBonds';
import { ModalBonds } from 'components/bonds//ModalBonds';
import { EpochData } from 'components/bonds/EpochData';
import { WalletContext } from 'contexts/Wallet';
import { DpxBondsContext, DpxBondsProvider } from 'contexts/Bonds';

export const Bonds = () => {
  const { accountAddress } = useContext(WalletContext);
  const [modalOpen, setModal] = useState(false);

  const handleModal = () => {
    setModal(!modalOpen);
  };

  return (
    <>
      <AppBar />
      <Box className="mt-20 md:mt-32 p-3">
        <Typography variant="h5">Bonding</Typography>
        <EpochData accountAddress={accountAddress} handleModal={handleModal} />
        <UserBonds handleModal={handleModal} />
      </Box>
      <ModalBonds modalOpen={modalOpen} handleModal={handleModal} />
    </>
  );
};

// export default BondsPage;

export default function BondsPaget() {
  return (
    <DpxBondsProvider>
      <Bonds />
    </DpxBondsProvider>
  );
}
