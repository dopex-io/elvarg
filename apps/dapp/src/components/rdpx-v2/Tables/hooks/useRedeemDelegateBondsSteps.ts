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
          'Claim rtETH across all matured delegate bonds in a single transaction. This is only supported for Delegation Controller V2.',
        disabled: false,
        buttonLabel: 'Claim',
        action: () => hooks.multiredeem().catch((e) => setErrorMsg(String(e))),
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
