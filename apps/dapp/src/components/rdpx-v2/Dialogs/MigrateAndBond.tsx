import { useEffect, useMemo, useState } from 'react';
import { parseUnits } from 'viem';

import CircularProgress from '@mui/material/CircularProgress';
import Step from '@mui/material/Step';
import StepContent from '@mui/material/StepContent';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';

import { Button, Dialog } from '@dopex-io/ui';
import {
  Address,
  erc20ABI,
  useBalance,
  useContractRead,
  useContractWrite,
} from 'wagmi';

import {
  CamelotPosition,
  camelotPositionManagerContractConfig,
} from 'hooks/rdpx/useCamelotLP';
import useRdpxV2CoreData from 'hooks/rdpx/useRdpxV2CoreData';

import { DECIMALS_TOKEN } from 'constants/index';
import RdpxV2Core from 'constants/rdpx/abis/RdpxV2Core';
import Weth from 'constants/rdpx/abis/Weth';
import addresses from 'constants/rdpx/addresses';

interface Props {
  isOpen: boolean;
  user: Address;
  position: CamelotPosition;
  steps: {
    label: string;
    description: string;
    disabled: boolean;
    buttonLabel: string;
    action: () => void;
  }[];
  handleClose: () => void;
}

const MigrateAndBond = ({ isOpen, handleClose, user, position }: Props) => {
  const [step, setStep] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const { data: balanceResult } = useBalance({
    address: user,
  });

  const { rdpxV2CoreState, updateRdpxV2CoreState } = useRdpxV2CoreData({
    user,
  });
  const { data: rdpxBalance = 0n, refetch: refetchRdpxBalance } =
    useContractRead({
      abi: erc20ABI,
      address: addresses.rdpx,
      functionName: 'balanceOf',
      args: [user],
    });
  const { data: wethBalance = 0n, refetch: refetchWethBalance } =
    useContractRead({
      abi: erc20ABI,
      address: addresses.weth,
      functionName: 'balanceOf',
      args: [user],
    });

  const { writeAsync: decreaseLiquidity, isLoading: decreaseLiquidityLoading } =
    useContractWrite({
      ...camelotPositionManagerContractConfig,
      functionName: 'decreaseLiquidity',
      args: [
        {
          tokenId: position.id,
          liquidity: position.liquidity,
          amount0Min: position.poolComposition[0] - 1n,
          amount1Min: position.poolComposition[1] - 1n,
          deadline: BigInt(Math.floor(new Date().getTime() / 1000) + 10),
        },
      ],
    });

  const { writeAsync: collect, isLoading: collectLoading } = useContractWrite({
    ...camelotPositionManagerContractConfig,
    functionName: 'collect',
    args: [
      {
        tokenId: position.id,
        recipient: user,
        amount0Max: parseUnits('1', DECIMALS_TOKEN * 2),
        amount1Max: parseUnits('1', DECIMALS_TOKEN * 2),
      },
    ],
  });

  const { writeAsync: burn, isLoading: burnLoading } = useContractWrite({
    ...camelotPositionManagerContractConfig,
    functionName: 'burn',
    args: [position.id],
  });

  const maxMintableBonds = useMemo(() => {
    const maxRdpxBondable =
      ((rdpxBalance + position.poolComposition[0]) *
        parseUnits('1', DECIMALS_TOKEN)) /
      (rdpxV2CoreState.bondComposition[0] || 1n);
    const maxEthBondable =
      ((wethBalance + position.poolComposition[1]) *
        parseUnits('1', DECIMALS_TOKEN)) /
      (rdpxV2CoreState.bondComposition[1] || 1n);

    let maxMintableBonds: bigint = 0n;
    if (maxRdpxBondable < maxEthBondable) {
      maxMintableBonds =
        (maxRdpxBondable * parseUnits('1', DECIMALS_TOKEN)) /
        parseUnits('1', DECIMALS_TOKEN);
    } else {
      maxMintableBonds =
        (maxEthBondable * parseUnits('1', DECIMALS_TOKEN)) /
        parseUnits('1', DECIMALS_TOKEN);
    }
    return maxMintableBonds;
  }, [
    position.poolComposition,
    rdpxBalance,
    rdpxV2CoreState.bondComposition,
    wethBalance,
  ]);

  const { writeAsync: bond } = useContractWrite({
    abi: RdpxV2Core,
    address: addresses.v2core,
    functionName: 'bond',
    args: [maxMintableBonds, 0n, user],
  });

  const { writeAsync: wrap } = useContractWrite({
    abi: Weth,
    address: addresses.weth,
    functionName: 'deposit',
    value: position.poolComposition[1],
  });

  useEffect(() => {
    updateRdpxV2CoreState();
  }, [updateRdpxV2CoreState]);

  useEffect(() => {
    setLoading(decreaseLiquidityLoading || collectLoading || burnLoading);
  }, [burnLoading, collectLoading, decreaseLiquidityLoading]);

  const steps = [
    {
      label: 'Remove Liquidity',
      description: 'Remove rDPX-ETH liquidity from Camelot.',
      disabled: loading,
      buttonLabel: 'Remove LP',
      action: () =>
        decreaseLiquidity()
          .then(() => setStep(1))
          .catch(() => setStep(0)),
    },
    {
      label: 'Collect Fee',
      description: 'Collect fee.',
      disabled: loading,
      buttonLabel: 'Remove LP',
      action: () =>
        collect()
          .then(() => burn())
          .then(() => {
            refetchRdpxBalance();
            refetchWethBalance();
          })
          .then(() => wrap().then(() => setStep(2)))
          .catch(() => setStep(1)),
    },
    {
      label: 'Bond',
      description: 'Approve and bond your rDPX + WETH.',
      disabled: loading,
      buttonLabel: 'Bond',
      action: () =>
        bond()
          .then(() => setStep(3))
          .catch(() => setStep(2)),
    },
  ];

  return (
    <Dialog
      title="Remove LP and Bond"
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
                {/* <p className="text-jaffa mb-2 text-sm">{_step.data}</p> */}
              </div>
              <Button
                size="small"
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

export default MigrateAndBond;
