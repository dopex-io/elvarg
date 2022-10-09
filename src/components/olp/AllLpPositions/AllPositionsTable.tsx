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
  positionIdx: number;
  strikePrice: BigNumber;
  usdLiquidity: BigNumber;
  underlyingLiquidity: BigNumber;
  discount: BigNumber;
  isFillModalOpen: boolean;
  isEpochExpired: boolean;
  handleFill: Function;
  closeFillModal: Function;
  selectedPoolName: string;
}

export default function AllPositionsTable(props: Props) {
  const {
    positionIdx,
    strikePrice,
    usdLiquidity,
    underlyingLiquidity,
    discount,
    isFillModalOpen,
    isEpochExpired,
    handleFill,
    closeFillModal,
    selectedPoolName,
  } = props;

  return (
    <TableRow key={positionIdx} className="text-white bg-umbra mb-2 rounded-lg">
      {getStrikeBodyCell(strikePrice)}
      {getLiquidityBodyCell(
        selectedPoolName,
        usdLiquidity,
        underlyingLiquidity,
        usdLiquidity.gt(BigNumber.from(0))
      )}
      {getUntransformedBodyCell(discount)}
      <TableCell align="center" className="pt-2">
        <CustomButton
          className="cursor-pointer text-white"
          color={!isEpochExpired ? 'primary' : 'mineshaft'}
          onClick={() => handleFill(positionIdx)}
          disabled={isEpochExpired}
        >
          Fill
        </CustomButton>
        {isFillModalOpen && (
          <FillPosition
            key={positionIdx}
            open={isFillModalOpen}
            handleClose={closeFillModal}
          />
        )}
      </TableCell>
    </TableRow>
  );
}
