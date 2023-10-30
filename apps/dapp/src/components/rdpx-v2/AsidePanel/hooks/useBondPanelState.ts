import { useMemo } from 'react';

import { AlertSeverity } from 'components/common/Alert';

interface Props {
  amount: string;
  isRdpxApproved: boolean;
  isWethApproved: boolean;
  delegated: boolean;
  isTotalBondCostBreakdownLessThanUserBalance: boolean;
  approveRdpx: () => void;
  approveWeth: () => void;
  bond: () => void;
}

const useBondPanelState = (props: Props) => {
  const {
    approveRdpx,
    approveWeth,
    bond,
    isRdpxApproved,
    isWethApproved,
    amount,
    delegated,
    isTotalBondCostBreakdownLessThanUserBalance,
  } = props;

  return useMemo(() => {
    const defaultState = {
      label: 'Bond',
      handler: () => null,
      header: null,
      body: null,
      severity: AlertSeverity.info,
      disabled: false,
    };
    const approveRdpxState = {
      ...defaultState,
      header: 'Approve rDPX',
      severity: AlertSeverity.warning,
      label: 'Approve',
      handler: () => approveRdpx(),
    };
    if (Number(amount) === 0 || isNaN(Number(amount))) {
      return { ...defaultState, disabled: true };
    } else if (!delegated) {
      if (isTotalBondCostBreakdownLessThanUserBalance) {
        return {
          ...defaultState,
          disabled: true,
          severity: AlertSeverity.error,
          header: 'Insufficient Balance',
          body: 'You do not have sufficient tokens to perform this transaction.',
        };
      } else if (!isWethApproved && !isRdpxApproved) {
        return {
          ...defaultState,
          header: 'Approve WETH & rDPX',
          severity: AlertSeverity.warning,
          label: 'Approve',
          handler: () => {
            approveWeth();
            approveRdpx();
          },
        };
      } else if (!isWethApproved) {
        return {
          ...defaultState,
          header: 'Approve WETH',
          severity: AlertSeverity.warning,
          label: 'Approve',
          handler: () => approveWeth(),
        };
      } else if (!isRdpxApproved) {
        return approveRdpxState;
      }
      if (!isRdpxApproved) {
        return approveRdpxState;
      }
    }
    return { ...defaultState, handler: () => bond() };
  }, [
    amount,
    approveRdpx,
    approveWeth,
    isRdpxApproved,
    isWethApproved,
    bond,
    delegated,
    isTotalBondCostBreakdownLessThanUserBalance,
  ]);
};

export default useBondPanelState;
