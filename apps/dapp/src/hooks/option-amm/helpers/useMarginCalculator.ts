import { useMemo } from 'react';
import { formatUnits, parseUnits } from 'viem';

import { useDebounce } from 'use-debounce';

export enum ManageMarginAction {
  AddCollateral,
  RemoveCollateral,
  OpenLong,
  OpenShort,
}

interface Props {
  collateralAmount: bigint; // 1e6
  availableCollateral: bigint; // 1e6
  activeCollateral: bigint; // 1e6
  liquidationThreshold: bigint; // 1e4 precision
  currentHealth: bigint; // 1e4 precision
  input: bigint; // 1e6 decimals
  action: ManageMarginAction;
}

const useMarginCalculator = (props: Props) => {
  const {
    collateralAmount = 1n,
    // availableCollateral,
    activeCollateral,
    // currentHealth,
    input,
    action,
  } = props;

  const newHealth = useMemo(() => {
    if (collateralAmount === 0n) return null;

    let newHealth = 0n;
    if (action === ManageMarginAction.AddCollateral) {
      newHealth =
        (activeCollateral * parseUnits('10', 6)) / (collateralAmount + input);
    } else if (action === ManageMarginAction.RemoveCollateral) {
      newHealth =
        ((activeCollateral + input) * parseUnits('10', 6)) / collateralAmount;
    }

    if (newHealth > 10000000n) return '100';
    else if (newHealth < 0n) return '0';
    else return formatUnits(newHealth, 5);
  }, [action, activeCollateral, collateralAmount, input]);

  const [debouncedHealth] = useDebounce(newHealth, 1000);

  return { newHealth: debouncedHealth };
};

export default useMarginCalculator;
