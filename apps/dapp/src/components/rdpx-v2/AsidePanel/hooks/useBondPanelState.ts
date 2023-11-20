import { useMemo } from 'react';

import { AlertSeverity } from 'components/common/Alert';
import alerts from 'components/rdpx-v2/AsidePanel/alerts';

interface Props {
  amount: string;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
  isRdpxApproved: boolean;
  isWethApproved: boolean;
  delegated: boolean;
  isTotalBondCostBreakdownLessThanUserBalance: boolean;
  isInsufficientWeth: boolean;
  approveRdpx: () => void;
  approveWeth: () => void;
  bond: () => Promise<any>;
  bondWithDelegate: () => void;
}

const useBondPanelState = (props: Props) => {
  const {
    amount,
    setAmount,
    approveRdpx,
    approveWeth,
    bond,
    bondWithDelegate,
    isRdpxApproved,
    isWethApproved,
    isInsufficientWeth,
    delegated,
    isTotalBondCostBreakdownLessThanUserBalance,
  } = props;

  return useMemo(() => {
    const doNothing = () => null;
    const defaultState = {
      ...alerts.defaultBond,
      severity: null,
      disabled: false,
      handler: doNothing,
    };
    const approveRdpxState = {
      ...alerts.insufficientAllowance,
      header: 'Approve rDPX',
      handler: () => approveRdpx(),
    };
    const isInputInvalid = Number(amount) === 0 || isNaN(Number(amount));
    if (!delegated) {
      if (isInputInvalid) {
        return { ...alerts.defaultBond, handler: doNothing };
      } else if (isTotalBondCostBreakdownLessThanUserBalance) {
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
      } else {
        return {
          ...defaultState,
          handler: () =>
            bond().then(() => {
              setAmount('');
            }),
        };
      }
    } else {
      if (isInputInvalid) {
        return {
          ...alerts.defaultBondWithDelegate,
          handler: doNothing,
        };
      } else if (isInsufficientWeth) {
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
          handler: () => bondWithDelegate(),
        };
      }
    }
  }, [
    amount,
    delegated,
    approveRdpx,
    isTotalBondCostBreakdownLessThanUserBalance,
    isWethApproved,
    isRdpxApproved,
    approveWeth,
    bond,
    setAmount,
    isInsufficientWeth,
    bondWithDelegate,
  ]);
};

export default useBondPanelState;
