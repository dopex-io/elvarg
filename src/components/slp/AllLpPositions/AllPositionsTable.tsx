import { TableRow, TableCell } from '@mui/material';
import { BigNumber } from 'ethers';
import { CustomButton } from 'components/UI';
import FillPosition from '../FillPosition';
import {
  getLiquidityBodyCell,
  getStrikeBodyCell,
  getUntransformedBodyCell,
} from 'components/common/LpCommon/Table';

interface Props {
  originalIdxBeforeSort: number;
  strike: BigNumber;
  liquidity: BigNumber;
  markup: BigNumber;
  isFillModalOpen: boolean;
  isEpochExpired: boolean;
  handleFill: Function;
  closeFillModal: Function;
}

export default function AllPositionsTable(props: Props) {
  const {
    originalIdxBeforeSort,
    strike,
    liquidity,
    markup,
    isFillModalOpen,
    isEpochExpired,
    handleFill,
    closeFillModal,
  } = props;

  return (
    <TableRow
      key={originalIdxBeforeSort}
      className="text-white bg-umbra mb-2 rounded-lg"
    >
      {getStrikeBodyCell(strike)}
      {getLiquidityBodyCell('', liquidity, BigNumber.from(0))}
      {getUntransformedBodyCell(markup)}
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
