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
  // const { epochNumber, epochStartTime } = useContext(DpxBondsContext);

  // useEffect(() => {
  //   console.log("Here epochNumber", epochNumber, epochStartTime)

  // }, [epochNumber, epochStartTime])

  const [modalOpen, setModal] = useState(true);
  const handleModal = () => {
    setModal(!modalOpen);
  };

  return (
    <>
      <AppBar />
      <Box className="mt-20 md:mt-32 p-3">
        <Typography variant="h5">Bonding</Typography>
        <Box className="text-stieglitz mb-5">
          Swap your stables at a premium for vested DPX and support Dopex's
          operations.
        </Box>
        <EpochData accountAddress={accountAddress} handleModal={handleModal} />
        <UserBonds accountAddress={accountAddress} handleModal={handleModal} />
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
