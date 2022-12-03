import { Dispatch, SetStateAction } from 'react';
import Box from '@mui/material/Box';
import { TableRow } from '@mui/material';
import { BigNumber } from 'ethers';

import {
  getLiquidityBodyCell,
  getUntransformedBodyCell,
  StyleLeftCell,
  StyleRightCell,
} from 'components/common/LpCommon/Table';
import { CustomButton, NumberDisplay, Typography } from 'components/UI';

import FillPosition from '../FillPosition';

import { DECIMALS_STRIKE } from 'constants/index';

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
          onClick={(e) => {
            handleFill(positionIdx);
            setAnchorEl(e.currentTarget);
          }}
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
