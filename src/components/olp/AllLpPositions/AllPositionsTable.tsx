import { TableRow, TableCell } from '@mui/material';
import { BigNumber } from 'ethers';
import { CustomButton } from 'components/UI';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';
import { DECIMALS_STRIKE, DECIMALS_USD } from 'constants/index';
import FillPosition from '../FillPosition';
import { getBodyCell } from '../common/Table';

interface Props {
  originalIdxBeforeSort: number;
  strikePrice: BigNumber;
  liquidityProvided: BigNumber;
  discount: BigNumber;
  isFillModalOpen: boolean;
  isEpochExpired: boolean;
  handleFill: Function;
  closeFillModal: Function;
}

export default function AllPositionsTable(props: Props) {
  const {
    originalIdxBeforeSort,
    strikePrice,
    liquidityProvided,
    discount,
    isFillModalOpen,
    isEpochExpired,
    handleFill,
    closeFillModal,
  } = props;

  return (
    <TableRow key={originalIdxBeforeSort}>
      {getBodyCell(
        `$${formatAmount(
          getUserReadableAmount(strikePrice, DECIMALS_STRIKE),
          2
        )}`
      )}
      {getBodyCell(
        `$${formatAmount(
          getUserReadableAmount(liquidityProvided, DECIMALS_USD),
          2
        )}`
      )}
      {getBodyCell(`${formatAmount(getUserReadableAmount(discount, 0))}%`)}
      <TableCell align="center" className="pt-2">
        <CustomButton
          className="cursor-pointer text-white"
          color={!isEpochExpired ? 'primary' : 'mineshaft'}
          onClick={() => handleFill(originalIdxBeforeSort)}
          disabled={isEpochExpired}
        >
          Fill
        </CustomButton>
        {isFillModalOpen && (
          <FillPosition
            key={originalIdxBeforeSort}
            open={isFillModalOpen}
            handleClose={closeFillModal}
          />
        )}
      </TableCell>
    </TableRow>
  );
}
