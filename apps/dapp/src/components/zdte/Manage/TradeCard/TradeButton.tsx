import { useMemo } from 'react';

import { BigNumber } from 'ethers';

import { Button } from '@dopex-io/ui';

import { ISpreadPair, IZdteUserData } from 'store/Vault/zdte';

import { getUserReadableAmount } from 'utils/contracts';

import { DECIMALS_USD } from 'constants/index';

type PositionStatus =
  | 'Insert an Amount'
  | 'Insufficient Liquidity'
  | 'Insufficient Balance'
  | 'Must Select Both Strikes'
  | 'Open Position';

function canOpenPosition(
  amount: number,
  quoteTokenBalance: BigNumber,
  selectedSpreadPair: ISpreadPair | undefined,
  canOpenSpread: boolean
): PositionStatus {
  // 0 < amount to open <= balance
  if (amount !== 0 && selectedSpreadPair?.longStrike === undefined) {
    return 'Must Select Both Strikes';
  }
  if (amount <= 0) {
    return 'Insert an Amount';
  }
  if (amount > getUserReadableAmount(quoteTokenBalance, DECIMALS_USD)) {
    return 'Insufficient Balance';
  }
  // check if it's possible to open position
  else if (!canOpenSpread) {
    return 'Insufficient Liquidity';
  }
  // both long and short are selected
  else if (
    selectedSpreadPair?.longStrike === undefined ||
    selectedSpreadPair?.shortStrike === undefined
  ) {
    return 'Must Select Both Strikes';
  }
  return 'Open Position';
}

const TradeButton = ({
  amount,
  selectedSpreadPair,
  userZdteLpData,
  handleApprove,
  handleOpenPosition,
  approved,
  canOpenSpread,
}: {
  amount: string | number;
  selectedSpreadPair: ISpreadPair;
  userZdteLpData: IZdteUserData;
  handleApprove: () => Promise<void>;
  handleOpenPosition: () => Promise<void>;
  approved: boolean;
  canOpenSpread: boolean;
}) => {
  const positionStatus: PositionStatus = useMemo(() => {
    return canOpenPosition(
      Number(amount),
      userZdteLpData?.userQuoteTokenBalance!,
      selectedSpreadPair,
      canOpenSpread
    );
  }, [selectedSpreadPair, amount, userZdteLpData, canOpenSpread]);

  return (
    <Button
      onClick={!approved ? handleApprove : handleOpenPosition}
      disabled={approved && positionStatus !== 'Open Position'}
      color={
        !approved || positionStatus === 'Open Position'
          ? 'primary'
          : 'mineshaft'
      }
      className="w-full"
    >
      {amount === 0 || approved ? positionStatus : 'Approve'}
    </Button>
  );
};

export default TradeButton;
