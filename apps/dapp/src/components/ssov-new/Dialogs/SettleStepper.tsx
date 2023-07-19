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
  usePrepareApprove,
  usePrepareSettle,
} from 'hooks/ssov/usePrepareWrites';

import getSsovEpochData from 'utils/ssov/getSsovEpochData';

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  data: {
    token: Address;
    vault: Address;
    strike: bigint;
    amount: bigint;
    epoch: bigint;
    to: Address;
  };
}

const SettleStepper = ({ isOpen = false, handleClose, data }: Props) => {
  const [step, setStep] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [strikeIndex, setStrikeIndex] = useState<bigint>(0n);

  const approveConfig = usePrepareApprove({
    spender: data.token,
    token: data.token,
    amount: data.amount,
  });
  const settleConfig = usePrepareSettle({
    ssov: data.vault,
    strikeIndex: strikeIndex,
    amount: data.amount,
    epoch: data.epoch,
    to: data.to,
  });

  const {
    write: approve,
    isSuccess: approveSuccess,
    isError: approveError,
    isLoading: approveLoading,
  } = useContractWrite(approveConfig);
  const {
    write: settle,
    isSuccess: settleSuccess,
    isError: settleError,
    isLoading: settleLoading,
  } = useContractWrite(settleConfig);

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handleApprove = useCallback(() => {
    approve?.();
    if (approveSuccess) {
      handleNext();
    }
  }, [approve, approveSuccess]);

  const handleSettle = useCallback(() => {
    settle?.();
    if (settleSuccess) {
      handleNext();
    }
  }, [settle, settleSuccess]);

  const steps = [
    {
      label: 'Approve',
      description: `This transaction will approve your token to be burnt by the SSOV.`,
      buttonLabel: 'Approve',
      action: handleApprove,
    },
    {
      label: 'Settle',
      description:
        'This transaction will settle (burn) your options and transfer your PNL to you.',
      buttonLabel: 'Settle',
      action: handleSettle,
    },
  ];

  useEffect(() => {
    if (approveError) {
      setStep(0);
    } else if (settleError) {
      setStep(1);
    }
  }, [approveError, settleError]);

  useEffect(() => {
    if (approveSuccess) {
      setStep(1);
    }
    if (settleSuccess) {
      setStep(2);
    }
  }, [approveSuccess, settleSuccess]);

  useEffect(() => {
    setLoading(approveLoading || settleLoading);
  }, [approveLoading, settleLoading]);

  useEffect(() => {
    (async () => {
      const _strikeIndex = BigInt(
        (
          await getSsovEpochData({
            ssovAddress: data.vault,
            epoch: Number(data.epoch),
          })
        ).strikes.indexOf(data.strike)
      );
      setStrikeIndex(_strikeIndex);
    })();
  }, [data.epoch, data.strike, data.vault]);

  return (
    <Dialog
      title="Settle"
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
      {step > 2 ? (
        <div className="flex flex-col w-full text-center p-3">
          <p className="text-lg">You Have Successfully Settled your Options!</p>
        </div>
      ) : null}
    </Dialog>
  );
};

export default SettleStepper;
