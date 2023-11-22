import { useMemo } from 'react';
import { parseUnits } from 'viem';

import alerts from 'components/rdpx-v2/AsidePanel/alerts';

import { DECIMALS_TOKEN } from 'constants/index';

interface Props {
  amount: string;
  balance: bigint;
  approved: boolean;
  approve: () => void;
  updateAllowance: () => void;
  delegate: () => void;
  updateUserDelegatePositions: () => void;
  fee: string;
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
    fee,
  } = props;

  return useMemo(() => {
    const doNothing = () => null;
    if (Number(amount) === 0 || isNaN(Number(amount))) {
      return {
        ...alerts.defaultDelegate,
        handler: doNothing,
      };
    } else if (Number(fee) > 20) {
      return {
        ...alerts.maxDelegateFee,
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
        ...alerts.defaultDelegate,
        header: null,
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
    fee,
    updateAllowance,
    updateUserDelegatePositions,
  ]);
};

export default useDelegatePanelState;
