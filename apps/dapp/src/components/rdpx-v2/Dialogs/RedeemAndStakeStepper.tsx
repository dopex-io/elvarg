import { useEffect, useMemo, useState } from 'react';
import { parseUnits } from 'viem';

import CircularProgress from '@mui/material/CircularProgress';
import Step from '@mui/material/Step';
import StepContent from '@mui/material/StepContent';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';

import { Button, Dialog } from '@dopex-io/ui';
import { useAccount, useContractRead, useContractWrite } from 'wagmi';

import useRedeemBondsSteps from 'components/rdpx-v2/Tables/hooks/useRedeemBondsSteps';

import { formatBigint } from 'utils/general';

import { DECIMALS_TOKEN } from 'constants/index';
import CurveMultiRewards from 'constants/rdpx/abis/CurveMultiRewards';
import RdpxV2Bond from 'constants/rdpx/abis/RdpxV2Bond';
import RdpxV2Core from 'constants/rdpx/abis/RdpxV2Core';
import ReceiptToken from 'constants/rdpx/abis/ReceiptToken';
import addresses from 'constants/rdpx/addresses';

interface Props {
  open: boolean;
  handleClose: () => void;
  data: {
    id: bigint;
  };
  updatePositions: () => Promise<void>;
  claimable?: bigint;
}

const RedeemAndStakeStepper = ({
  open,
  handleClose,
  data: { id },
  updatePositions,
  claimable,
}: Props) => {
  const { address: user = '0x' } = useAccount();

  const [_step, setStep] = useState<number>(0);

  const { data: balance = 0n } = useContractRead({
    abi: ReceiptToken,
    address: addresses.receiptToken,
    functionName: 'balanceOf',
    args: [user],
  });

  const {
    writeAsync: approveBond,
    isLoading: approving,
    isSuccess: approved,
    reset: resetApproveBondHook,
  } = useContractWrite({
    abi: RdpxV2Bond,
    address: addresses.bond,
    functionName: 'setApprovalForAll',
    args: [addresses.v2core, true],
  });
  const { data: hasUserApproved } = useContractRead({
    abi: RdpxV2Bond,
    address: addresses.bond,
    functionName: 'isApprovedForAll',
    args: [user, addresses.v2core],
  });
  const {
    writeAsync: vest,
    isLoading: vesting,
    isSuccess: vested,
    reset: resetVestingHook,
  } = useContractWrite({
    abi: RdpxV2Core,
    address: addresses.v2core,
    functionName: 'redeemReceiptTokenBonds',
    args: [id, user],
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

  const {
    stepperData,
    errorMsg,
    setErrorMsg,
    /*,steps*/
  } = useRedeemBondsSteps({
    id,
    user,
    hooks: {
      approveBond,
      vest,
      approveStaking,
      stake,
    },
  });

  const loadingState = useMemo(
    () => approving || vesting || approvingStaking || staking,
    [approving, vesting, approvingStaking, staking],
  );

  useEffect(() => {
    if (approved || hasUserApproved) {
      setStep(1);
      setErrorMsg('');
    }
    if (vested) {
      setStep(2);
      updatePositions();
      setErrorMsg('');
    }
    if (approvedStaking) {
      setStep(3);
      setErrorMsg('');
    }
    if (staked) {
      setStep(4);
      updatePositions();
      setErrorMsg('');
    }
  }, [
    approved,
    approvedStaking,
    hasUserApproved,
    setErrorMsg,
    staked,
    updatePositions,
    vested,
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
        resetApproveBondHook();
        resetVestingHook();
        resetApproveStakingHook();
        resetStakingHook();
        setErrorMsg('');
      }}
      showCloseIcon
    >
      <Stepper activeStep={_step} orientation="vertical">
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

export default RedeemAndStakeStepper;
