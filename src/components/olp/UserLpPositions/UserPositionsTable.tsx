import { TableRow, TableCell } from '@mui/material';
import { BigNumber } from 'ethers';
import { Typography, CustomButton } from 'components/UI';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import {
  DEFAULT_STRIKE_DECIMALS,
  DEFAULT_TOKEN_DECIMALS,
  DEFAULT_USD_DECIMALS,
} from 'constants/index';
import formatAmount from 'utils/general/formatAmount';

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
      <TableCell className="pt-1">
        <Typography variant="h6" className="text-center">
          $
          {formatAmount(
            getUserReadableAmount(strikePrice, DEFAULT_STRIKE_DECIMALS),
            2
          )}
        </Typography>
      </TableCell>
      <TableCell className="pt-1">
        <Typography variant="h6" className="text-center">
          $
          {formatAmount(
            getUserReadableAmount(liquidityProvided, DEFAULT_USD_DECIMALS),
            2
          )}
        </Typography>
      </TableCell>
      <TableCell className="pt-1">
        <Typography variant="h6" className="text-center">
          $
          {formatAmount(
            getUserReadableAmount(liquidityUsed, DEFAULT_USD_DECIMALS),
            2
          )}
        </Typography>
      </TableCell>
      <TableCell className="pt-1">
        <Typography variant="h6" className="text-center">
          {formatAmount(getUserReadableAmount(discount, 0), 2)}%
        </Typography>
      </TableCell>
      <TableCell className="pt-1">
        <Typography variant="h6" className="text-center">
          {getUserReadableAmount(purchased, DEFAULT_TOKEN_DECIMALS)}
        </Typography>
      </TableCell>
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
