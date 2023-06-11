import { useCallback, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import {
  ERC20__factory,
  OptionScalps__factory,
  OptionScalpsLp__factory,
} from '@dopex-io/sdk';
import { Button } from '@dopex-io/ui';
import CircularProgress from '@mui/material/CircularProgress';
import Step from '@mui/material/Step';
import StepContent from '@mui/material/StepContent';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import useSendTx from 'hooks/useSendTx';
import { useBoundStore } from 'store';

import Dialog from 'components/UI/Dialog';

import { displayAddress } from 'utils/general';

interface Props {
  isQuote: boolean;
  deprecatedAddress: { [key: string]: string };
}

export default function MigrationStepper({
  isQuote,
  deprecatedAddress,
}: Props) {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [migrationOpen, setMigrationOpen] = useState(false);
  const [toWithdrawAmount, setToWithdrawAmount] = useState(BigNumber.from(0));

  const sendTx = useSendTx();

  const {
    signer,
    accountAddress,
    optionScalpData,
    provider,
    selectedPoolName,
  } = useBoundStore();

  const deprecatedScalpsContract = OptionScalps__factory.connect(
    deprecatedAddress['address']!,
    provider
  );

  const handleNext = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }, []);

  useEffect(() => {
    async function getBalance() {
      if (!signer || !accountAddress) return;
      const assetAddress = isQuote
        ? await deprecatedScalpsContract.quoteLp()
        : await deprecatedScalpsContract.baseLp();
      const deprecatedScalpsLp = OptionScalpsLp__factory.connect(
        assetAddress,
        signer
      );
      const balance = await deprecatedScalpsLp.balanceOf(accountAddress);

      if (activeStep === 0) setToWithdrawAmount(balance);
    }
    getBalance();
  }, [isQuote, activeStep, accountAddress, signer, deprecatedScalpsContract]);

  const handleLpApprove = useCallback(async () => {
    if (!signer || !optionScalpData || !accountAddress) return;
    try {
      setLoading(true);
      const assetAddress = isQuote
        ? await deprecatedScalpsContract.quoteLp()
        : await deprecatedScalpsContract.baseLp();
      await sendTx(
        OptionScalpsLp__factory.connect(assetAddress, signer),
        'approve',
        [deprecatedAddress['address']!, toWithdrawAmount]
      );
      handleNext();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  }, [
    signer,
    sendTx,
    isQuote,
    handleNext,
    optionScalpData,
    accountAddress,
    toWithdrawAmount,
    deprecatedScalpsContract,
    deprecatedAddress,
  ]);

  const handleWithdraw = useCallback(async () => {
    if (!signer || !accountAddress) return;
    try {
      setLoading(true);
      await sendTx(deprecatedScalpsContract.connect(signer), 'withdraw', [
        isQuote,
        toWithdrawAmount,
      ]);
      handleNext();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  }, [
    signer,
    accountAddress,
    isQuote,
    sendTx,
    handleNext,
    deprecatedScalpsContract,
    toWithdrawAmount,
  ]);

  const handleApprove = useCallback(async () => {
    if (!signer || !optionScalpData) return;
    try {
      setLoading(true);
      const quote = await deprecatedScalpsContract.quote();
      const base = await deprecatedScalpsContract.baseLp();

      const tokenContract = await ERC20__factory.connect(
        isQuote ? quote : base,
        signer
      );
      await sendTx(tokenContract, 'approve', [
        optionScalpData?.optionScalpContract.address,
        toWithdrawAmount,
      ]);
      handleNext();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  }, [signer, sendTx, isQuote, handleNext, optionScalpData, toWithdrawAmount]);

  const handleDeposit = useCallback(async () => {
    if (!signer) return;
    try {
      setLoading(true);
      await sendTx(
        optionScalpData?.optionScalpContract?.connect(signer),
        'deposit',
        [accountAddress, isQuote, toWithdrawAmount]
      );
      handleNext();
      setLoading(false);
    } catch (err) {
      handleNext();
      setLoading(false);
      console.log(err);
    }
  }, [
    accountAddress,
    signer,
    sendTx,
    isQuote,
    handleNext,
    optionScalpData,
    toWithdrawAmount,
  ]);

  const steps = [
    {
      label: `Approve ${deprecatedAddress['asset']}`,
      description: `This tx will approve your ${deprecatedAddress['asset']} tokens to withdraw`,
      buttonLabel: 'Approve',
      action: handleLpApprove,
    },
    {
      label: `Withdraw ${deprecatedAddress['asset']}`,
      description: `This tx will withdraw your ${deprecatedAddress['asset']} from the deprecated Scalps contract`,
      buttonLabel: 'Withdraw',
      action: handleWithdraw,
    },
    {
      label: 'Approve tokens',
      description: `This tx will approve your tokens to the new Scalps contract`,
      buttonLabel: 'Approve',
      action: handleApprove,
    },
    {
      label: 'Deposit tokens',
      description: `This tx will deposit your tokens to the new Scalps contract`,
      buttonLabel: 'Deposit',
      action: handleDeposit,
    },
  ];

  return toWithdrawAmount.gt(BigNumber.from(0)) || migrationOpen ? (
    <div className="mb-3">
      <p className="text-sm mx-auto mb-3">
        Balance of {deprecatedAddress['asset']} detected in deprecated contract{' '}
        {displayAddress(deprecatedAddress['address'], '')}
      </p>
      <Button
        variant="contained"
        onClick={() => setMigrationOpen(true)}
        className="w-full"
      >
        Migrate
      </Button>
      <Dialog
        open={migrationOpen}
        handleClose={(_e, reason) => {
          if (reason !== 'backdropClick') setMigrationOpen(false);
        }}
        showCloseIcon
      >
        <div className="text-white text-lg">Scalps Migration</div>
        <div className="text-stieglitz mb-3 text-sm">
          Migrate your Scalps LP
        </div>
        <Stepper
          activeStep={activeStep}
          orientation="vertical"
          className="mb-3"
        >
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
    </div>
  ) : null;
}
