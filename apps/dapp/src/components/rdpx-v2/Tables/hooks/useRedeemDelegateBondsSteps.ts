import { useMemo, useState } from 'react';
import { Address } from 'viem';

interface Props {
  hooks: {
    multiredeem: () => Promise<any>;
    approveStaking: () => Promise<any>;
    stake: () => Promise<any>;
  };
  user: Address;
}

const useRedeemDelegateBondsSteps = (props: Props) => {
  const { hooks } = props;

  const [errorMsg, setErrorMsg] = useState<string>('');

  const stepperData = useMemo(
    () => [
      {
        label: 'Multi-claim',
        description:
          'Claim rtETH across all matured delegate bonds in a single transaction.',
        disabled: false,
        buttonLabel: 'Claim',
        action: () => hooks.multiredeem().catch((e) => setErrorMsg(String(e))),
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
    ],
    [hooks],
  );

  return {
    stepperData,
    errorMsg,
    setErrorMsg,
  };
};

export default useRedeemDelegateBondsSteps;
