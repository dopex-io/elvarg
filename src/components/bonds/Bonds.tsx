import { useEffect, useState } from 'react';
import Typography from 'components/UI/Typography';

import { UserBonds } from './UserBonds';
import { ModalBonds } from './ModalBonds';
import { EligibilityCheck } from './EligibilityCheck';
import { EpochData } from './EpochData';

import { useBoundStore } from 'store';

export const Bonds = () => {
  const {
    signer,
    provider,
    contractAddresses,
    updateBondsContracts,
    updateBondsData,
    updateBondsUserEpochData,
  } = useBoundStore();

  const [modalOpen, setModal] = useState(false);
  const [eligibilityModal, setEligibilityModal] = useState(false);

  const handleModal = () => {
    updateBondsUserEpochData();
    setModal(!modalOpen);
  };
  const handleEligibilityModal = () => {
    setEligibilityModal(!eligibilityModal);
  };

  useEffect(() => {
    updateBondsContracts();
    updateBondsData();
  }, [
    contractAddresses,
    provider,
    signer,
    updateBondsContracts,
    updateBondsData,
  ]);

  return (
    <>
      <Typography variant="h5">Bonding</Typography>
      <EpochData
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
  return <Bonds />;
}
