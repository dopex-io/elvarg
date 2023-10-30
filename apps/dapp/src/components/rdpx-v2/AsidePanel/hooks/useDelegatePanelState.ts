import { useMemo } from 'react';
import { parseUnits } from 'viem';

import alerts from 'components/rdpx-v2/AsidePanel/BondPanel/alerts';

import { DECIMALS_TOKEN } from 'constants/index';

interface Props {
  amount: string;
  balance: bigint;
  approved: boolean;
  approve: () => void;
  updateAllowance: () => void;
  delegate: () => void;
  updateUserDelegatePositions: () => void;
}

const useDelegatePanelState = (props: Props) => {
  const {
    balance,
    approved,
    amount,
    approve,
    updateAllowance,
    delegate,
    updateUserDelegatePositions,
  } = props;

  return useMemo(() => {
    const doNothing = () => null;
    if (Number(amount) === 0 || isNaN(Number(amount))) {
      return {
        ...alerts.zeroAmount,
        handler: doNothing,
      };
    } else if (balance < parseUnits(amount, DECIMALS_TOKEN)) {
      return {
        ...alerts.insufficientBalance,
        handler: doNothing,
      };
    } else if (!approved) {
      return {
        ...alerts.insufficientAllowance,
        handler: () => {
          approve();
          updateAllowance();
        },
      };
    } else {
      return {
        ...alerts.default,
        disabled: false,
        handler: () => {
          delegate();
          updateUserDelegatePositions();
        },
      };
    }
  }, [
    amount,
    approve,
    approved,
    balance,
    delegate,
    updateAllowance,
    updateUserDelegatePositions,
  ]);
};

export default useDelegatePanelState;
