import { TableRow, TableCell } from '@mui/material';
import { BigNumber } from 'ethers';
import { Typography, CustomButton } from 'components/UI';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';
import {
  DEFAULT_STRIKE_DECIMALS,
  DEFAULT_TOKEN_DECIMALS,
} from 'constants/index';
import FillPositionRolp from '../FillPositionRolp';

interface Props {
  lpId: number;
  originalIdxBeforeSort: number;
  option: string;
  strikePrice: BigNumber;
  numTokensProvided: BigNumber;
  numTokensSold: BigNumber;
  markup: BigNumber;
  usdReceived: BigNumber;
  isFillModalOpen: boolean;
  handleFill: Function;
  closeFillModal: Function;
}

export default function AllPositionsTable(props: Props) {
  const {
    originalIdxBeforeSort,
    strikePrice,
    numTokensProvided,
    markup,
    isFillModalOpen,
    handleFill,
    closeFillModal,
  } = props;

  return (
    <TableRow key={originalIdxBeforeSort}>
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
          {formatAmount(
            getUserReadableAmount(numTokensProvided, DEFAULT_TOKEN_DECIMALS),
            2
          )}
        </Typography>
      </TableCell>
      <TableCell className="pt-1">
        <Typography variant="h6" className="text-center">
          {formatAmount(getUserReadableAmount(markup, 0))}%
        </Typography>
      </TableCell>
      <TableCell align="center" className="pt-2">
        <CustomButton
          className="cursor-pointer text-white"
          color="primary"
          onClick={() => handleFill(originalIdxBeforeSort)}
        >
          Fill
        </CustomButton>
        {isFillModalOpen && (
          <FillPositionRolp
            key={originalIdxBeforeSort}
            open={isFillModalOpen}
            handleClose={closeFillModal}
          />
        )}
      </TableCell>
    </TableRow>
  );
}
