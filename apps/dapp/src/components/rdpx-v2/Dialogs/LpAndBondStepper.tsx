import { useEffect, useState } from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import Step from '@mui/material/Step';
import StepContent from '@mui/material/StepContent';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';

import { Button, Dialog } from '@dopex-io/ui';
import { erc20ABI, useAccount, useContractWrite } from 'wagmi';

import usePerpPoolData from 'hooks/rdpx/usePerpPoolData';

import formatBigint from 'utils/general/formatBigint';

import { DECIMALS_TOKEN } from 'constants/index';
import PerpVaultLp from 'constants/rdpx/abis/PerpVaultLp';
import RdpxV2Core from 'constants/rdpx/abis/RdpxV2Core';
import addresses from 'constants/rdpx/addresses';

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  wethRequired: bigint;
  lpRequired: bigint;
  bonds: bigint;
  approve: () => void;
  approveSuccess: boolean;
}

const LpAndBondStepper = ({
  isOpen,
  handleClose,
  wethRequired,
  lpRequired,
  bonds,
}: Props) => {
  const [step, setStep] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const { address: user = '0x' } = useAccount();
  const { updateUserPerpetualVaultData, updatePerpetualVaultState } =
    usePerpPoolData({
      user,
    });
  const {
    writeAsync: approveLp,
    isSuccess: approveLpSuccess,
    isLoading: approveLpLoading,
  } = useContractWrite({
    abi: erc20ABI,
    address: addresses.weth,
    functionName: 'approve',
    args: [addresses.perpPoolLp, lpRequired],
  });
  const {
    writeAsync: deposit,
    isSuccess: depositSuccess,
    isLoading: depositLoading,
  } = useContractWrite({
    abi: PerpVaultLp,
    address: addresses.perpPoolLp,
    functionName: 'deposit',
    args: [lpRequired, user],
  });
  const {
    writeAsync: approveWethForBond,
    isSuccess: approveWethForBondSuccess,
    isLoading: approveWethForBondLoading,
  } = useContractWrite({
    abi: erc20ABI,
    address: addresses.weth,
    functionName: 'approve',
    args: [addresses.v2core, wethRequired],
  });
  const {
    writeAsync: bond,
    isSuccess: bondSuccess,
    isLoading: bondLoading,
  } = useContractWrite({
    abi: RdpxV2Core,
    address: addresses.v2core,
    functionName: 'bond',
    args: [bonds, 0n, user],
  });

  const steps = [
    {
      label: 'Add Liquidity',
      data: `LP Required: ${formatBigint(lpRequired, DECIMALS_TOKEN)} WETH`,
      description:
        'Approve and add WETH liquidity to the Perpetual Put Vault based on your bond amount.',
      disabled: loading,
      buttonLabel: 'Add LP',
      action: () =>
        approveLp()
          .then(() => deposit().then(() => setStep(1)))
          .catch((e) => console.error(e)),
    },
  ];

  useEffect(() => {
    updatePerpetualVaultState();
  }, [updatePerpetualVaultState]);

  useEffect(() => {
    updateUserPerpetualVaultData();
  }, [updateUserPerpetualVaultData]);

  useEffect(() => {
    setLoading(
      approveLpLoading ||
        depositLoading ||
        approveWethForBondLoading ||
        bondLoading,
    );
  }, [
    approveLpLoading,
    approveWethForBondLoading,
    bondLoading,
    depositLoading,
  ]);

  useEffect(() => {
    if (approveLpSuccess && depositSuccess) {
      setStep(1);
    } else if (approveWethForBondSuccess && bondSuccess) {
      setStep(2);
    } else setStep(0);
  }, [
    approveLpSuccess,
    approveWethForBondSuccess,
    bondSuccess,
    depositSuccess,
  ]);

  return (
    <Dialog
      title="LP + Bond"
      isOpen={isOpen}
      handleClose={handleClose}
      showCloseIcon
    >
      <Stepper activeStep={step} orientation="vertical">
        {steps.map((_step) => (
          <Step key={_step.label}>
            <StepLabel>
              <span className="text-md text-white">{_step.label}</span>
            </StepLabel>
            <StepContent>
              <div className="flex flex-col space-y-2 py-2">
                <p className="text-white mb-2 text-sm">{_step.description}</p>
                <p className="text-jaffa mb-2 text-sm">{_step.data}</p>
              </div>
              <Button
                size="small"
                className="w-1/4"
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

export default LpAndBondStepper;
