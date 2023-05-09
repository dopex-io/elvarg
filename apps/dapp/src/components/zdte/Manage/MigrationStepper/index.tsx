import { useCallback, useEffect, useState } from 'react';

import { BigNumber } from 'ethers';

import { ERC20__factory, ZdteLP__factory, Zdte__factory } from '@dopex-io/sdk';
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
  symbol: string;
  deprecatedAddress: { [key: string]: string };
}

export default function MigrationStepper(props: Props) {
  const { isQuote, symbol, deprecatedAddress } = props;

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [migrationOpen, setMigrationOpen] = useState(false);
  const [toWithdrawAmount, setToWithdrawAmount] = useState(BigNumber.from(0));

  const sendTx = useSendTx();

  const {
    signer,
    accountAddress,
    getZdteContract,
    staticZdteData,
    provider,
    selectedPoolName,
  } = useBoundStore();

  const deprecateZdteContract = Zdte__factory.connect(
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
        ? await deprecateZdteContract.quoteLp()
        : await deprecateZdteContract.baseLp();
      const deprecatedZdteLp = ZdteLP__factory.connect(assetAddress, signer);
      const balance = await deprecatedZdteLp.balanceOf(accountAddress);
      setToWithdrawAmount(balance);
    }
    getBalance();
  }, [isQuote, accountAddress, signer, deprecateZdteContract]);

  const handleLpApprove = useCallback(async () => {
    if (!signer || !staticZdteData || !accountAddress) return;
    try {
      setLoading(true);
      const assetAddress = isQuote
        ? await deprecateZdteContract.quoteLp()
        : await deprecateZdteContract.baseLp();
      await sendTx(ZdteLP__factory.connect(assetAddress, signer), 'approve', [
        deprecatedAddress['address']!,
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
    sendTx,
    isQuote,
    handleNext,
    staticZdteData,
    accountAddress,
    toWithdrawAmount,
    deprecateZdteContract,
    deprecatedAddress,
  ]);

  const handleWithdraw = useCallback(async () => {
    if (!signer || !accountAddress) return;
    try {
      setLoading(true);
      await sendTx(deprecateZdteContract.connect(signer), 'withdraw', [
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
    deprecateZdteContract,
    toWithdrawAmount,
  ]);

  const handleApprove = useCallback(async () => {
    if (!signer || !staticZdteData) return;
    try {
      setLoading(true);
      const tokenContract = await ERC20__factory.connect(
        isQuote
          ? staticZdteData?.quoteTokenAddress
          : staticZdteData?.baseTokenAddress,
        signer
      );
      await sendTx(tokenContract, 'approve', [
        staticZdteData?.zdteAddress,
        toWithdrawAmount,
      ]);
      handleNext();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  }, [signer, sendTx, isQuote, handleNext, staticZdteData, toWithdrawAmount]);

  const handleDeposit = useCallback(async () => {
    if (!signer) return;
    try {
      setLoading(true);
      const zdteContract = await getZdteContract();
      await sendTx(zdteContract.connect(signer), 'deposit', [
        isQuote,
        toWithdrawAmount,
      ]);
      handleNext();
      setLoading(false);
    } catch (err) {
      handleNext();
      setLoading(false);
      console.log(err);
    }
  }, [signer, sendTx, isQuote, handleNext, getZdteContract, toWithdrawAmount]);

  const steps = [
    {
      label: `Approve ${symbol}`,
      description: `This tx will approve your ${symbol} tokens to withdraw`,
      buttonLabel: 'Approve',
      action: handleLpApprove,
    },
    {
      label: `Withdraw ${symbol}`,
      description: `This tx will withdraw your ${symbol} from the deprecated ZDTE contract`,
      buttonLabel: 'Withdraw',
      action: handleWithdraw,
    },
    {
      label: 'Approve tokens',
      description: `This tx will approve your tokens to the new ZDTE contract`,
      buttonLabel: 'Approve',
      action: handleApprove,
    },
    {
      label: 'Deposit tokens',
      description: `This tx will deposit your tokens to the new ZDTE contract`,
      buttonLabel: 'Deposit',
      action: handleDeposit,
    },
  ];

  return toWithdrawAmount.gt(BigNumber.from(0)) &&
    selectedPoolName.toLowerCase().includes(deprecatedAddress['asset']!) ? (
    <>
      <p className="text-sm mx-auto">
        Balance of {symbol} detected in deprecated contract{' '}
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
        <div className="text-white text-lg">ZDTE Migration</div>
        <div className="text-stieglitz mb-3 text-sm">Migrate your ZDTE LP</div>
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
    </>
  ) : null;
}
