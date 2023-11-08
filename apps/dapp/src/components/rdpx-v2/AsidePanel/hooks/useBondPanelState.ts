import { useMemo } from 'react';

import { AlertSeverity } from 'components/common/Alert';
import alerts from 'components/rdpx-v2/AsidePanel/alerts';

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
    const doNothing = () => null;
    const defaultState = { ...alerts.defaultBond, handler: doNothing };
    const approveRdpxState = {
      ...alerts.insufficientAllowance,
      header: 'Approve rDPX',
      handler: () => approveRdpx(),
    };
    if (Number(amount) === 0 || isNaN(Number(amount))) {
      return { ...alerts.zeroAmount, handler: doNothing };
    } else if (!delegated) {
      if (isTotalBondCostBreakdownLessThanUserBalance) {
        return {
          ...alerts.insufficientBalance,
          handler: doNothing,
        };
      } else if (!isWethApproved && !isRdpxApproved) {
        return {
          ...alerts.insufficientAllowance,
          header: 'Approve WETH & rDPX',
          handler: () => {
            approveWeth();
            approveRdpx();
          },
        };
      } else if (!isWethApproved) {
        return {
          ...alerts.insufficientAllowance,
          header: 'Approve WETH',
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
