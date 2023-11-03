import { useMemo } from 'react';

import { AlertSeverity } from 'components/common/Alert';

interface Props {
  amount: string;
  isRdpxApproved: boolean;
  isWethApproved: boolean;
  delegated: boolean;
  isTotalBondCostBreakdownLessThanUserBalance: boolean;
  isInsufficientWeth: boolean;
  approveRdpx: () => void;
  approveWeth: () => void;
  bond: () => void;
  bondWithDelegate: () => void;
}

const useBondPanelState = (props: Props) => {
  const {
    approveRdpx,
    approveWeth,
    bond,
    bondWithDelegate,
    isRdpxApproved,
    isWethApproved,
    isInsufficientWeth,
    amount,
    delegated,
    isTotalBondCostBreakdownLessThanUserBalance,
  } = props;

  return useMemo(() => {
    const defaultState = {
      label: 'Bond rtETH',
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
      label: 'Approve rDPX',
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
          label: 'Approve WETH & rDPX',
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
    } else {
      if (isInsufficientWeth) {
        return {
          ...defaultState,
          label: 'Bond',
          header: 'Insufficient WETH',
          severity: AlertSeverity.error,
          body: 'Insufficient WETH from delegates to perform this action.',
          disabled: true,
        };
      } else if (!isRdpxApproved) {
        return approveRdpxState;
      } else {
        return {
          ...defaultState,
          label: 'Bond with delegate',
          handler: () => bondWithDelegate(),
        };
      }
    }
    return { ...defaultState, handler: () => bond() };
  }, [
    amount,
    delegated,
    approveRdpx,
    isTotalBondCostBreakdownLessThanUserBalance,
    isWethApproved,
    isRdpxApproved,
    approveWeth,
    isInsufficientWeth,
    bondWithDelegate,
    bond,
  ]);
};

export default useBondPanelState;
