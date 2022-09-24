import { TableRow, TableCell } from '@mui/material';
import { BigNumber } from 'ethers';
import { CustomButton } from 'components/UI';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import { DECIMALS_STRIKE, DECIMALS_TOKEN, DECIMALS_USD } from 'constants/index';
import formatAmount from 'utils/general/formatAmount';
import { getBodyCell } from '../common/Table';

interface Props {
  option: string;
  strikePrice: BigNumber;
  liquidityProvided: BigNumber;
  liquidityUsed: BigNumber;
  discount: BigNumber;
  purchased: BigNumber;
  actions: Function;
}

export default function UserPositionsTable(props: Props) {
  const {
    strikePrice,
    liquidityProvided,
    liquidityUsed,
    discount,
    purchased,
    actions,
  } = props;

  return (
    <TableRow>
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
      {getBodyCell(
        `$${formatAmount(
          getUserReadableAmount(liquidityUsed, DECIMALS_USD),
          2
        )}`
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
