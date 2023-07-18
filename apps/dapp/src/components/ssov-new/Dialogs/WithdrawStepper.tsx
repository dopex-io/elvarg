import { useCallback, useEffect, useState } from 'react';
import { Address } from 'viem';

import CircularProgress from '@mui/material/CircularProgress';
import Step from '@mui/material/Step';
import StepContent from '@mui/material/StepContent';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';

import { Button, Dialog } from '@dopex-io/ui';
import { useContractWrite } from 'wagmi';

import {
  usePrepareClaim,
  usePrepareWithdraw,
} from 'hooks/ssov/usePrepareWrites';

import { getSsovStakingRewardsPosition } from 'utils/ssov/getSsovStakingRewardsData';

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  data: {
    vault: Address;
    tokenId: bigint;
    epoch: bigint;
    to: Address;
    expiry: number;
  };
}

const WithdrawStepper = ({ isOpen = false, handleClose, data }: Props) => {
  const [step, setStep] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [staked, setStaked] = useState<boolean>(false);

  const withdrawConfig = usePrepareWithdraw({
    vault: data.vault,
    tokenId: data.tokenId,
    to: data.to,
  });
  const claimConfig = usePrepareClaim({
    ssov: data.vault,
    tokenId: data.tokenId,
    receiver: data.to,
  });

  const {
    write: claim,
    isLoading: claimLoading,
    isSuccess: claimSuccess,
  } = useContractWrite(claimConfig);
  const {
    write: withdraw,
    isLoading: withdrawLoading,
    isSuccess: withdrawSuccess,
  } = useContractWrite(withdrawConfig);

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handleWithdraw = useCallback(() => {
    withdraw?.();
    if (withdrawSuccess) {
      handleNext();
    }
  }, [withdraw, withdrawSuccess]);

  const handleClaim = useCallback(async () => {
    if (!staked) handleNext();
    else {
      claim?.();
      if (claimSuccess) {
        handleNext();
      }
    }
  }, [claim, claimSuccess, staked]);

  const steps = [
    {
      ...(staked
        ? {
            label: 'Claim',
            description:
              'This transaction will claim accrued rewards for this deposit. Do not attempt to withdraw before claiming rewards to avoid losing them!',
          }
        : {
            label: 'Not Staked',
            description:
              'You have not staked your SSOV deposit to accrue rewards.',
          }),
      buttonLabel: 'Claim',
      action: handleClaim,
    },
    {
      ...(staked || data.expiry < new Date().getTime() / 1000
        ? {
            label: 'Withdraw',
            description:
              'This transaction will withdraw your deposits from the SSOV.',
          }
        : {
            label: 'Not Yet Withdrawable',
            description: 'The epoch for this deposit has not expired yet.',
          }),
      buttonLabel: 'Withdraw',
      action: handleWithdraw,
    },
  ];

  useEffect(() => {
    (async () => {
      const userPosition = await getSsovStakingRewardsPosition(
        data.vault,
        data.tokenId,
        data.epoch
      );
      setStaked(userPosition.staked);
      setStep(userPosition.staked ? 0 : 1);
    })();
  }, [data]);

  useEffect(() => {
    if (claimSuccess) {
      setStep(1);
    }
    if (withdrawSuccess) {
      setStep(2);
    }
  }, [claimSuccess, withdrawSuccess]);

  useEffect(() => {
    setLoading(claimLoading || withdrawLoading);
  }, [claimLoading, withdrawLoading]);

  return (
    <Dialog
      title="Claim & Withdraw"
      isOpen={isOpen}
      handleClose={handleClose}
      showCloseIcon
    >
      <Stepper activeStep={step} orientation="vertical" className="mb-3">
        {steps.map((_step) => (
          <Step key={_step.label}>
            <StepLabel>
              <span className="text-white">{_step.label}</span>
            </StepLabel>
            <StepContent>
              <p className="texto-white mb-3">{_step.description}</p>
              <Button
                variant="contained"
                onClick={_step.action}
                disabled={
                  loading ||
                  (step == 1 && data.expiry > new Date().getTime() / 1000)
                }
              >
                {loading ? (
                  <CircularProgress className="text-white mr-1" size={16} />
                ) : null}{' '}
                {_step.buttonLabel}
              </Button>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Dialog>
  );
};

export default WithdrawStepper;
