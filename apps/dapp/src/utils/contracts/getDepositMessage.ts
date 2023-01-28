import { BigNumber } from 'ethers';
import { DECIMALS_TOKEN, DECIMALS_USD } from 'constants/index';
import { getUserReadableAmount } from 'utils/contracts';

function getDepositMessage(
  isEpochExpired: boolean,
  depositAmount: number,
  assetIdx: number,
  approved: boolean,
  underlyingApproved: boolean,
  usdBalance: BigNumber,
  underlyingBalance: BigNumber,
  amount: number,
  rawAmount: string,
  display: string = 'Provide LP'
): string {
  if (isEpochExpired) return 'Expired';

  // check amount based on asset selected
  if (assetIdx === 0) {
    if (!approved) return 'Approve';
    else if (depositAmount > getUserReadableAmount(usdBalance, DECIMALS_USD))
      return 'Insufficient balance';
  } else if (assetIdx === 1) {
    if (!underlyingApproved) return 'Approve';
    else if (
      depositAmount > getUserReadableAmount(underlyingBalance, DECIMALS_TOKEN)
    )
      return 'Insufficient balance';
  } else {
    throw Error('cannot deposit!');
  }

  if (depositAmount === 0) return 'Insert an amount';

  // check discount amount
  if (amount < 1 || amount >= 100 || rawAmount.includes('.'))
    return 'Invalid discount or markup';

  return display;
}

export default getDepositMessage;
