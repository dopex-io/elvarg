import { Dispatch, SetStateAction } from 'react';
import Box from '@mui/material/Box';
import { TableRow, TableCell } from '@mui/material';
import { styled } from '@mui/material/styles';
import { BigNumber } from 'ethers';

import {
  getLiquidityBodyCell,
  getStrikeBodyCell,
  getUntransformedBodyCell,
} from 'components/common/LpCommon/Table';
import { CustomButton, NumberDisplay, Typography } from 'components/UI';

import FillPosition from '../FillPosition';

import { DECIMALS_STRIKE, DECIMALS_TOKEN, DECIMALS_USD } from 'constants/index';

const StyleLeftCell = styled(TableCell)`
  &.MuiTableCell-root {
    border-left: 1px solid #151515;
    border-bottom: solid 1px #151515;
    padding: 0.5rem 1rem;
  }
`;

const StyleRightCell = styled(TableCell)`
  &.MuiTableCell-root {
    border-right: solid #151515;
    border-bottom: solid 1px #151515;
    padding: 0.5rem 1rem;
  }
`;

const StyleCell = styled(TableCell)`
  &.MuiTableCell-root {
    border-bottom: solid 1px #151515;
    padding: 0.5rem 1rem;
  }
`;
interface Props {
  positionIdx: number;
  strikePrice: BigNumber;
  usdLiquidity: BigNumber;
  underlyingLiquidity: BigNumber;
  discount: BigNumber;
  isEpochExpired: boolean;
  handleFill: Function;
  anchorEl: HTMLElement | null;
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

  console.log('anchorEl: ', anchorEl);
  return (
    <TableRow
      key={positionIdx}
      className="text-white bg-cod-gray mb-2 rounded-lg"
    >
      <StyleLeftCell align="left">
        <Typography variant="caption" color="white">
          <Box className="bg-umbra w-14 p-2 border-radius rounded-lg flex justify-around">
            $<NumberDisplay n={strikePrice} decimals={DECIMALS_STRIKE} />
          </Box>
        </Typography>
      </StyleLeftCell>
      {getLiquidityBodyCell(
        underlyingSymbol,
        usdLiquidity,
        underlyingLiquidity,
        usdLiquidity.gt(BigNumber.from(0))
      )}
      {getUntransformedBodyCell(discount)}
      <StyleRightCell align="right" className="pt-2">
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
      </StyleRightCell>
    </TableRow>
  );
}
