import { Dispatch, SetStateAction } from 'react';
import { TableRow, TableCell } from '@mui/material';
import { BigNumber } from 'ethers';

import {
  getLiquidityBodyCell,
  getStrikeBodyCell,
  getUntransformedBodyCell,
} from 'components/common/LpCommon/Table';
import { CustomButton } from 'components/UI';

import FillPosition from '../FillPosition';

interface Props {
  positionIdx: number;
  strikePrice: BigNumber;
  usdLiquidity: BigNumber;
  underlyingLiquidity: BigNumber;
  discount: BigNumber;
  isEpochExpired: boolean;
  handleFill: Function;
  anchorEl: HTMLElement;
  setAnchorEl: Dispatch<SetStateAction<HTMLElement | null>>;
  underlyingSymbol: string;
}

export default function AllPositionsTable(props: Props) {
  const {
    positionIdx,
    strikePrice,
    usdLiquidity,
    underlyingLiquidity,
    discount,
    isEpochExpired,
    handleFill,
    anchorEl,
    setAnchorEl,
    underlyingSymbol,
  } = props;

  return (
    <TableRow key={positionIdx} className="text-white bg-umbra mb-2 rounded-lg">
      {getStrikeBodyCell(strikePrice)}
      {getLiquidityBodyCell(
        underlyingSymbol,
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
        {anchorEl && (
          <FillPosition
            key={positionIdx}
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
          />
        )}
      </TableCell>
    </TableRow>
  );
}
