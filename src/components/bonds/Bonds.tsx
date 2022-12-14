import { useEffect, useState } from 'react';
import Typography from 'components/UI/Typography';

import { UserBonds } from './UserBonds';
import { ModalBonds } from './ModalBonds';
import { EligibilityCheck } from './EligibilityCheck';
import { EpochData } from './EpochData';

import { useBoundStore } from 'store';

export const Bonds = () => {
  const {
    provider,
    updateBondsContracts,
    bondsContracts,
    updateBondsData,
    updateBondsUserEpochData,
  } = useBoundStore();

  const [modalOpen, setModal] = useState(false);
  const [eligibilityModal, setEligibilityModal] = useState(false);

  const handleModal = () => {
    setModal(!modalOpen);
  };

  const handleEligibilityModal = () => {
    setEligibilityModal(!eligibilityModal);
  };

  useEffect(() => {
    updateBondsContracts();
  }, [updateBondsContracts, provider]);

  useEffect(() => {
    if (!bondsContracts) return;
    updateBondsData();
  }, [bondsContracts, updateBondsData, provider]);

  useEffect(() => {
    if (!bondsContracts) return;
    updateBondsUserEpochData();
  }, [bondsContracts, updateBondsUserEpochData, provider]);

  return (
    <>
      <Typography variant="h2">DPX Bonds</Typography>
      <Typography variant="h5" color="stieglitz">
        Bonding powered by Dopex
      </Typography>
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
