import React, { useCallback, useMemo } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import cx from 'classnames';
import useSendTx from 'hooks/useSendTx';
import Countdown from 'react-countdown';
import { useBoundStore } from 'store';

import CustomButton from 'components/UI/Button';

export interface Props {
  open: boolean;
  handleClose: Function;
  selectedPositionNftIndex: number | null;
}

const WithdrawModal = ({
  open,
  handleClose,
  selectedPositionNftIndex,
}: Props) => {
  const {
    signer,
    straddlesUserData,
    straddlesData,
    straddlesEpochData,
    updateStraddlesUserData,
  } = useBoundStore();

  const sendTx = useSendTx();

  const isWithdrawalEnabled: boolean = useMemo(() => {
    if (!straddlesEpochData) return false;

    if (
      straddlesUserData?.writePositions![selectedPositionNftIndex!]![
        'epoch'
      ]!.toNumber()! < straddlesData!.currentEpoch
    )
      return true;
    else return false;
  }, [
    straddlesEpochData,
    straddlesData,
    selectedPositionNftIndex,
    straddlesUserData,
  ]);

  const handleWithdraw = useCallback(async () => {
    if (!straddlesData?.straddlesContract) return;

    if (straddlesData && straddlesUserData && signer) {
      await sendTx(
        straddlesData?.straddlesContract.connect(signer),
        'withdraw',
        [straddlesUserData?.writePositions![selectedPositionNftIndex!]!['id']]
      );
      await updateStraddlesUserData!();
    }
  }, [
    straddlesData,
    straddlesUserData,
    selectedPositionNftIndex,
    signer,
    updateStraddlesUserData,
    sendTx,
  ]);

  const handleToggleRollover = useCallback(async () => {
    if (straddlesData?.straddlesContract && straddlesUserData && signer) {
      await sendTx(
        straddlesData.straddlesContract.connect(signer),
        'toggleRollover',
        [straddlesUserData?.writePositions![selectedPositionNftIndex!]!['id']]
      );
      await updateStraddlesUserData!();
    }
  }, [
    straddlesData,
    straddlesUserData,
    selectedPositionNftIndex,
    signer,
    updateStraddlesUserData,
    sendTx,
  ]);

  const rolloverText = useMemo(() => {
    if (straddlesUserData?.writePositions![selectedPositionNftIndex!]?.rollover)
      return 'Disable';
    return 'Enable';
  }, [straddlesUserData, selectedPositionNftIndex]);

  return (
    <Modal
      className="flex items-center justify-center"
      open={open}
      onClose={() => handleClose}
    >
      <div className="max-w-sm">
        <div className="bg-cod-gray rounded-2xl p-4 pr-3">
          <div className="flex justify-between items-center mb-6">
            <h6 className="text-sm">Withdrawal Method</h6>
            <CloseIcon
              role="button"
              className="h-6 w-6"
              onClick={() => handleClose()}
            />
          </div>
          <div className="border rounded-lg border-neutral-800 mb-4 p-2">
            <div className="flex justify-between items-center m-2">
              <h6 className="text-sm">Automatic rollover</h6>
              <div className="flex items-center">
                <Button
                  onClick={handleToggleRollover}
                  className={cx(
                    'rounded-md h-10 ml-1 hover:bg-opacity-70 pl-2 pr-2',
                    'bg-primary hover:bg-primary text-white'
                  )}
                >
                  {rolloverText}
                </Button>
              </div>
            </div>
            <div className="m-2 mt-5">
              <h6 className="text-gray-400 text-sm">
                Your funds will be used as deposit for the next epoch if
                rollover is enabled
              </h6>
            </div>
          </div>
          <div className="border rounded-lg border-neutral-800 mt-2 p-2">
            <div className="flex justify-between items-center m-2">
              <h6 className="text-sm">Withdraw manually</h6>
              <div className="flex items-center">
                <CustomButton
                  onClick={handleWithdraw}
                  className={cx(
                    'rounded-md h-10 ml-1 hover:bg-opacity-70 pl-2 pr-2',
                    !isWithdrawalEnabled
                      ? 'bg-umbra hover:bg-cod-gray'
                      : 'bg-primary hover:bg-primary text-white'
                  )}
                  disabled={!isWithdrawalEnabled}
                  color={isWithdrawalEnabled ? 'primary' : 'mineshaft'}
                >
                  {isWithdrawalEnabled || !straddlesData?.isEpochExpired ? (
                    'Withdraw'
                  ) : (
                    <Countdown
                      date={straddlesEpochData?.expiry.toNumber()}
                      renderer={({ days, hours, minutes }) => {
                        return (
                          <div className={'flex'}>
                            <img
                              src="/assets/timer.svg"
                              className="h-[0.9rem] mr-2 ml-1"
                              alt="Timer"
                            />
                            <p className="ml-auto text-stieglitz mr-1">
                              {days}d {hours}h {minutes}m
                            </p>
                          </div>
                        );
                      }}
                    />
                  )}
                </CustomButton>
              </div>
            </div>
            <div className="m-2 mt-5">
              <h6 className="text-gray-400 text-sm">
                You can withdraw at any time after this epoch ends if rollover
                is disabled
              </h6>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default WithdrawModal;
