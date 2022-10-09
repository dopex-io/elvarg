import { TableRow, TableCell } from '@mui/material';
import { BigNumber } from 'ethers';
import { CustomButton } from 'components/UI';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';
import { DECIMALS_STRIKE, DECIMALS_TOKEN, DECIMALS_USD } from 'constants/index';
import SettlePosition from '../SettlePosition';
import { getBodyCell } from 'components/common/LpCommon/Table';

interface Props {
  purchasePositionIdx: number;
  receiptId: BigNumber;
  strike: BigNumber;
  amount: BigNumber;
  pnl: BigNumber;
  isFillModalOpen: boolean;
  canSettle: boolean;
  isEpochExpired: boolean;
  handleSettle: Function;
  closeFillModal: Function;
}

export default function PurchasePositionsTable(props: Props) {
  const {
    purchasePositionIdx,
    isEpochExpired,
    receiptId,
    strike,
    amount,
    pnl,
    isFillModalOpen,
    canSettle,
    handleSettle,
    closeFillModal,
  } = props;

  return (
    <TableRow
      key={purchasePositionIdx}
      className="text-white bg-umbra mb-2 rounded-lg"
    >
      {getBodyCell(
        `$${formatAmount(getUserReadableAmount(strike, DECIMALS_STRIKE), 2)}`
      )}
      {getBodyCell(
        `$${formatAmount(getUserReadableAmount(amount, DECIMALS_TOKEN), 2)}`
      )}
      {getBodyCell(
        `$${formatAmount(getUserReadableAmount(pnl, DECIMALS_USD), 2)}`
      )}

      <TableCell align="center" className="pt-2">
        <CustomButton
          className="cursor-pointer text-white"
          color="primary"
          disabled={!isEpochExpired || pnl.eq(BigNumber.from(0))}
          onClick={() => handleSettle(receiptId)}
        >
          Settle
        </CustomButton>
        {canSettle && (
          <SettlePosition
            key={purchasePositionIdx}
            open={isFillModalOpen}
            handleClose={closeFillModal}
          />
        )}
      </TableCell>
    </TableRow>
  );
}
