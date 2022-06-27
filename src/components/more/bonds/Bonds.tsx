import { useContext, useState } from 'react';
import Typography from 'components/UI/Typography';

import { UserBonds } from './UserBonds';
import { ModalBonds } from './ModalBonds';
import { EligibilityCheck } from './EligibilityCheck';
import { EpochData } from './EpochData';
import { WalletContext } from 'contexts/Wallet';
import { DpxBondsProvider } from 'contexts/Bonds';

export const Bonds = () => {
  const { accountAddress } = useContext(WalletContext);
  const [modalOpen, setModal] = useState(false);
  const [eligibilityModal, setEligibilityModal] = useState(false);

  const handleModal = () => {
    setModal(!modalOpen);
  };
  const handleEligibilityModal = () => {
    setEligibilityModal(!eligibilityModal);
  };

  return (
    <>
      <Typography variant="h5">Bonding</Typography>
      <EpochData
        accountAddress={accountAddress}
        handleModal={handleModal}
        handleEligibilityModal={handleEligibilityModal}
      />
      <UserBonds handleModal={handleModal} />
      <EligibilityCheck
        eligibilityModal={eligibilityModal}
        handleEligibilityModal={handleEligibilityModal}
      />
      <ModalBonds modalOpen={modalOpen} handleModal={handleModal} />
    </>
  );
};

export default function BondsPage() {
  return (
    <DpxBondsProvider>
      <Bonds />
    </DpxBondsProvider>
  );
}
