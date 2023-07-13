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

import getSsovStakingRewardsPosition from 'utils/ssov/getSsovStakingRewardsPosition';

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  data: {
    vault: Address;
    tokenId: bigint;
    epoch: bigint;
    to: Address;
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
    isError: claimError,
    isLoading: claimLoading,
    isSuccess: claimSuccess,
  } = useContractWrite(claimConfig);
  const {
    write: withdraw,
    isError: withdrawError,
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

  useEffect(() => {
    (async () => {
      const userPosition = await getSsovStakingRewardsPosition({
        ssov: data.vault,
        tokenId: data.tokenId,
        epoch: data.epoch,
      });
      setStaked(userPosition.staked);
      setStep(userPosition.staked ? 0 : 1);
    })();
  }, [claimError, data]);

  const steps = [
    {
      label: staked ? 'Claim' : 'Not Staked / No Rewards Set',
      description:
        'This transaction will claim accrued rewards for this deposit. Do not attempt to withdraw before claiming rewards to avoid losing them!',
      buttonLabel: 'Claim',
      action: handleClaim,
    },
    {
      label: 'Withdraw',
      description:
        'This transaction will withdraw your deposits from the SSOV.',
      buttonLabel: 'Withdraw',
      action: handleWithdraw,
    },
  ];

  useEffect(() => {
    if (claimError) {
      setStep(0);
    } else if (withdrawError) {
      setStep(1);
    }
  }, [claimError, withdrawError]);

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
        {steps.map((step) => (
          <Step key={step.label}>
            <StepLabel>
              <span className="text-white">{step.label}</span>
            </StepLabel>
            <StepContent>
              <p className="text-white mb-3">{step.description}</p>
              <Button
                variant="contained"
                onClick={step.action}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress className="text-white mr-1" size={16} />
                ) : null}{' '}
                {step.buttonLabel}
              </Button>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Dialog>
  );
};

export default WithdrawStepper;
