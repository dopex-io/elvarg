import { useEffect, useMemo, useState } from 'react';
import { Address, parseUnits } from 'viem';

import CircularProgress from '@mui/material/CircularProgress';
import Step from '@mui/material/Step';
import StepContent from '@mui/material/StepContent';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';

import { Button, Dialog } from '@dopex-io/ui';
import { useAccount, useContractRead, useContractWrite } from 'wagmi';

import useRedeemDelegateBondsSteps from 'components/rdpx-v2/Tables/hooks/useRedeemDelegateBondsSteps';

import { formatBigint } from 'utils/general';

import { DECIMALS_TOKEN } from 'constants/index';
import CurveMultiRewards from 'constants/rdpx/abis/CurveMultiRewards';
import DelegateBonds from 'constants/rdpx/abis/DelegateBonds';
import ReceiptToken from 'constants/rdpx/abis/ReceiptToken';
import addresses from 'constants/rdpx/addresses';

interface Props {
  open: boolean;
  handleClose: () => void;
  data: {
    positions: {
      positionId: bigint;
      delegationControllerAddress: Address;
    }[];
  };
  updatePositions: () => Promise<void>;
  claimable?: bigint;
}

const RedeemDelegateBondAndStakeStepper = ({
  open,
  handleClose,
  data: { positions },
  updatePositions,
  claimable,
}: Props) => {
  const [step, setStep] = useState<number>(0);

  const { address: user = '0x' } = useAccount();

  const { data: balance = 0n, refetch: refetchBalance } = useContractRead({
    abi: ReceiptToken,
    address: addresses.receiptToken,
    functionName: 'balanceOf',
    args: [user],
  });

  const {
    writeAsync: multiredeem,
    isLoading: redeeming,
    isSuccess: redeemed,
    reset: resetRedeemHook,
  } = useContractWrite({
    abi: DelegateBonds,
    address: addresses.delegateBondsV2,
    functionName: 'multiRedeem',
    args: [positions.map((pos) => pos.positionId)],
  });
  const {
    writeAsync: approveStaking,
    isLoading: approvingStaking,
    isSuccess: approvedStaking,
    reset: resetApproveStakingHook,
  } = useContractWrite({
    abi: ReceiptToken,
    address: addresses.receiptToken,
    functionName: 'approve',
    args: [addresses.receiptTokenStaking, balance],
  });
  const {
    writeAsync: stake,
    isLoading: staking,
    isSuccess: staked,
    reset: resetStakingHook,
  } = useContractWrite({
    abi: CurveMultiRewards,
    address: addresses.receiptTokenStaking,
    functionName: 'stake',
    args: [balance],
  });

  const { stepperData, errorMsg, setErrorMsg } = useRedeemDelegateBondsSteps({
    user,
    hooks: {
      multiredeem,
      approveStaking,
      stake,
    },
  });

  const loadingState = useMemo(
    () => redeeming || approvingStaking || staking,
    [redeeming, approvingStaking, staking],
  );

  useEffect(() => {
    if (redeemed) {
      setStep(1);
      refetchBalance();
      updatePositions();
      setErrorMsg('');
    }
    if (approvedStaking) {
      setStep(2);
      setErrorMsg('');
    }
    if (staked) {
      setStep(3);
      updatePositions();
      setErrorMsg('');
    }
  }, [
    approvedStaking,
    refetchBalance,
    setErrorMsg,
    staked,
    updatePositions,
    redeemed,
  ]);

  const formattedClaimAmount = useMemo(() => {
    if (!claimable) return '';
    else if (claimable < parseUnits('0.001', DECIMALS_TOKEN)) return `<0.001`;
    else return formatBigint(claimable, DECIMALS_TOKEN);
  }, [claimable]);

  return (
    <Dialog
      title={`Claim ${formattedClaimAmount} rtETH`}
      isOpen={open}
      handleClose={() => {
        handleClose();
        resetRedeemHook();
        resetApproveStakingHook();
        resetStakingHook();
        setErrorMsg('');
      }}
      showCloseIcon
    >
      <Stepper activeStep={step} orientation="vertical">
        {stepperData.map((_step) => (
          <Step key={_step.label}>
            <StepLabel>
              <span className="text-md text-white">{_step.label}</span>
            </StepLabel>
            <StepContent>
              <div className="flex flex-col space-y-2 py-2">
                <p className="text-white mb-2 text-sm">{_step.description}</p>
                {errorMsg ? (
                  <p className="flex text-xs text-down-bad flex-wrap break-all mb-2">
                    {errorMsg}
                  </p>
                ) : null}
              </div>
              <Button
                size="small"
                onClick={_step.action}
                disabled={loadingState || _step.disabled}
              >
                {loadingState ? (
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

export default RedeemDelegateBondAndStakeStepper;
