import React, { useCallback, useContext, useMemo } from 'react';
import cx from 'classnames';
import Countdown from 'react-countdown';

import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';

import { StraddlesContext } from 'contexts/Straddles';
import { WalletContext } from 'contexts/Wallet';

import CustomButton from 'components/UI/CustomButton';

import useSendTx from 'hooks/useSendTx';

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
    straddlesUserData,
    straddlesData,
    straddlesEpochData,
    updateStraddlesUserData,
  } = useContext(StraddlesContext);
  const { signer, accountAddress } = useContext(WalletContext);

  const sendTx = useSendTx();

  const isWithdrawalEnabled: boolean = useMemo(() => {
    if (!straddlesEpochData) return false;

    if (
      new Date().getTime() > straddlesEpochData?.expiry.toNumber() &&
      straddlesData?.isEpochExpired &&
      straddlesUserData?.writePositions![selectedPositionNftIndex!]![
        'epoch'
      ]! <=
        straddlesData.currentEpoch + 1
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
    const approved = await straddlesData!.writePositionsMinter
      .connect(signer)
      .isApprovedForAll(
        accountAddress,
        straddlesData?.straddlesContract.address
      );

    if (!approved)
      await sendTx(
        straddlesData?.writePositionsMinter
          .connect(signer)
          .setApprovalForAll(straddlesData?.straddlesContract.address)
      );
    if (straddlesData && straddlesUserData && signer) {
      await sendTx(
        straddlesData?.straddlesContract
          .connect(signer)
          .withdraw(
            straddlesUserData?.writePositions![selectedPositionNftIndex!]!['id']
          )
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
    accountAddress,
  ]);

  const handleToggleRollover = useCallback(async () => {
    if (straddlesData && straddlesUserData && signer) {
      await sendTx(
        straddlesData.straddlesContract
          .connect(signer)
          .toggleRollover(
            straddlesUserData?.writePositions![selectedPositionNftIndex!]!['id']
          )
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
      <Box className="max-w-sm">
        <Box className="bg-cod-gray rounded-2xl p-4 pr-3">
          <Box className="flex justify-between items-center mb-6">
            <Typography variant="h6" className="text-sm">
              Withdrawal Method
            </Typography>
            <CloseIcon
              role="button"
              className="h-6 w-6"
              onClick={() => handleClose()}
            />
          </Box>
          <Box className="border rounded-lg border-neutral-800 mb-4 p-2">
            <Box className="flex justify-between items-center m-2">
              <Typography variant="h6" className="text-sm">
                Automatic rollover
              </Typography>
              <Box className="flex items-center">
                <Button
                  onClick={handleToggleRollover}
                  className={cx(
                    'rounded-md h-10 ml-1 hover:bg-opacity-70 pl-2 pr-2',
                    'bg-primary hover:bg-primary text-white'
                  )}
                >
                  {rolloverText}
                </Button>
              </Box>
            </Box>
            <Box className="m-2 mt-5">
              <Typography variant="h6" className="text-gray-400 text-sm">
                Your funds will be used as deposit for the next epoch if
                rollover is enabled
              </Typography>
            </Box>
          </Box>
          <Box className="border rounded-lg border-neutral-800 mt-2 p-2">
            <Box className="flex justify-between items-center m-2">
              <Typography variant="h6" className="text-sm">
                Withdraw manually
              </Typography>
              <Box className="flex items-center">
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
                          <Box className={'flex'}>
                            <img
                              src="/assets/timer.svg"
                              className="h-[0.9rem] mr-2 ml-1"
                              alt="Timer"
                            />
                            <Typography
                              variant="inherit"
                              className="ml-auto text-stieglitz mr-1"
                            >
                              {days}d {hours}h {minutes}m
                            </Typography>
                          </Box>
                        );
                      }}
                    />
                  )}
                </CustomButton>
              </Box>
            </Box>
            <Box className="m-2 mt-5">
              <Typography variant="h6" className="text-gray-400 text-sm">
                You can withdraw at any time after this epoch ends if rollover
                is disabled
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default WithdrawModal;
