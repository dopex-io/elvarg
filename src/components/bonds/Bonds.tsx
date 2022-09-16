import { useContext, useEffect, useState } from 'react';
import Typography from 'components/UI/Typography';

import { UserBonds } from './UserBonds';
import { ModalBonds } from './ModalBonds';
import { EligibilityCheck } from './EligibilityCheck';
import { EpochData } from './EpochData';

import { DpxBondsProvider } from 'contexts/Bonds';
import { DpxBondsContext } from 'contexts/Bonds';

export const Bonds = () => {
  const { dpxBondsData, updateEpochData } = useContext(DpxBondsContext);

  const [modalOpen, setModal] = useState(false);
  const [eligibilityModal, setEligibilityModal] = useState(false);

  const handleModal = () => {
    setModal(!modalOpen);
  };
  const handleEligibilityModal = () => {
    setEligibilityModal(!eligibilityModal);
  };

  useEffect(() => {
    updateEpochData!(dpxBondsData.epoch);
  }, [updateEpochData, dpxBondsData.epoch]);

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
  return (
    <DpxBondsProvider>
      <Bonds />
    </DpxBondsProvider>
  );
}
