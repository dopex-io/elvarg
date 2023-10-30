import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { BigNumber } from 'ethers';

import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';

import {
  getLiquidityBodyCell,
  getUntransformedBodyCell,
  StyleLeftCell,
  StyleRightCell,
} from 'components/common/LpCommon/Table';
import FillPosition from 'components/olp/FillPosition';
import CustomButton from 'components/UI/Button';
import NumberDisplay from 'components/UI/NumberDisplay';
import Typography from 'components/UI/Typography';

import { DECIMALS_STRIKE } from 'constants/index';

interface Props {
  positionIdx: number;
  strikePrice: BigNumber;
  usdLiquidity: BigNumber;
  underlyingLiquidity: BigNumber;
  discount: BigNumber;
  isEpochExpired: boolean;
  handleFill: Function;
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
    underlyingSymbol,
  } = props;

  const [isOpen, setIsOpen] = useState(false);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

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
            setIsOpen(true);
          }}
          disabled={isEpochExpired}
        >
          Fill
        </CustomButton>
        <FillPosition
          key={positionIdx}
          isOpen={isOpen}
          handleClose={handleClose}
        />
      </StyleRightCell>
    </TableRow>
  );
}
