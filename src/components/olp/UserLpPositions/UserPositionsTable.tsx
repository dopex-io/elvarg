import { TableRow, TableCell } from '@mui/material';
import { BigNumber } from 'ethers';
import { CustomButton } from 'components/UI';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import { DECIMALS_STRIKE, DECIMALS_TOKEN } from 'constants/index';
import formatAmount from 'utils/general/formatAmount';
import {
  getBodyCell,
  getLiquidityBodyCell,
} from 'components/common/LpCommon/Table';

interface Props {
  option: string;
  strikePrice: BigNumber;
  usdLiquidityProvided: BigNumber;
  usdLiquidityUsed: BigNumber;
  underlyingLiquidityProvided: BigNumber;
  underlyingLiquidityUsed: BigNumber;
  discount: BigNumber;
  purchased: BigNumber;
  actions: Function;
  selectedPoolName: string;
}

export default function UserPositionsTable(props: Props) {
  const {
    strikePrice,
    usdLiquidityProvided,
    usdLiquidityUsed,
    underlyingLiquidityProvided,
    underlyingLiquidityUsed,
    discount,
    purchased,
    actions,
    selectedPoolName,
  } = props;

  return (
    <TableRow className="text-white bg-umbra mb-2 rounded-lg">
      {getBodyCell(
        `$${formatAmount(
          getUserReadableAmount(strikePrice, DECIMALS_STRIKE),
          2
        )}`
      )}
      {getLiquidityBodyCell(
        selectedPoolName,
        usdLiquidityProvided,
        underlyingLiquidityProvided,
        usdLiquidityProvided.gt(BigNumber.from(0))
      )}
      {getLiquidityBodyCell(
        selectedPoolName,
        usdLiquidityUsed,
        underlyingLiquidityUsed,
        usdLiquidityProvided.gt(BigNumber.from(0))
      )}
      {getBodyCell(`${formatAmount(getUserReadableAmount(discount, 0))}%`)}
      {getBodyCell(`${getUserReadableAmount(purchased, DECIMALS_TOKEN)}`)}
      <TableCell align="center" className="pt-2">
        <CustomButton
          className="cursor-pointer text-white"
          color="primary"
          onClick={() => actions()}
        >
          Kill
        </CustomButton>
      </TableCell>
    </TableRow>
  );
}
