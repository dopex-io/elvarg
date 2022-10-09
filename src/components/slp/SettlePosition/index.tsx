import React, { useCallback, useMemo } from 'react';
import { Modal } from '@mui/material';
import useSendTx from 'hooks/useSendTx';
import SettlePositionDialog from './SettlePositionDialog';
import { useBoundStore } from 'store';

const CHAIN_ID: number = 5;

export interface Props {
  open: boolean;
  handleClose: Function;
}

const SettlePosition = ({ open, handleClose }: Props) => {
  const sendTx = useSendTx();
  const {
    signer,
    getSlpContract,
    slpUserPurchaseData,
    selectedPoolName,
    updateSlpEpochData,
    updateSlpUserPurchaseData,
    selectedPurchaseIdx,
  } = useBoundStore();

  const slpContract = getSlpContract();

  const putPositionSelected = useMemo(() => {
    return slpUserPurchaseData?.positions[selectedPurchaseIdx!];
  }, [slpUserPurchaseData, selectedPurchaseIdx]);

  const handleSettlePosition = useCallback(async () => {
    if (
      !slpContract ||
      !signer ||
      !putPositionSelected ||
      !updateSlpUserPurchaseData
    )
      return;
    try {
      await sendTx(
        slpContract
          .connect(signer)
          .settle(putPositionSelected.strike, putPositionSelected.receiptId)
      );
      await updateSlpEpochData();
      await updateSlpUserPurchaseData();
    } catch (err) {
      console.log(err);
    }
  }, [
    slpContract,
    putPositionSelected,
    signer,
    updateSlpEpochData,
    updateSlpUserPurchaseData,
    sendTx,
  ]);

  return (
    <Modal
      className="flex items-center justify-center"
      open={open}
      onClose={() => handleClose}
    >
      <SettlePositionDialog
        handleClose={handleClose}
        selectedPoolName={selectedPoolName!}
        strike={putPositionSelected?.strike!}
        amount={putPositionSelected?.amount!}
        pnl={putPositionSelected?.pnl!}
        chainId={CHAIN_ID}
        handleSettlePosition={handleSettlePosition}
      />
    </Modal>
  );
};

export default SettlePosition;
