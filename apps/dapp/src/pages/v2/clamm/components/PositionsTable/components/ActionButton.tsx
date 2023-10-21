import React, { useCallback, useMemo } from 'react';

import { Button } from '@dopex-io/ui';

type Props = {
  selectedPositions: Map<number, any | null>;
  positionsTypeIndex: number;
};
const ActionButton = (props: Props) => {
  const { positionsTypeIndex, selectedPositions } = props;

  const handleWithdraw = useCallback(() => {}, []);
  const handleExercise = useCallback(() => {}, []);

  const buttonProps = useMemo(() => {
    const isBuyPositions = positionsTypeIndex === 0;
    const action = isBuyPositions ? 'Exercise' : 'Withdraw';
    return {
      buttonText: selectedPositions.size === 0 ? 'Select positions' : action,
      disabled: selectedPositions.size === 0,
    };
  }, [positionsTypeIndex, selectedPositions]);
  return (
    <Button
      size="small"
      variant={buttonProps.disabled ? 'text' : 'contained'}
      disabled={buttonProps.disabled}
      className="w-[200px] bg-carbon"
    >
      {buttonProps.buttonText}
    </Button>
  );
};

export default ActionButton;
