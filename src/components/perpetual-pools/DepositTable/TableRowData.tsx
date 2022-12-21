import { useCallback } from 'react';
// import { BigNumber } from 'ethers';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import Button from 'components/UI/Button';
import Typography from 'components/UI/Typography';

// import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

interface Props {
  amount: string;
  fundingEarned: string;
  withdrawableAmount: string;
  actionState: boolean;
}

const TableRowData = (props: Props) => {
  const { amount, fundingEarned, withdrawableAmount, actionState } = props;

  const handleWithdraw = useCallback(() => {
    console.log('Handle Withdraw');
  }, []);

  return (
    <TableRow>
      <TableCell className="border-0">
        <Typography variant="h6">${formatAmount(amount, 3)}</Typography>
      </TableCell>
      <TableCell className={`border-0`}>
        <Typography
          variant="h6"
          color={Number(fundingEarned) > 0 ? 'emerald-500' : 'stieglitz'}
        >
          ${formatAmount(fundingEarned, 3)}
        </Typography>
      </TableCell>
      <TableCell className="border-0" align="right">
        <Typography variant="h6">
          ${formatAmount(withdrawableAmount, 3)}
        </Typography>
      </TableCell>
      <TableCell className="border-0" align="right">
        <Button onClick={handleWithdraw} disabled={actionState}>
          Withdraw
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default TableRowData;
