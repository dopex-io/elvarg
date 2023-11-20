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
import { RewardAccrued } from 'hooks/ssov/useSsovPositions';

import { getSsovStakingRewardsPosition } from 'utils/ssov/getSsovStakingRewardsData';

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  data: {
    ssov: Address;
    tokenId: bigint;
    epoch: bigint;
    to: Address;
    expiry: number;
    canStake: boolean;
    rewardsAccrued: RewardAccrued[];
  };
}

const WithdrawStepper = ({ isOpen = false, handleClose, data }: Props) => {
  const [step, setStep] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [staked, setStaked] = useState<boolean>(false);

  const claimConfig = usePrepareClaim({
    ssov: data.ssov,
    tokenId: data.tokenId,
    receiver: data.to,
  });
  const withdrawConfig = usePrepareWithdraw({
    ssov: data.ssov,
    tokenId: data.tokenId,
    to: data.to,
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
  }, [, withdraw, withdrawSuccess]);

  const handleClaim = useCallback(() => {
    claim?.();
    if (claimSuccess) {
      handleNext();
    }
  }, [claim, claimSuccess]);

  const steps = [
    {
      label: 'Withdraw',
      description: 'Withdraw your deposits from the SSOV',
      disabled: data.expiry > new Date().getTime() / 1000,
      buttonLabel: 'Withdraw',
      action: handleWithdraw,
    },
  ];

  if (staked) {
    steps.unshift({
      label: 'Claim',
      description: 'Claim rewards',
      disabled: !staked,
      buttonLabel: 'Claim',
      action: handleClaim,
    });
  }

  useEffect(() => {
    (async () => {
      const userPosition = await getSsovStakingRewardsPosition(
        data.ssov,
        data.tokenId,
        data.epoch,
      );
      setStaked(userPosition.staked);
    })();
  }, [data.ssov, data.tokenId, data.epoch, data.canStake, staked]);

  useEffect(() => {
    if (claimSuccess || withdrawSuccess) {
      setStep(1);
    }
  }, [claimSuccess, staked, withdrawSuccess]);

  useEffect(() => {
    setLoading(claimLoading || withdrawLoading);
  }, [claimLoading, withdrawLoading]);

  return (
    <Dialog
      title="Withdraw"
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
                disabled={loading || _step.disabled}
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
