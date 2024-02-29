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
    () => [
      {
        label: 'Approve Bond',
        description: 'Approval is required to claim your bond.',
        disabled: false,
        buttonLabel: 'Approve',
        action: () => hooks.approveBond().catch((e) => setErrorMsg(String(e))),
      },
      {
        label: 'Claim',
        description: 'Claim rtETH that is vested to you over time.',
        disabled: false,
        buttonLabel: 'Claim',
        action: () => hooks.vest().catch((e) => setErrorMsg(String(e))),
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

export default useRedeemBondsSteps;
