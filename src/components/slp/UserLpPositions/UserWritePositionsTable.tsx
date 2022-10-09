import { TableRow, TableCell } from '@mui/material';
import { BigNumber } from 'ethers';
import { CustomButton } from 'components/UI';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import { DECIMALS_STRIKE, DECIMALS_TOKEN, DECIMALS_USD } from 'constants/index';
import formatAmount from 'utils/general/formatAmount';
import { getBodyCell } from 'components/common/LpCommon/Table';

interface Props {
  idx: number;
  strike: BigNumber;
  liquidity: BigNumber;
  liquidityUsed: BigNumber;
  markup: BigNumber;
  purchased: BigNumber;
  actions: Function;
}

export default function UserWritePositionsTable(props: Props) {
  const { idx, strike, liquidity, liquidityUsed, markup, purchased, actions } =
    props;

  return (
    <TableRow key={idx} className="text-white bg-umbra mb-2 rounded-lg">
      {getBodyCell(
        `$${formatAmount(getUserReadableAmount(strike, DECIMALS_STRIKE), 2)}`
      )}
      {getBodyCell(
        `$${formatAmount(getUserReadableAmount(liquidity, DECIMALS_USD), 2)}`
      )}
      {getBodyCell(
        `$${formatAmount(
          getUserReadableAmount(liquidityUsed, DECIMALS_USD),
          2
        )}`
      )}
      {getBodyCell(`${formatAmount(getUserReadableAmount(markup, 0))}%`)}
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
