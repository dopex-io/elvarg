import { useMemo, useState } from 'react';
import { Address } from 'viem';

interface Props {
  hooks: {
    approveBond: () => Promise<any>;
    vest: () => Promise<any>;
    approveStaking: () => Promise<any>;
    stake: () => Promise<any>;
  };
  id: bigint;
  user: Address;
}

const useRedeemBondsSteps = (props: Props) => {
  const { hooks } = props;

  const [errorMsg, setErrorMsg] = useState<string>('');

  const stepperData = useMemo(
    () =>
      [
        {
          label: 'Approve Bond',
          description: 'Approval is required to claim your bond.',
          disabled: false,
          buttonLabel: 'Approve',
          action: () =>
            hooks.approveBond().catch((e) => setErrorMsg(String(e))),
        },
        {
          label: 'Claim',
          description: 'Claim rtETH that is vested to you over time.',
          disabled: false,
          buttonLabel: 'Claim',
          action: () => hooks.vest().catch((e) => setErrorMsg(String(e))),
        },
        {
          label: 'Approve rtETH',
          description: 'Approval of rtETH is required for staking.',
          disabled: false,
          buttonLabel: 'Approve',
          action: () =>
            hooks.approveStaking().catch((e) => setErrorMsg(String(e))),
        },
        {
          label: 'Stake',
          description: 'Stake your rtETH to accrue rewards.',
          disabled: false,
          buttonLabel: 'Stake',
          action: () => hooks.stake().catch((e) => setErrorMsg(String(e))),
        },
      ].filter((step) => step !== null),
    [hooks],
  );

  return {
    steps: stepperData.length,
    stepperData,
    errorMsg,
    setErrorMsg,
  };
};

export default useRedeemBondsSteps;
