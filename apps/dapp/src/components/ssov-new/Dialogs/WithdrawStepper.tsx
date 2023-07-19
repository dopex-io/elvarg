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
  usePrepareStake,
  usePrepareWithdraw,
} from 'hooks/ssov/usePrepareWrites';

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
  };
}

const WithdrawStepper = ({ isOpen = false, handleClose, data }: Props) => {
  const [step, setStep] = useState<number>(data.canStake ? 0 : 1);
  const [loading, setLoading] = useState<boolean>(false);
  const [staked, setStaked] = useState<boolean>(false);

  const stakeConfig = usePrepareStake({
    ssov: data.ssov,
    tokenId: data.tokenId,
    receiver: data.to,
  });
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
    write: stake,
    isLoading: stakeLoading,
    isSuccess: stakeSuccess,
  } = useContractWrite(stakeConfig);
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

  const handleStake = useCallback(async () => {
    stake?.();
    if (stakeSuccess) {
      handleNext();
    }
  }, [stake, stakeSuccess]);

  const steps = [
    {
      ...(data.canStake
        ? {
            label: 'Stake',
            description:
              'This transaction will stake your deposit to accrue rewards from now.',
            disabled: loading,
          }
        : {
            label: 'Staked / Can not stake',
            description: 'Can not stake your deposit at this time.',
            disabled: true,
          }),
      buttonLabel: 'Stake',
      action: handleStake,
    },
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
      disabled: !staked,
      action: handleClaim,
    },
    {
      ...(data.expiry < new Date().getTime() / 1000
        ? {
            label: 'Withdraw',
            description:
              'This transaction will withdraw your deposits from the SSOV.',
          }
        : {
            label: 'Not Yet Withdrawable',
            description: 'The epoch for this deposit has not expired yet.',
          }),
      disabled: step == 2 && data.expiry > new Date().getTime() / 1000,
      buttonLabel: 'Withdraw',
      action: handleWithdraw,
    },
  ];

  useEffect(() => {
    (async () => {
      const userPosition = await getSsovStakingRewardsPosition(
        data.ssov,
        data.tokenId,
        data.epoch
      );
      setStaked(!data.canStake || userPosition.staked);
      if (data.canStake && !userPosition.staked) {
        setStep(0);
      } else if (!!userPosition.stakeAmount) {
        setStep(1);
      } else {
        setStep(2);
      }
    })();
  }, [
    data.ssov,
    data.tokenId,
    data.epoch,
    stakeSuccess,
    data.canStake,
    staked,
  ]);

  useEffect(() => {
    if (stakeSuccess) {
      setStep(1);
    }
    if (claimSuccess) {
      setStep(2);
    }
    if (withdrawSuccess) {
      setStep(3);
    }
  }, [claimSuccess, stakeSuccess, staked, withdrawSuccess]);

  useEffect(() => {
    setLoading(claimLoading || withdrawLoading || stakeLoading);
  }, [claimLoading, stakeLoading, withdrawLoading]);

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
