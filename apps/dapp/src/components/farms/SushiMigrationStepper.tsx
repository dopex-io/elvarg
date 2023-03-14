import { useState, useCallback } from 'react';
import { BigNumber, ethers } from 'ethers';
import {
  ERC20__factory,
  StakingRewards__factory,
  StakingRewardsV3__factory,
} from '@dopex-io/sdk';
import { Button } from '@dopex-io/ui';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import CircularProgress from '@mui/material/CircularProgress';

import { useBoundStore } from 'store';

import useSendTx from 'hooks/useSendTx';

import Dialog from 'components/UI/Dialog';

import { FarmStatus } from 'types/farms';

interface Props {
  data: {
    userStakingRewardsBalance: BigNumber;
    userStakingTokenBalance: BigNumber;
    status: FarmStatus;
    stakingTokenSymbol: string;
    stakingRewardsAddress: string;
    stakingTokenAddress: string;
    version?: number;
  };
  open: boolean;
  handleClose: (e: Event, reason: string) => void;
}

const SUSHI_MINICHEF_V2_ADDRESS = '0xf4d73326c13a4fc5fd7a064217e12780e9bd62c3';

export default function SushiMigrationStepper(props: Props) {
  const { data, open, handleClose } = props;

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const sendTx = useSendTx();

  const { signer, accountAddress } = useBoundStore();

  const handleNext = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }, []);

  const handleWithdraw = useCallback(async () => {
    if (!signer || !accountAddress) return;
    try {
      setLoading(true);
      if (data.version === 3) {
        await sendTx(
          StakingRewardsV3__factory.connect(data.stakingRewardsAddress, signer),
          'unstake',
          [data.userStakingRewardsBalance]
        );
      } else {
        await sendTx(
          StakingRewards__factory.connect(data.stakingRewardsAddress, signer),
          'withdraw',
          [data.userStakingRewardsBalance]
        );
      }
      handleNext();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  }, [signer, accountAddress, data, sendTx, handleNext]);

  const handleClaim = useCallback(async () => {
    if (!signer) return;
    try {
      setLoading(true);
      if (data.version === 3) {
        const stakingRewardsContract = StakingRewardsV3__factory.connect(
          data.stakingRewardsAddress,
          signer
        );

        await sendTx(stakingRewardsContract, 'claim', []);
      } else {
        const stakingRewardsContract = StakingRewards__factory.connect(
          data.stakingRewardsAddress,
          signer
        );

        await sendTx(stakingRewardsContract, 'getReward', [2]);
      }
      handleNext();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  }, [signer, sendTx, data, handleNext]);

  const handleApprove = useCallback(async () => {
    if (!signer) return;
    try {
      setLoading(true);
      const stakingTokenContract = ERC20__factory.connect(
        data.stakingTokenAddress,
        signer
      );

      await sendTx(stakingTokenContract, 'approve', [
        SUSHI_MINICHEF_V2_ADDRESS,
        data.userStakingRewardsBalance,
      ]);
      handleNext();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  }, [signer, sendTx, data, handleNext]);

  const handleDeposit = useCallback(async () => {
    if (!signer) return;
    try {
      setLoading(true);
      const sushiMiniChefV2 = new ethers.Contract(
        SUSHI_MINICHEF_V2_ADDRESS,
        ['function deposit(uint256 pid, uint256 amount, address to)'],
        signer
      );

      await sendTx(sushiMiniChefV2, 'deposit', [
        // if LP token is DPX/WETH use PID 17 otherwise use 23
        data.stakingTokenAddress.toLowerCase() ===
        '0x0C1Cf6883efA1B496B01f654E247B9b419873054'.toLowerCase()
          ? 17
          : 23,
        data.userStakingRewardsBalance,
        accountAddress,
      ]);

      handleNext();
      setLoading(false);
    } catch (err) {
      handleNext();
      setLoading(false);
      console.log(err);
    }
  }, [signer, sendTx, data, accountAddress, handleNext]);

  const steps = [
    {
      label: 'Withdraw LP',
      description: `This tx will withdraw your LP tokens from the deprecated farm contract`,
      buttonLabel: 'Withdraw',
      action: handleWithdraw,
    },
    {
      label: 'Claim Rewards',
      description:
        'This tx will claim any pending rewards from the deprecated farm contract',
      buttonLabel: 'Claim',
      action: handleClaim,
    },
    {
      label: 'Approve LP',
      description: `This tx will approve your LP tokens to the Sushi Farm contract`,
      buttonLabel: 'Approve',
      action: handleApprove,
    },
    {
      label: 'Deposit LP',
      description: `This tx will deposit your LP tokens to the Sushi Farm contract`,
      buttonLabel: 'Deposit',
      action: handleDeposit,
    },
  ];

  return (
    <Dialog open={open} handleClose={handleClose} showCloseIcon>
      <div className="text-white text-lg">Sushi LP Staking Migration</div>
      <div className="text-stieglitz mb-3 text-sm">
        Migrate your LP tokens to Sushi
      </div>
      <Stepper activeStep={activeStep} orientation="vertical" className="mb-3">
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
      <Button
        variant="contained"
        disabled={activeStep < 4}
        onClick={() =>
          window.open(
            `https://sushi.com/earn/arb1:${data.stakingTokenAddress.toLowerCase()}`,
            '_blank'
          )
        }
      >
        Go to Sushi
      </Button>
    </Dialog>
  );
}
