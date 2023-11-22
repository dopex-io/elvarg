import { useMemo } from 'react';

import { useAccount } from 'wagmi';

import useRdpxV2CoreData from 'hooks/rdpx/useRdpxV2CoreData';

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
  hasInsufficientLiquidity: boolean;
  approveRdpx: () => void;
  approveWeth: () => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
    setOpen,
    isRdpxApproved,
    isWethApproved,
    isInsufficientWeth,
    hasInsufficientLiquidity,
    delegated,
    isTotalBondCostBreakdownLessThanUserBalance,
  } = props;

  const { address: user = '0x' } = useAccount();
  const { updateUserBonds } = useRdpxV2CoreData({
    user,
  });

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
      } else if (Number(amount) <= 0.01) {
        return {
          ...alerts.minimumBondAmount,
          handler: doNothing,
        };
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
      } else if (hasInsufficientLiquidity) {
        return {
          ...defaultState,
          header: 'Insufficient Liquidity',
          body: `There is insufficient liquidity in the Perpetual Put Vault to perform this action. 
                 You can proceed to add liquidity and bond based on your input amount.`,
          severity: AlertSeverity.warning,
          handler: () => setOpen(true),
        };
      } else {
        return {
          ...defaultState,
          handler: () =>
            bond()
              .then(async () => {
                setAmount('');
                updateUserBonds();
              })
              .catch((e) => console.error(e)),
        };
      }
    } else {
      if (isInputInvalid) {
        return {
          ...alerts.defaultBondWithDelegate,
          handler: doNothing,
        };
      } else if (Number(amount) <= 0.01) {
        return {
          ...alerts.minimumBondAmount,
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
    hasInsufficientLiquidity,
    approveWeth,
    setOpen,
    bond,
    setAmount,
    updateUserBonds,
    isInsufficientWeth,
    bondWithDelegate,
  ]);
};

export default useBondPanelState;
